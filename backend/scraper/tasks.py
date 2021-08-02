from django.utils import timezone
from celery import shared_task

from .scrapers import scrape
from .models import Scrape


@shared_task
def scrape_async(scrape_id: int):
    try:
        obj = Scrape.objects.get(id=scrape_id)
    except Scrape.DoesNotExist:
        return

    words = scrape(obj.url)
    print(f'Found {len(words)} words in {obj.url}')
    obj.completed_at = timezone.now()
    obj.save()