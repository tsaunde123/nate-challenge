import re
from typing import Tuple, Dict

import requests
from bs4 import BeautifulSoup
from datetime import timedelta

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils.timezone import now

from .serializers import ScraperEntitySerializer


@api_view(["GET"])
def time(request):
    import time

    return Response({"time": time.time()})


@api_view(["POST"])
def scrape(request):
    ser = ScraperEntitySerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    sample_size = ser.validated_data["sample_size"]
    context = dict(sample_size=sample_size)
    entity, created = ser.save()

    if not created:
        last_scrape = now() - entity.start_time
        # we return the saved results if they were scraped in the last 3h
        if last_scrape < timedelta(hours=3):
            return Response(ScraperEntitySerializer(entity, context=context).data)

    html, word_occurrences = scrape_url(entity.url)
    entity.html = html
    entity.word_occurrences = word_occurrences
    entity.end_time = now()
    entity.save()

    return Response(ScraperEntitySerializer(entity, context=context).data)


def scrape_url(url: str) -> Tuple[str, Dict[str, int]]:
    words_pattern = "[a-zA-Z]+"

    try:
        page = requests.get(url)
        raw_html = page.text
        html = page.content
        soup = BeautifulSoup(html, "html.parser")

        words = re.findall(words_pattern, soup.text)
        occurrences = {}
        for word in words:
            occurrences[word.lower()] = occurrences.get(word.lower(), 0) + 1
        return raw_html, occurrences
    except Exception:
        return "", {}
