from django.db.models import Prefetch
from rest_framework import mixins, viewsets, status
from rest_framework.response import Response

from .models import Scrape, WordCount
from .serializers import ScrapeSerializer
from .tasks import scrape


class ScrapeViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = ScrapeSerializer
    queryset = (
        Scrape.objects.all()
        .order_by("-created_at")
        .prefetch_related(
            Prefetch("words", queryset=WordCount.objects.order_by("-count"))
        )
    )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # spawn worker
        scrape.delay(serializer.data.get("id"))

        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )