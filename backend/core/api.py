from django.urls import path

from scraper.views import time, scrape, history

urlpatterns = [
    path("time", time),
    path("scrape", scrape),
    path("history", history),
]
