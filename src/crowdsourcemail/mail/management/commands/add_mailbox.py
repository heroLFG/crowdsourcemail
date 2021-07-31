import os
import urllib
from django.core.management.base import BaseCommand, CommandError
from django_mailbox.models import Mailbox


class Command(BaseCommand):
    help = 'Add default mailbox from env'

    def handle(self, *args, **options):
        user = os.getenv('GMAIL_USER')
        password = os.getenv('GMAIL_PASSWORD')
        safe_password = urllib.parse.quote(password, safe='~()*!.\'')
        safe_user = urllib.parse.quote(user, safe='~()*!.\'')
        uri = f'imap+ssl://{safe_user}:{safe_password}@imap.gmail.com'
        (mailbox, created) = Mailbox.objects.get_or_create(name=user, uri=uri)

        if created:
            self.stdout.write(self.style.SUCCESS(f'mailbox created for {user}'))
        else:
            self.stdout.write(self.style.SUCCESS(f'mailbox already exists for {user}'))
