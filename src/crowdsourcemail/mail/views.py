from django_mailbox.models import Message
from rest_framework import viewsets
from rest_framework import permissions
from mail.serializers import MessageSerializer


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all().order_by('-processed')
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.username == 'anonymous':
            return []
        return Message.objects.all()
