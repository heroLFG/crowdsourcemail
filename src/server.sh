#!/bin/bash

pip install -e ./crowdsourcemail/django-rest-framework-passwordless
pip install -e ./crowdsourcemail/django-mailbox
python ./crowdsourcemail/manage.py runserver 0:8080 --insecure
