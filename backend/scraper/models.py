from collections import Counter
from string import punctuation

from django.db import models


class Scrape(models.Model):
    url = models.URLField(null=False, blank=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    completed_at = models.DateTimeField(null=True, blank=False)
    error = models.BooleanField(default=False, null=False)

    def count_words(self, text: str):
        """A method that counts words and saves their occurrence"""
        counts = Counter((x.rstrip(punctuation).lower() for x in text.split()))
        objs = [
            WordCount(word=word, count=count, scrape=self)
            for (word, count) in counts.items()
        ]
        # insert in bulk to avoid having too many queries
        WordCount.objects.bulk_create(objs)

    def __str__(self):
        return f'{self.url} - {self.created_at}'


class WordCount(models.Model):
    scrape = models.ForeignKey(
        Scrape, on_delete=models.CASCADE, related_name="words"
    )
    word = models.CharField(max_length=200)
    count = models.BigIntegerField()

    def __str__(self):
        return f'{self.word} - {self.count}'
