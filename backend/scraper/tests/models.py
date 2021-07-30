from django.test import TestCase

from ..models import ScraperEntity


class TestScraperEntityModel(TestCase):
    def test_tostr(self):
        url = "https://www.bbc.com"
        entity = ScraperEntity.objects.create(url=url)
        self.assertEqual(str(entity), url)
