from rest_framework import serializers

from .models import Scrape, WordCount


class WordCountSerializer(serializers.ModelSerializer):
    class Meta:
        model = WordCount
        fields = [
            "id",
            "scrape",
            "word",
            "count",
        ]

        read_only_fields = [
            "id",
            "scrape",
            "word",
            "count",
        ]


class ScrapeSerializer(serializers.ModelSerializer):
    words = WordCountSerializer(many=True, read_only=True)

    class Meta:
        model = Scrape
        fields = [
            "id",
            "url",
            "words",
            "created_at",
            "completed_at",
            "error",
        ]

        read_only_fields = [
            "id",
            "words",
            "created_at",
            "completed_at",
            "error",
        ]