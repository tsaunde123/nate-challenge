import logging

from django.utils import timezone
from celery import shared_task

from .models import Scrape
from .scrapers import scrape_page

logger = logging.getLogger(__name__)


@shared_task
def scrape(scrape_id: int):
    try:
        obj: Scrape = Scrape.objects.get(id=scrape_id)
    except Scrape.DoesNotExist:
        return

    try:
        text = scrape_page(obj.url)
        logger.info(f"Received text from {obj.url}")
        obj.count_words(text)
    except Exception as e:
        obj.error = True
        logger.exception(f"Could not count words fpr {obj.url}")
    finally:
        obj.completed_at = timezone.now()
        obj.save()