from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from backend.scraper import views as scrape_views

router = routers.DefaultRouter()
router.register(r"scrapes", scrape_views.ScrapeViewSet, basename="scrapes")

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", include(router.urls)),
]
