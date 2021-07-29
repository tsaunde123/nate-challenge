from django.urls import path

from scraper.views import time, scrape

urlpatterns = [
    path("time", time),
    path("scrape", scrape),
]
