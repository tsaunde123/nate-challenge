import sys

from django.core.management.base import BaseCommand

from ...models import ScraperEntity


class Command(BaseCommand):
    help = 'Command for executing adhoc tasks'

    def handle(self, *args, **kwargs):
        # add logic here
        ScraperEntity.objects.filter(url="https://www.swr.com").delete()
        sys.exit()
