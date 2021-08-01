build:
	docker-compose down
	docker-compose rm
	docker-compose build
	cd ./src/crowdsourcemail && sudo rm -rf django-rest-framework-passwordless && git clone https://github.com/GavinPalmer1984/django-rest-framework-passwordless.git
	cd ./src/crowdsourcemail && sudo rm -rf django-mailbox && git clone https://github.com/GavinPalmer1984/django-mailbox.git

start:
	docker-compose up -d

stop:
	docker-compose down

bash:
	docker-compose exec crowdsourcemail bash

logs:
	docker-compose logs -f crowdsourcemail management-commands frontend discord-bot

test:
	docker-compose exec -T crowdsourcemail bash -c "coverage run --source="./crowdsourcemail" crowdsourcemail/manage.py test django_mailbox && coverage report"

migrate:
	docker-compose exec -T crowdsourcemail bash -c "python crowdsourcemail/manage.py migrate"
	docker-compose exec -T crowdsourcemail bash -c "python crowdsourcemail/manage.py add_mailbox"

admin:
	docker-compose exec -T crowdsourcemail bash -c 'echo "from django.contrib.auth.models import User; User.objects.create_superuser(\"root\", \"techsupport@herolfg.com\", \"changeme\")" | python crowdsourcemail/manage.py shell'

key:
	printf "DJANGO_SECRET=%s\n" "`docker-compose exec -T crowdsourcemail python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'`" > .env

webpack:
	docker-compose exec -T frontend bash -c 'cd static && webpack'

front:
	docker-compose exec frontend bash

discord:
	docker-compose exec discord-bot bash

restart-discord:
	docker-compose restart discord-bot
