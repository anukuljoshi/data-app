# Data App

A web app to upload CSV files and compute functions and plot graph with data in the CSV file

## Getting started

1. Clone the repositry
2. Backend (inside backend folder)
    1. run `python -m venv env` to create a virtual environment for the django app
    2. activate virtual environment with `source ./env/bin/activate` (linux) (for others see [venv](https://docs.python.org/3/library/venv.html))
    3. run `pip install -r requirements.txt` to install dependencies
    4. create a .env file with a key DATABASE_URI=< your_postgres_db_uri >
    5. make migrations for django app `python manage.py makemigrations`
    6. run migrations `python manage.py migrate`
    7. run server with `python manage.py runserver` (available on [localhost:8000](http://localhost:8000))
3. Frontend (inside frontend folder)
    1. run `npm install` to install dependencies
    2. run `npm start` to start a development server (available on [localhost:3000](http://localhost:3000))
    3. run `npm run build` to build a production build
4. The web app is available on [localhost:3000](http://localhost:3000)
