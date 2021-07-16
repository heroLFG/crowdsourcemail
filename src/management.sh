#!/bin/bash

# docker-compose restart policy requires service to run at least 10 seconds
sleep 10

python ./crowdsourcemail/manage.py getmail
