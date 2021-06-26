# crowdsourcemail

## setup on local instructions
```
make build
make start
make migrate
make admin
```
goto http://localhost:1984/admin/ and login with:
- username: root
- password: changeme

## setup on prod instructions
- do everything from local then:
```
make key
make stop
make start
```
Now there is a secret key that should not be shared and you should not need to do `make key` again.
