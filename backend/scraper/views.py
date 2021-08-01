import re
from typing import Tuple, Dict

import requests
from bs4 import BeautifulSoup
from datetime import timedelta

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils.timezone import now

from .models import ScraperEntity
from .serializers import ScraperEntitySerializer


@api_view(["GET"])
def time(request):
    import time

    return Response({"time": time.time()})


@api_view(["POST"])
def scrape(request):
    """ Given a url, this view scrapes the page and returns word occurrences """
    ser = ScraperEntitySerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    sample_size = ser.validated_data["sample_size"]
    context = dict(sample_size=sample_size)
    entity, created = ser.save()

    if not created:
        last_scrape = now() - entity.last_refresh
        # we return the saved results if they were scraped in the last 3h
        if last_scrape < timedelta(hours=3):
            return Response(ScraperEntitySerializer(entity, context=context).data)

    start_time = now()
    word_occurrences, error = scrape_url(entity.url)
    entity.error = error
    entity.word_occurrences = word_occurrences
    entity.start_time = start_time
    entity.last_refresh = start_time
    entity.end_time = now()
    entity.save()

    return Response(ScraperEntitySerializer(entity, context=context).data)


@api_view(["GET"])
def list_searches(request):
    """ Return the latest 10 searched urls, ordered """
    urls = ScraperEntity.objects.all().order_by("-start_time").values_list("url", flat=True)[:10]
    return Response(dict(urls=urls))


def scrape_url(url: str) -> Tuple[Dict[str, int], bool]:
    words_pattern = "[a-zA-Z]+"
    error = False

    try:
        page = requests.get(url, timeout=5)
        html = page.content
        soup = BeautifulSoup(html, "html.parser")

        words = re.findall(words_pattern, soup.text)
        occurrences = {}
        for word in words:
            occurrences[word.lower()] = occurrences.get(word.lower(), 0) + 1
        return occurrences, error
    except Exception:
        error = True
        return {}, error
