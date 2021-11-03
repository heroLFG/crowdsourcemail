from django.db.models import Sum
from django_mailbox.models import Message
from rest_framework import serializers
from mail.models import MailSettings, MailTag, UserMailTag, UserMailVote


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
    mail_vote_score = serializers.SerializerMethodField()
    mail_tags_count = serializers.SerializerMethodField()
    mail_tags = serializers.SerializerMethodField()
    user_mail_tags = serializers.SerializerMethodField()
    user_mail_votes = serializers.SerializerMethodField()

    class Meta:
        model = Message
        # exclude = ['body', 'message', 'messageattachment', 'mailbox', 'eml']
        fields = [
            'id',
            'subject',
            'mail_vote_score',
            'mail_tags_count',
            'mail_tags',
            'user_mail_tags',
            'user_mail_votes',
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

    def get_mail_vote_score(self, object):
        votes = UserMailVote.objects.filter(message=object.id)
        return votes.aggregate(Sum('vote'))['vote__sum'] or 0

    def get_mail_tags_count(self, object):
        filter = self.context['request'].query_params.get('filter', None)
        if filter is None:
            return None
        try:
            tag = MailTag.objects.get(value=filter)
            user_mail_tags = UserMailTag.objects.filter(
                tag=tag.id, message=object.id)
            return user_mail_tags.all().count()
        except:
            return None

    def get_mail_tags(self, object):
        tags = object.user_mail_tags.all()
        serializer = UserMailTagSerializer(tags, many=True)
        return serializer.data

    def get_user_mail_tags(self, object):
        user = self.context.get('request').user
        tags = object.user_mail_tags.filter(user=user)
        serializer = UserMailTagSerializer(tags, many=True)
        return serializer.data

    def get_user_mail_votes(self, object):
        user = self.context.get('request').user
        votes = object.user_mail_votes.filter(user=user)
        if votes is None or len(votes) == 0:
            return 0
        return votes[0].vote


class MailSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MailSettings
        exclude = []
