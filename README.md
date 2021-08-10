# crowdsourcemail

`git clone https://github.com/heroLFG/crowdsourcemail.git`

## first time setup on local instructions
```
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
```
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
- move frontend single page app to its own docker-compose service

### Minimum Viable Product
- paginate on email list
- select email list to view email
- provide feedback on email
