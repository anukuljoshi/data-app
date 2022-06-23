# Data App

A web app to upload CSV files and compute functions and plot graph with data in the CSV file

## Getting started

1. Clone the repositry
2. Frontend (inside frontend folder)
    1. run `npm install` to install dependencies
    2. run `npm start` to start a development server (available on [localhost:3000](http://localhost:3000))
    3. run `npm run build` to build a production server
3. Backend (inside backend folder)
    1. run `python3 -m venv env` to create a virtual environment for the django app
    2. run `pip install -r requirements.txt` to install dependencies
    3. create a .env file with a key DATABASE_URI=< your_postgres_db_uri >
    4. activate virtual environment with `./env/bin/activate`
    5. run server with `python manage.py runserver` (available on [localhost:8000](http://localhost:8000))
