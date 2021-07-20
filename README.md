# crowdsourcemail

`git clone https://github.com/heroLFG/crowdsourcemail.git`

## setup fork of django-mailbox (unless/until it is merged into the upstream)

```
cd crowdsourcemail/src/crowdsourcemail
git clone https://github.com/GavinPalmer1984/django-mailbox.git
cd ../..
```

## first time setup on local instructions
```
make build
make start
make migrate
make admin
make key
echo "GMAIL_USER=mygmailuser@gmail.com" >> .env
echo "GMAIL_PASSWORD=mygmailsecret" >> .env
echo "ENV=test" >> .env
echo "HOST=localhost" >> .env
```

## first time setup and every other time
```
make stop
make start
```

## add a mailbox
- goto http://localhost:1985
- login as:
    - root
    - changeme
- click "mailboxes"
- click "add mailbox"
- configure the new mailbox with URI like:
    - imap+ssl://mygmailuser%40gmail.com:mygmailsecret@imap.gmail.com

## Troubleshoot

### allow less secure apps and disable captcha
https://stackoverflow.com/a/25238515/1686280

### enable IMAP
https://support.google.com/mail/answer/7126229?hl=en
