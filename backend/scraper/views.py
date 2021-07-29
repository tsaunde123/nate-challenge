import re
import string

import requests
from bs4 import BeautifulSoup

from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def time(request):
    import time
    return Response({"time": time.time()})


@api_view(["POST"])
def scrape(request):
    url = request.data["url"]
    sample_size = request.data["sample_size"]
    words_pattern = '[a-zA-Z]+'

    page = requests.get(url)
    html = page.content
    soup = BeautifulSoup(html, "html.parser")

    words = re.findall(words_pattern, soup.text)
    occurrences = {}
    for word in words:
        occurrences[word.lower()] = occurrences.get(word.lower(), 0) + 1

    keys = list(occurrences.keys())[:sample_size]
    sample = {key: occurrences[key] for key in keys}
    return Response({"word_occurrences": sample})
