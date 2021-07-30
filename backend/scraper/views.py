import re

import requests
from bs4 import BeautifulSoup

from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound
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
    ser = ScraperEntitySerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    # entity, created = ser.save()

    url = ser.validated_data["url"].rstrip("/")
    sample_size = ser.validated_data["sample_size"]
    context = dict(sample_size=sample_size)
    entity = scrape_url(url)

    return Response(ScraperEntitySerializer(entity, context=context).data)


def scrape_url(url: str) -> ScraperEntity:
    words_pattern = "[a-zA-Z]+"

    try:
        entity = ScraperEntity.objects.get(url=url)
        page = requests.get(url)
        html = page.content
        soup = BeautifulSoup(html, "html.parser")

        words = re.findall(words_pattern, soup.text)
        occurrences = {}
        for word in words:
            occurrences[word.lower()] = occurrences.get(word.lower(), 0) + 1

        entity.html = page.text
        entity.word_occurrences = occurrences
        entity.end_time = now()
        entity.save()
        return entity
    except ScraperEntity.DoesNotExist:
        # TODO handle
        raise NotFound
