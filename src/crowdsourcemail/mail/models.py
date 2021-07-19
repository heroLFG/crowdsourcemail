from django.db import models
from django.contrib.auth.models import User

class MailSettings(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mail_settings')
    key = models.CharField(max_length=255)
    value = models.CharField(max_length=255)
