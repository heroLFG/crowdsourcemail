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
    mail_tags_count = serializers.SerializerMethodField()
    mail_tags = serializers.SerializerMethodField()
    user_mail_tags = serializers.SerializerMethodField()
    class Meta:
        model = Message
        # exclude_fields = ['body', 'message', 'messageattachment', 'mailbox', 'eml']
        fields = [
            'id',
            'subject',
            'mail_tags_count',
            'mail_tags',
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

    def get_mail_tags_count(self, object):
        return object.user_mail_tags.all().count()

    def get_mail_tags(self, object):
        tags = object.user_mail_tags.all()
        serializer = UserMailTagSerializer(tags, many=True)
        return serializer.data

    def get_user_mail_tags(self, object):
        user = self.context.get('request').user
        tags = object.user_mail_tags.filter(user=user)
        serializer = UserMailTagSerializer(tags, many=True)
        return serializer.data
