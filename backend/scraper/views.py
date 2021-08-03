from django.db.models import Prefetch, Subquery, OuterRef
from rest_framework import mixins, viewsets, status
from rest_framework.response import Response

from .models import Scrape, WordCount
from .serializers import ScrapeSerializer
from .tasks import scrape


sort_fns = {
    "word-asc": "word",
    "word-desc": "-word",
    "count-asc": "count",
    "count-desc": "-count",
}


class ScrapeViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = ScrapeSerializer

    def get_queryset(self):
        # limit to n words to avoid slowing down the UI until pagination is implemented
        word_count_limit = 100
        sort_fn = self.kwargs.get("sort_fn", "-count")
        subqry = Subquery(
            WordCount.objects.filter(scrape_id=OuterRef("scrape_id")).values_list(
                "id", flat=True
            )[:word_count_limit]
        )
        return (
            Scrape.objects.all()
            .order_by("-created_at")
            .prefetch_related(
                Prefetch(
                    "words",
                    queryset=WordCount.objects.filter(id__in=subqry).order_by(sort_fn),
                )
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

    def retrieve(self, request, *args, **kwargs):
        sort_param = request.query_params.get("sort", "count-desc")
        self.kwargs["sort_fn"] = sort_fns.get(sort_param, "count-desc")
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
