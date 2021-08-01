FROM python:3.7.2-stretch

WORKDIR /application

RUN pip install django==3.2.4 django-extensions==3.1.3 coverage==5.5 djangorestframework==3.12.4 markdown==3.3.4 django-filter==2.4.0 six==1.6.1 requests==2.26.0

COPY ./src/heartbeat.sh /application

CMD ["sh", "/application/heartbeat.sh"]
