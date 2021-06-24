FROM python:3.7.2-stretch

WORKDIR /application

RUN pip install django==3.2.4 coverage==5.5

COPY ./src/heartbeat.sh /application

CMD ["sh", "/application/heartbeat.sh"]
