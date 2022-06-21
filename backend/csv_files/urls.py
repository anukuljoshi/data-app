from django.urls import path

from . import views

urlpatterns = [
    path("", views.get_data_list),
    path("add-csv/", views.add_csv_file),
]
