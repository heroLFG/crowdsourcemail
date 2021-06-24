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