from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import CSVData
from .serializers import CSVDataSerializer


@api_view(["GET"])
def get_data_list(request, *args, **kwargs):

    csv_data_list = CSVData.objects.all()
    csv_data_list_serializer = CSVDataSerializer(csv_data_list, many=True)

    return Response(csv_data_list_serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
def add_csv_file(request, *args, **kwargs):

    csv_data_create_serializer = CSVDataSerializer(data=request.data)
    if(csv_data_create_serializer.is_valid()):
        csv_data = csv_data_create_serializer.save()
        csv_data_serializer = CSVDataSerializer(csv_data)
        return Response(csv_data_serializer.data, status=status.HTTP_201_CREATED)

    return Response(csv_data_create_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
