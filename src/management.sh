#!/bin/bash

pip install -e ./crowdsourcemail/django-mailbox
while :
do
    sleep 10
	python ./crowdsourcemail/manage.py getmail
done
