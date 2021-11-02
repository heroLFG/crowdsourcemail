import json
import logging
import os

from django.db.models import Count
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions
from rest_framework.response import Response

from django_mailbox.models import Message

from mail.serializers import MessageSerializer, MailTagCountSerializer, MailSettingsSerializer
from mail.models import MailSettings, MailTag, UserMailTag, UserMailVote

EMAILS_VISIBLE_TO_NON_MEMBERS = 'EmailsVisibleToNonMembers'

logger = logging.getLogger(__name__)


class MessageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Message.objects.all().order_by('-processed')
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        filter = self.request.query_params.get('filter', 'all')
        manager = Message.objects.annotate(
            mail_tags_count=Count('user_mail_tags'))
        if filter != 'all':
            tag = MailTag.objects.get(value=filter)
            user_mail_tags = UserMailTag.objects.filter(tag=tag.id)
            messages = manager.filter(
                id__in=user_mail_tags.values('message__id').distinct())
        else:
            messages = manager.all()

        if self.request.user.username == 'anonymous':
            public_user_ids = MailSettings.objects.filter(
                key=EMAILS_VISIBLE_TO_NON_MEMBERS, value=True).values_list('user__id', flat=True)
            public_user_emails = User.objects.filter(
                id__in=public_user_ids).values_list('email', flat=True)
            messages = messages.filter(
                from_email_address__in=public_user_emails)
        if filter != 'all':
            return messages.order_by('-mail_tags_count')
        return messages.order_by('-processed')


class MessageTagViewSet(viewsets.ViewSet):
    queryset = MailTag.objects.all().order_by('value')
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        tags = MailTag.objects.all()
        serializer = MailTagCountSerializer(tags, many=True)
        return Response(serializer.data)

    def create(self, request):
        set = request.data.get('set')

        tag = MailTag.objects.get(value=request.data.get('value'))
        message = Message.objects.get(id=request.data.get('message'))
        user = request.user

        (u_tag, created) = UserMailTag.objects.get_or_create(
            tag=tag, user=user, message=message)
        logger.error(f'created tag {tag.value} t/f {created}')
        if not created:
            u_tag.delete()

        return Response()


class MessageSettingsViewSet(viewsets.ViewSet):
    queryset = MailSettings.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        settings = MailSettings.objects.filter(user=request.user)
        serializer = MailSettingsSerializer(settings, many=True)
        return Response(serializer.data)

    def create(self, request):
        key = request.data.get('key')
        setting = None
        if key == EMAILS_VISIBLE_TO_NON_MEMBERS:
            (setting, created) = MailSettings.objects.get_or_create(
                user=request.user, key=key, value=True)
            if not created:
                MailSettings.objects.filter(
                    user=request.user, key=key).delete()
                setting = None
        serializer = MailSettingsSerializer(setting)
        return Response(serializer.data)


class PlaygroundViewSet(viewsets.ViewSet):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_secret(self):
        return os.getenv('PLAYGROUND_SECRET')

    def list(self, request, *args, **kwargs):
        if not request.user.check_password(self.get_secret()):
            return Response('no')

        users = User.objects.filter(email__contains='@test.com')
        data = {
            # 'debug' : request.user.check_password(self.get_secret())
        }
        for user in users:
            data[user.id] = user.email
        return Response(data)


class MessageVoteViewSet(viewsets.ViewSet):
    queryset = UserMailVote.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request):
        vote = request.data.get('vote')
        if vote not in [-1, 0, 1]:
            raise Exception('bad')

        message = Message.objects.get(id=request.data.get('message'))
        user = request.user

        user_vote = None
        is_created = False
        try:
            user_vote = UserMailVote.objects.get(user=user, message=message)
        except:
            [user_vote, is_created] = UserMailVote.objects.get_or_create(
                user=user, message=message)

        if not is_created:
            user_vote.vote = vote
            user_vote.save()
        return Response()
