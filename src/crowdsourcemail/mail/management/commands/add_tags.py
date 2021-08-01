import os
import urllib
from django.core.management.base import BaseCommand, CommandError
from mail.models import MailTag


class Command(BaseCommand):
    help = 'Add default tags'

    def handle(self, *args, **options):
        tags = ['spam', 'star', 'trash', 'archive']
        for tag in tags:
            (tag, created) = MailTag.objects.get_or_create(value=tag)

            if created:
                self.stdout.write(self.style.SUCCESS(f'created tag {tag}'))
            else:
                self.stdout.write(self.style.SUCCESS(f'tag {tag} already exists'))
