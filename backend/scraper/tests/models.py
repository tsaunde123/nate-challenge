from django.test import TestCase

from backend.scraper.models import Scrape, WordCount


class TestScrapeModel(TestCase):
    def test_count_words(self):
        expected = [('tell', 2), ('the', 1), ('audience', 1), ('what', 2), ("you're", 1), ('going', 1), ('to', 1), ('say', 2), ('it', 1), ('then', 1), ('them', 1), ("you've", 1), ('said', 1)]

        url = "https://www.bbc.com"
        text = "Tell the audience what you're going to say. Say it. Then tell them what you've said."
        scrape = Scrape.objects.create(url=url)
        scrape.count_words(text)
        self.assertEqual(scrape.words.count(), 13)
        word_counts = list(WordCount.objects.values_list('word', 'count'))
        self.assertEqual(expected, word_counts)
