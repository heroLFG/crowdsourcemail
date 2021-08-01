from django_mailbox.models import Message
from rest_framework import serializers
from mail.models import MailTag


class MessageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Message
        # exclude_fields = ['body', 'message', 'messageattachment', 'mailbox', 'eml']
        fields = [
            'id',
            'subject',
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


class MailTagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = MailTag
        exclude_fields = []
