import os
from django.db import models
from django.dispatch import receiver


class CSVData(models.Model):
    name = models.CharField(max_length=255, unique=True, null=False)
    csv_file = models.FileField(upload_to="csv")

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return f'{self.pk}: {self.name}'


def _delete_file(path):
    """ Deletes file from filesystem. """
    if os.path.isfile(path):
        os.remove(path)


@receiver(models.signals.post_delete, sender=CSVData)
def delete_file(sender, instance, *args, **kwargs):
    """ Deletes image files on `post_delete` """
    if instance.csv_file:
        _delete_file(instance.csv_file.path)
