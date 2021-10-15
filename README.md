# crowdsourcemail

[![Build Status](https://travis-ci.com/heroLFG/crowdsourcemail.svg?branch=main)](https://travis-ci.com/heroLFG/crowdsourcemail)

![image](https://user-images.githubusercontent.com/5564129/129360375-8bb41af0-daae-4f45-9cde-c3924b52f340.png)

`git clone https://github.com/heroLFG/crowdsourcemail.git`

## first time setup on local instructions

```markdown
make build
make start
make migrate
make admin
make webpack
make key
echo "GMAIL_USER=mygmailuser@gmail.com" >> .env
echo "GMAIL_PASSWORD=mygmailsecret" >> .env
echo "ENV=test" >> .env
echo "HOST=localhost:1985" >> .env
echo "CDN_HOST=localhost:1986" >> .env
echo "FRONTEND_PORT=1986" >> .env
echo "CROWDSOURCEMAIL_PORT=1985" >> .env
```

## first time setup and every other time

```markdown
make stop
make start
```

## Troubleshoot

### allow less secure apps and disable captcha

https://stackoverflow.com/a/25238515/1686280

### enable IMAP

https://support.google.com/mail/answer/7126229?hl=en

## TODO

### Tech Debt

- automated e2e tests

### Minimum Viable Product

- ~paginate on email list~
- ~select email list to view email~
- ~provide feedback on email~
- ~sort by feedback~
