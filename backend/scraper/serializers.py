from rest_framework import serializers
from django.utils.timezone import now

from .models import ScraperEntity


class ScraperEntitySerializer(serializers.ModelSerializer):
    url = serializers.URLField(required=True)
    sample_size = serializers.IntegerField(required=True, write_only=True)
    completion_time = serializers.SerializerMethodField()
    word_occurrences = serializers.SerializerMethodField()

    class Meta:
        model = ScraperEntity
        fields = (
            "url",
            "word_occurrences",
            "sample_size",
            "completion_time",
        )

    def get_completion_time(self, entity: ScraperEntity):
        return entity.end_time - entity.start_time

    def get_word_occurrences(self, entity: ScraperEntity):
        sample_size = self.context.get("sample_size", 10)
        keys = list(entity.word_occurrences.keys())[:sample_size]
        sample = {key: entity.word_occurrences[key] for key in keys}
        return sample

    def create(self, validated_data):
        freeze_time = now()
        entity, created = ScraperEntity.objects.update_or_create(
            url=validated_data.get("url").rstrip("/"),
            defaults=dict(start_time=freeze_time, end_time=freeze_time)
        )
        return entity, created
