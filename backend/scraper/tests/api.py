from django.test import TestCase

from ..models import ScraperEntity


class TestScrapeEndpoint(TestCase):
    def test_creates_new_entity(self):
        data = {
            "url": "https://www.bbc.com",
            "sample_size": 10,
        }
        ScraperEntity.objects.create(url="https://www.anotherurl.com")
        response = self.client.post("/api/scrape", data=data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(ScraperEntity.objects.count(), 2)

    def test_updates_existing_entity(self):
        url = "https://www.bbc.com"
        data = {
            "url": url,
            "sample_size": 10,
        }
        ScraperEntity.objects.create(url=url)
        response = self.client.post("/api/scrape", data=data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(ScraperEntity.objects.count(), 1)

    def test_existing_entity_gets_properties_updated(self):
        url = "https://www.bbc.com"
        data = {
            "url": url,
            "sample_size": 10,
        }
        entity = ScraperEntity.objects.create(url=url)
        # end_time not set when the object is created
        self.assertIsNone(entity.end_time)
        self.client.post("/api/scrape", data=data)
        entity = ScraperEntity.objects.get(url=url)
        # end_time and start_time are set equal when the object is updated
        self.assertIsNotNone(entity.end_time)
        self.assertEqual(entity.end_time, entity.start_time)
        self.assertEqual(ScraperEntity.objects.count(), 1)

    def test_searches_returns_urls(self):
        url = "https://www.bbc.com"
        url2 = "https://www.someurl.com"
        ScraperEntity.objects.create(url=url)
        ScraperEntity.objects.create(url=url2)
        response = self.client.get("/api/searches")
        self.assertEqual(len(response.data["urls"]), 2)
