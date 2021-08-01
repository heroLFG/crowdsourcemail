import json

from django_mailbox.models import Message
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions
from rest_framework.response import Response

from mail.serializers import MessageSerializer, MailTagSerializer
from mail.models import MailSettings, MailTag


class MessageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Message.objects.all().order_by('-processed')
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.username == 'anonymous':
            public_user_ids = MailSettings.objects.filter(key='MyEmailsAreVisibleToNonMembers',value=True).values_list('user__id', flat=True)
            public_user_emails = User.objects.filter(id__in=public_user_ids).values_list('email', flat=True)
            return Message.objects.filter(from_email_address__in=public_user_emails).order_by('-processed')
        return Message.objects.all().order_by('-processed')


class MessageTagViewSet(viewsets.ViewSet):
    queryset = MailTag.objects.all().order_by('value')
    serializer_class = MailTagSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        message = Message.objects.get(id=request.query_params.get('message'))
        tags = message.mail_tags.filter(users=request.user)
        serializer = MailTagSerializer(tags, many=True)
        return Response(serializer.data)

    def create(self, request):
        set = request.data.get('set')
        value = request.data.get('value')
        message = Message.objects.get(id=request.data.get('message'))
        user = request.user
        
        tag = MailTag.objects.get(value=value)
        tag.messages.add(message)
        if set:
            tag.users.add(user)
        else:
            tag.users.remove(user)
        tag.save()

        return Response()
