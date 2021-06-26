from django_mailbox.models import Message
from rest_framework import viewsets
from rest_framework import permissions
from mail.serializers import MessageSerializer


class MessageViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows messages to be viewed or edited.
    """
    queryset = Message.objects.all() #.order_by('-date_joined')
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
