from django.db import models
from django.contrib.auth.models import User
from django_mailbox.models import Message


class MailSettings(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mail_settings')
    key = models.CharField(max_length=255)
    value = models.CharField(max_length=255)


class MailTag(models.Model):
    messages = models.ManyToManyField(Message, related_name='mail_tags')
    value = models.CharField(max_length=255, unique=True, db_index=True)

    def __str__(self):
        return self.value
