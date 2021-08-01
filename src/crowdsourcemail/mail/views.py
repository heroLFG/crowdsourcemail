import json
import logging

from django_mailbox.models import Message
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions
from rest_framework.response import Response

from mail.serializers import MessageSerializer, MailTagCountSerializer
from mail.models import MailSettings, MailTag

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
            messages = Message.objects.filter(mail_tags__in=[tag])
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
        value = request.data.get('value')
        message = Message.objects.get(id=request.data.get('message'))
        user = request.user
        
        tag = MailTag.objects.get(value=value)
        
        if set:
            tag.messages.add(message)
            tag.users.add(user)
        else:
            if tag.user_count == 1:
                tag.messages.remove(message)
            tag.users.remove(user)
        tag.save()

        serializer = MailTagCountSerializer(tag)
        return Response(serializer.data)
