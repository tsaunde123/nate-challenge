from django.urls import path

from scraper.views import time, scrape_view, history

urlpatterns = [
    path("time", time),
    path("scrape", scrape_view),
    path("history", history),
]
