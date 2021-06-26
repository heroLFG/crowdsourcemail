from django_mailbox.models import Message
from rest_framework import serializers


class MessageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Message
        # exclude_fields = ['body', 'message', 'messageattachment', 'mailbox', 'eml']
        fields = [
            'id',
            'subject',
            'message_id',
            'in_reply_to',
            'from_header',
            'to_header',
            'outgoing',
            'encoded',
            'processed',
            'read',
            'text',
            'html'
        ]