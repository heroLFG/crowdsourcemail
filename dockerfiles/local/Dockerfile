FROM python:3.7.2-stretch

WORKDIR /application

RUN pip install django

COPY ./src/heartbeat.sh /application

CMD ["sh", "/application/heartbeat.sh"]
