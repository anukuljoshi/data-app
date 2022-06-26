import codecs
import csv

from django.db import ProgrammingError, connection

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import CSVData
from .serializers import CSVDataSerializer

VALID_OPERATIONS = ["max", "min", "sum"]
ROW_LIMIT = 30


@api_view(["GET", "POST"])
def csv_file_handle_view(request, *args, **kwargs):
    if(request.method == "GET"):
        # get list of csv data
        csv_data_list = CSVData.objects.all()
        csv_data_list_serializer = CSVDataSerializer(csv_data_list, many=True)

        return Response(csv_data_list_serializer.data, status=status.HTTP_200_OK)
    elif(request.method == "POST"):
        # create new csv data

        # read data from request
        data = request.data
        files = request.FILES

        csv_name = data.get("name")
        csv_file = files.get("csv_file")

        # handle errors
        if(not csv_file and not csv_name):
            return Response({"name": "Name is required", "csv_file": "File is required"}, status=status.HTTP_400_BAD_REQUEST)

        if(not csv_name):
            return Response({"name": "Name is required"}, status=status.HTTP_400_BAD_REQUEST)

        if(not csv_file):
            return Response({"csv_file": "File is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # create csv_data instance
            csv_data_create_serializer = CSVDataSerializer(
                data={"name": csv_name, "csv_file": csv_file})
        except Exception as e:
            print(e, "exception read csv")
            return Response({"name": "Something wrong with file or filename. Check and try again."}, status=status.HTTP_400_BAD_REQUEST)

        if(csv_data_create_serializer.is_valid()):

            # create csv reader
            csv_reader = csv.DictReader(codecs.getreader(
                "utf-8")(csv_file), skipinitialspace=True)

            # create query for table creation
            create_query_column_names = ", ".join(
                field + " numeric" for field in csv_reader.fieldnames)

            CREATE_TABLE_QUERY = f"CREATE TABLE IF NOT EXISTS {csv_name} ({ create_query_column_names });"

            try:
                with connection.cursor() as cursor:
                    cursor.execute(CREATE_TABLE_QUERY)

                    # insert row data in database table
                    for line in csv_reader:
                        insert_query_column_names = ", ".join(
                            csv_reader.fieldnames)
                        values = []
                        for field in csv_reader.fieldnames:
                            values.append(line[field])
                        insert_query_values = ", ".join(values)

                        INSERT_QUERY = f"INSERT INTO {csv_name} ({ insert_query_column_names }) values ({ insert_query_values });"
                        cursor.execute(INSERT_QUERY)

            except Exception as e:
                print(e, "exception create table")
                return Response({"name": "Something wrong with file or filename. Check and try again."}, status=status.HTTP_400_BAD_REQUEST)

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
    if(not operation or operation not in VALID_OPERATIONS):
        return Response({"operation": "operation is invalid"}, status=status.HTTP_400_BAD_REQUEST)
    if(not column):
        return Response({"column": "column is required"}, status=status.HTTP_400_BAD_REQUEST)
    if(not csv_data):
        return Response({"message": "not found"}, status=status.HTTP_404_NOT_FOUND)

    table_name = csv_data.name
    result = 0
    # create select query for column with operation
    SELECT_QUERY = f"SELECT {operation}({column}) FROM {table_name};"
    try:
        with connection.cursor() as cursor:
            cursor.execute(SELECT_QUERY)
            result = cursor.fetchall()
    except ProgrammingError as p:
        return Response({"column": "column is invalid"}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"result": result}, status=status.HTTP_200_OK)


@api_view(["GET"])
def get_plot_data(request, *args, **kwargs):
    # get data from request
    csvId = kwargs.get("csvId")
    column1 = request.GET.get("column1")
    column2 = request.GET.get("column2")

    # get csv data with csvId
    csv_data = CSVData.objects.filter(id=csvId).first()

    # handle error
    if(not column1 and not column2):
        return Response({"column1": "column1 is required", "column2": "column2 is required"}, status=status.HTTP_400_BAD_REQUEST)
    if(not column1):
        return Response({"column1": "column1 is required"}, status=status.HTTP_400_BAD_REQUEST)
    if(not column2):
        return Response({"column2": "column2 is required"}, status=status.HTTP_400_BAD_REQUEST)

    if(not csv_data):
        return Response({"message": "not found"}, status=status.HTTP_404_NOT_FOUND)

    table_name = csv_data.name

    # get data for column1
    column1_data = []
    try:
        SELECT_QUERY = f"SELECT {column1} FROM {table_name} LIMIT {ROW_LIMIT};"
        with connection.cursor() as cursor:
            cursor.execute(SELECT_QUERY)
            column1_data = cursor.fetchall()
    except ProgrammingError as p:
        return Response({"column1": "column1 is invalid"}, status=status.HTTP_400_BAD_REQUEST)

    # get data for column2
    column2_data = []
    try:
        SELECT_QUERY = f"SELECT {column2} FROM {table_name} LIMIT {ROW_LIMIT};"
        with connection.cursor() as cursor:
            cursor.execute(SELECT_QUERY)
            column2_data = cursor.fetchall()
    except ProgrammingError as p:
        return Response({"column2": "column2 is invalid"}, status=status.HTTP_400_BAD_REQUEST)

    # convert sql data into float datatype
    column1_data = [float(column1_data[i][0])
                    for i in range(len(column1_data))]
    column2_data = [float(column2_data[i][0])
                    for i in range(len(column2_data))]

    return Response({"column1": column1_data, "column2": column2_data}, status=status.HTTP_200_OK)
