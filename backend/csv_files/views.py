import csv
from typing import Type

from django.conf import settings

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import CSVData
from .serializers import CSVDataSerializer


@api_view(["GET", "POST"])
def csv_file_handle_view(request, *args, **kwargs):
    if(request.method == "GET"):
        # get list of csv data
        csv_data_list = CSVData.objects.all()
        csv_data_list_serializer = CSVDataSerializer(csv_data_list, many=True)

        return Response(csv_data_list_serializer.data, status=status.HTTP_200_OK)
    elif(request.method == "POST"):
        # create new csv data
        csv_data_create_serializer = CSVDataSerializer(data=request.data)
        if(csv_data_create_serializer.is_valid()):
            csv_data = csv_data_create_serializer.save()
            csv_data_serializer = CSVDataSerializer(csv_data)
            return Response(csv_data_serializer.data, status=status.HTTP_201_CREATED)

        return Response(csv_data_create_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def get_compute_result(request, *args, **kwargs):
    # get data from request
    csvId = kwargs.get("csvId")
    column = request.data.get("column")
    operation = request.data.get("operation")

    # get csv data with csvId
    csv_data = CSVData.objects.filter(id=csvId).first()

    # handle errors
    if(not csv_data):
        return Response({"message": "not found"}, status=status.HTTP_404_NOT_FOUND)

    if(not column):
        return Response({"column": "column is required"}, status=status.HTTP_400_BAD_REQUEST)

    # get file location for csv file
    csv_file_location = settings.MEDIA_ROOT + '/' + str(csv_data.csv_file)

    # read csv file
    csv_file = None
    try:
        csv_file = open(csv_file_location, 'r')
    except Exception:
        return Response({"message": "server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    csv_reader = csv.DictReader(csv_file, skipinitialspace=True)

    # calculate result according to operation
    result = 0
    try:
        if(operation == "max"):
            result = float('-inf')
            for line in csv_reader:
                result = max(result, float(line.get(column)))
        elif(operation == "min"):
            result = float('inf')
            for line in csv_reader:
                result = min(result, float(line.get(column)))
        elif(operation == "sum"):
            result = 0
            for line in csv_reader:
                result += float(line.get(column))
    except TypeError:
        return Response({"column": "column is invalid"}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"result": result}, status=status.HTTP_200_OK)


@api_view(["POST"])
def get_plot_data(request, *args, **kwargs):
    # get data from request
    csvId = kwargs.get("csvId")
    column1 = request.data.get("column1")
    column2 = request.data.get("column2")

    # get csv data with csvId
    csv_data = CSVData.objects.filter(id=csvId).first()

    # handle error
    if(not csv_data):
        return Response({"message": "not found"}, status=status.HTTP_404_NOT_FOUND)

    # create csv file location
    csv_file_location = settings.MEDIA_ROOT + '/' + str(csv_data.csv_file)

    # read csv file
    csv_file = None
    try:
        csv_file = open(csv_file_location, 'r')
    except Exception:
        return Response({"message": "server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    csv_reader = csv.DictReader(csv_file, skipinitialspace=True)

    # get data for column1 and column2
    column1_data = []
    column2_data = []
    i = 0
    try:
        for line in csv_reader:
            if(i >= 30):
                break
            column1_data.append(line.get(column1))
            column2_data.append(line.get(column2))
            i += 1
    except TypeError:
        return Response({"column": "column is invalid"}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"column1": column1_data, "column2": column2_data}, status=status.HTTP_200_OK)
