from django.db import models


class ScraperEntity(models.Model):
    """a table that stores scraped results and tracks running scraper processes"""
    url = models.URLField(unique=True, db_index=True, blank=False, null=False)
    word_occurrences = models.JSONField(null=True, blank=True)

    error = models.BooleanField(default=False)
    last_refresh = models.DateTimeField(auto_now_add=True)

    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True)

    def __str__(self):
        return f"{self.url}"
