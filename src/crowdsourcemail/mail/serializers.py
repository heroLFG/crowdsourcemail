from django_mailbox.models import Message
from rest_framework import serializers
from mail.models import MailTag


class MailTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = MailTag
        fields = ['value']

class MailTagCountSerializer(serializers.ModelSerializer):

    class Meta:
        model = MailTag
        fields = ['value', 'user_count', 'message_count']

class MessageSerializer(serializers.ModelSerializer):
    mail_tags = MailTagCountSerializer(many=True, read_only=True)
    class Meta:
        model = Message
        # exclude_fields = ['body', 'message', 'messageattachment', 'mailbox', 'eml']
        fields = [
            'id',
            'subject',
            'mail_tags',
            # 'message_id',
            # 'in_reply_to',
            # 'from_header',
            # 'to_header',
            # 'outgoing',
            # 'encoded',
            'processed',
            # 'read',
            'text',
            # 'html'
        ]
