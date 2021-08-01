import json
import logging

from django_mailbox.models import Message
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions
from rest_framework.response import Response

from mail.serializers import MessageSerializer, MailTagCountSerializer
from mail.models import MailSettings, MailTag, UserMailTag

logger = logging.getLogger(__name__)

class MessageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Message.objects.all().order_by('-processed')
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        filter = self.request.query_params.get('filter', 'all')
        if self.request.user.username == 'anonymous':
            public_user_ids = MailSettings.objects.filter(key='MyEmailsAreVisibleToNonMembers',value=True).values_list('user__id', flat=True)
            public_user_emails = User.objects.filter(id__in=public_user_ids).values_list('email', flat=True)
            messages = Message.objects.filter(from_email_address__in=public_user_emails)
        if filter != 'all':
            tag = MailTag.objects.get(value=filter)
            user_mail_tags = UserMailTag.objects.filter(tag=tag.id, user=self.request.user.id)
            messages = Message.objects.filter(user_mail_tags__in=user_mail_tags)
        else:
            messages = Message.objects.all()
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
