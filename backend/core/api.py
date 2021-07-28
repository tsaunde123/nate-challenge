from django.urls import path

from scraper.views import time

urlpatterns = [
    path("time", time),
]
