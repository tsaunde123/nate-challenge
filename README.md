# Nate - Challenge

Testing
-----

#### Backend
Backend tests are implemented with Django's [`unittest`](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/unit-tests/) suite. From the host system you need
to execute the command inside of the `django` container so `docker exec -it django python manage.py test backend` will accomplish this.

You can execute the tests with coverage `docker exec -it django coverage run --omit='*/venv/*' manage.py test` and generate coverage reports `docker exec -it django coverage report`

The meaningful test tests the `count_words` method on the `Scrape` class. This test is critical to validate we are able to correctly process the words on a web page. 

#### Frontend
Frontend tests are implemented with the React [`testing-library`](https://testing-library.com/) and [`jest`](https://jestjs.io/). From the host system you need to execute the command 
inside of the frontend container so `docker exec -it frontend yarn test`. A coverage report is automatically generated and visible when running the test.

The meaningful test tests the `pages/index.tsx` file to ensure the correct UI components are displayed for the user to interact with the application.

#### First Run

`docker-compose build && docker-compose up -d` build and bring the containers
up.

`docker-compose logs -f` follow the docker logs.


##### Docker Commands

`docker-compose build` builds the containers.

`docker-compose up` brings up the containters (-d flag brings them up detached)

`docker-compose logs -f` view logs for detached running containers.

`docker-compose down` bring down the containers.

##### Docker Tips

Note: The container names you need are in the `docker-compose.yml` file.

Note: The containers are reading from the host filesystem so editing files
locally will propagate changes inside the container.

`docker-compose stop <container name>` stops a particular container.

`docker exec -it <container name> <command to execute inside the container>`
executes scripts inside container.

Ex: `docker exec -it django /bin/bash` loads you into a bash shell inside the
django container.

Ex: `docker exec -it django python manage.py shell` puts you in the django
shell.

File Structure
-----

##### Docker

All Docker container configuration files of any kind can be found in the `compose` folder.
The folder contains subfolders with names identical to the container name in
`docker-compose.yml`. In this way it is obvious what `Dockerfile` and/or startup
script a given container will be using.

##### Postgres
I use [`PostgreSQL`](https://www.postgresql.org/) as the database for the backend. This is a good choice as Django supports a wide range of features for Postgres.

##### Redis
I use [`Redis`](https://redis.io/) as a message broker for task scheduling in the backend. This is a good choice as Celery comes with support for Redis as a MQ.

##### Backend

This project follows typical `Django` style contentions with the main project
folder inside `backend`; this contains the `settings.py` and other relevant folders. I use [`Celery`](https://docs.celeryproject.org/en/stable/index.html) scheduling scraper tasks.
The urls are scraped using `Selenium`.

##### Frontend

The current design is to have a folder in the project root called `frontend` to
contain all `React`/frontend files. I use [`Nextjs`](https://nextjs.org/) with `TypeScript` support and `Tailwind CSS`.

Distributed system design
-----

The application is fully dockerized making it easy to deploy using a cloud provider.

WorkerManager / Worker design using `Celery` to schedule tasks enables async / non-blocking processing of the scraping requests. This means
we are able to handle more requests (throughput) as the number of searches increases and larger input text (compute) 

Extending the solution
-----
Improving loading and error states on the frontend

Improving test coverage

Adding pagination on the scraper results would allow me to display more results to the user (at the moment I limit the results to 100 rows to reduce the load on the frontend)

At the moment each time the user requests a url we scrape the page and persist the results. Even if that url has been requested recently. Checking for previous requests in the backend
would lead to a faster response rate for previous requests and would reduce the amount of data persisted.

Authentication should be added

More configuration would need to be added in order to be able to deploy the app in a production environment.