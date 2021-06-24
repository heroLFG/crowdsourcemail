build:
	docker-compose down
	docker-compose rm
	docker-compose build

start:
	docker-compose up -d

stop:
	docker-compose down

bash:
	docker-compose exec crowdsourcemail bash

logs:
	docker-compose logs -f crowdsourcemail

test:
	docker-compose exec -T crowdsourcemail bash -c "coverage run --source="./crowdsourcemail" crowdsourcemail/manage.py test polls && coverage report"

migrate:
	docker-compose exec -T crowdsourcemail bash -c "python crowdsourcemail/manage.py migrate"

admin:
	docker-compose exec -T crowdsourcemail bash -c 'echo "from django.contrib.auth.models import User; User.objects.create_superuser(\"root\", \"techsupport@herolfg.com\", \"changeme\")" | python crowdsourcemail/manage.py shell'
