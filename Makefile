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
