from rest_framework import serializers
from django.utils.timezone import now

from .models import ScraperEntity


class ScraperEntitySerializer(serializers.ModelSerializer):
    url = serializers.URLField(required=True)
    sample_size = serializers.IntegerField(required=True, write_only=True)
    completion_time = serializers.SerializerMethodField()
    word_occurrences = serializers.SerializerMethodField()
    total_occurrences = serializers.SerializerMethodField()

    class Meta:
        model = ScraperEntity
        fields = (
            "url",
            "word_occurrences",
            "sample_size",
            "completion_time",
            "total_occurrences"
        )

    def get_completion_time(self, entity: ScraperEntity):
        return entity.end_time - entity.start_time

    def get_word_occurrences(self, entity: ScraperEntity):
        word_occurrences = entity.word_occurrences or {}
        max_sample_size = len(word_occurrences)
        sample_size = self.context.get("sample_size", 10)
        sample_size = max_sample_size if sample_size > max_sample_size else sample_size
        keys = list(word_occurrences.keys())[:sample_size]
        sample = {key: word_occurrences[key] for key in keys}
        return sample

    def get_total_occurrences(self, entity: ScraperEntity):
        return len(entity.word_occurrences or {})

    def create(self, validated_data):
        freeze_time = now()
        entity, created = ScraperEntity.objects.update_or_create(
            url=validated_data.get("url").rstrip("/"),
            defaults=dict(start_time=freeze_time, end_time=freeze_time)
        )
        return entity, created
