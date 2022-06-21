from rest_framework import serializers

from .models import CSVData


class CSVDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = CSVData
        fields = [
            "id",
            "name",
            "csv_file"
        ]
