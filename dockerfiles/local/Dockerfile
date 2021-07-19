FROM python:3.7.2-stretch

WORKDIR /application

RUN pip install django==3.2.4 coverage==5.5 djangorestframework==3.12.4 markdown==3.3.4 django-filter==2.4.0 drfpasswordless==1.5.7 six==1.6.1

COPY ./src/heartbeat.sh /application

CMD ["sh", "/application/heartbeat.sh"]
