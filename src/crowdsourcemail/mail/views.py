import json
import logging

from django.db.models import Count
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions
from rest_framework.response import Response

from django_mailbox.models import Message

from mail.serializers import MessageSerializer, MailTagCountSerializer
from mail.models import MailSettings, MailTag, UserMailTag

EMAILS_VISIBLE_TO_NON_MEMBERS = 'EmailsVisibleToNonMembers'

logger = logging.getLogger(__name__)

class MessageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Message.objects.all().order_by('-processed')
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        filter = self.request.query_params.get('filter', 'all')
        manager = Message.objects.annotate(mail_tags_count=Count('user_mail_tags'))
        if filter != 'all':
            tag = MailTag.objects.get(value=filter)
            user_mail_tags = UserMailTag.objects.filter(tag=tag.id)
            messages = manager.filter(id__in=user_mail_tags.values('message__id').distinct())
        else:
            messages = manager.all()

        if self.request.user.username == 'anonymous':
            public_user_ids = MailSettings.objects.filter(key=EMAILS_VISIBLE_TO_NON_MEMBERS, value=True).values_list('user__id', flat=True)
            public_user_emails = User.objects.filter(id__in=public_user_ids).values_list('email', flat=True)
            messages = messages.filter(from_email_address__in=public_user_emails)
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
        
        (u_tag, created) = UserMailTag.objects.get_or_create(tag=tag, user=user, message=message)
        logger.error(f'created tag {tag.value} t/f {created}')
        if not created:
            u_tag.delete()

        return Response()
