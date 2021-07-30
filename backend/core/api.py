from django.urls import path

from scraper.views import time, scrape, list_searches

urlpatterns = [
    path("time", time),
    path("scrape", scrape),
    path("searches", list_searches),
]
