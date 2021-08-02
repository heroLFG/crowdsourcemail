from django_mailbox.models import Message
from rest_framework import serializers
from mail.models import MailTag, UserMailTag


class MailTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = MailTag
        fields = ['value']

class MailTagCountSerializer(serializers.ModelSerializer):

    class Meta:
        model = MailTag
        fields = ['value']

class UserMailTagSerializer(serializers.ModelSerializer):
    tag = MailTagCountSerializer(read_only=True)

    class Meta:
        model = UserMailTag
        fields = ['user', 'message', 'tag']

class MessageSerializer(serializers.ModelSerializer):
    user_mail_tags = serializers.SerializerMethodField()
    class Meta:
        model = Message
        # exclude_fields = ['body', 'message', 'messageattachment', 'mailbox', 'eml']
        fields = [
            'id',
            'subject',
            'user_mail_tags',
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

    def get_user_mail_tags(self, object):
        user = self.context.get('request').user
        tags = object.user_mail_tags.filter(user=user)
        serializer = UserMailTagSerializer(tags, many=True)
        return serializer.data
