# syntax=docker/dockerfile:1
FROM python:3.7-alpine
WORKDIR /code
RUN apk add --no-cache bash gcc musl-dev linux-headers
RUN pip install coverage==5.5 discord.py==1.7.2 redis==3.5.3 requests==2.26.0
