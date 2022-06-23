from django.urls import path

from . import views

urlpatterns = [
    path("dataset/", views.csv_file_handle_view),
    path("dataset/<str:csvId>/compute/", views.get_compute_result),
    path("dataset/<str:csvId>/plot/", views.get_plot_data),
]
