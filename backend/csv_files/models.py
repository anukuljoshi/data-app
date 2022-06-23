from django.db import models


class CSVData(models.Model):
    name = models.CharField(max_length=255, unique=True, null=False)
    csv_file = models.FileField(upload_to="csv")

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return f'{self.pk}: {self.name}'
