from rest_framework import serializers

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
            "time_exceeded",
            "exception",
            "sample_size",
            "completion_time",
        )

    def get_completion_time(self, entity: ScraperEntity):
        return entity.end_time - entity.start_time

    def get_word_occurrences(self, entity: ScraperEntity):
        sample_size = self.context["sample_size"]
        keys = list(entity.word_occurrences.keys())[:sample_size]
        sample = {key: entity.word_occurrences[key] for key in keys}
        return sample

    def create(self, validated_data):
        entity, created = ScraperEntity.objects.get_or_create(
            url=validated_data.get("url").rstrip("/")
        )
        return entity, created
