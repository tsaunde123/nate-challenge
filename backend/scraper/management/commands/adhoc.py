import re
import string

import requests
from bs4 import BeautifulSoup

from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Adhoc'

    def handle(self, *args, **kwargs):
        words_pattern = '[a-zA-Z]+'
        printable = set(string.printable)
        url = "https://www.bbc.co.uk/"
        url2 = "https://norvig.com/big.txt"

        page = requests.get(url)
        html = page.content

        soup = BeautifulSoup(html, "html.parser")

        # regex = re.compile(words_pattern)
        # regex = re.compile('[^a-zA-Z]')
        # s = "   Can't Some weird str§ing's * ?//"" @#$ 3"
        # s3 = regex.sub(' ', s)
        words = re.findall(words_pattern, soup.text)
        occurrences = {}
        for word in words:
            occurrences[word.lower()] = occurrences.get(word.lower(), 0) + 1
        end = ""
