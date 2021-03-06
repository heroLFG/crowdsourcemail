from drfpasswordless.views import AbstractBaseObtainAuthToken
from drfpasswordless.settings import api_settings
from django.utils.module_loading import import_string
import os
import json
import requests
import logging

from django.contrib import admin
from django.urls import include, path, re_path
from django.contrib.auth.models import User
from rest_framework import routers, serializers, viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from mail import views


from django_mailbox.signals import message_received
from django.dispatch import receiver

logger = logging.getLogger(__name__)


@receiver(message_received)
def webhooks(sender, message, **args):
    print(
        f'recevied mail with subject {message.subject} from {message.mailbox.name}')
    try:
        webhooks = os.getenv('CROWDSOURCEMAIL_WEBHOOKS')
        print(webhooks)
        if not webhooks:
            print('no webhooks configured')
            return
        for webhook in json.loads(webhooks):
            print(f'notify webhook: {webhook}')
            notif = f'received mail from {message.mailbox.name}'
            requests.post(webhook, {"content": notif})
    except Exception as e:
        print(e)


class ObtainAuthTokenWithoutCallbackToken(AbstractBaseObtainAuthToken):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        if request.data['email'] == 'anonymous@herolfg.com':
            user = User.objects.get_or_create(
                username='anonymous', email='anonymous@herolfg.com')
            token_creator = import_string(
                api_settings.PASSWORDLESS_AUTH_TOKEN_CREATOR)
            (token, _) = token_creator(user[0])

            if token:
                TokenSerializer = import_string(
                    api_settings.PASSWORDLESS_AUTH_TOKEN_SERIALIZER)
                token_serializer = TokenSerializer(
                    data=token.__dict__, partial=True)
                if token_serializer.is_valid():
                    return Response(token_serializer.data, status=status.HTTP_200_OK)
        else:
            logger.error("Couldn't log in unknown user. Errors on serializer: {}".format(
                serializer.error_messages))
        return Response({'detail': 'Couldn\'t log you in. Try again later.'}, status=status.HTTP_400_BAD_REQUEST)


class ObtainPlaygroundAuthToken(AbstractBaseObtainAuthToken):
    permission_classes = (permissions.AllowAny,)

    def get_secret(self):
        return os.getenv('PLAYGROUND_SECRET')

    def post(self, request, *args, **kwargs):
        if request.data['password'] == self.get_secret() and request.data['confirmPassword'] == self.get_secret():
            user, created = User.objects.get_or_create(
                username=request.data['email'], email=request.data['email'])
            user.set_password(self.get_secret())
            user.save()
            token_creator = import_string(
                api_settings.PASSWORDLESS_AUTH_TOKEN_CREATOR)
            (token, _) = token_creator(user)

            if token:
                TokenSerializer = import_string(
                    api_settings.PASSWORDLESS_AUTH_TOKEN_SERIALIZER)
                token_serializer = TokenSerializer(
                    data=token.__dict__, partial=True)
                if token_serializer.is_valid():
                    return Response(token_serializer.data, status=status.HTTP_200_OK)
        else:
            logger.error("Couldn't log in - you do not know my precious.")
        return Response({'detail': 'Couldn\'t log you in. Try again later.'}, status=status.HTTP_400_BAD_REQUEST)


router = routers.DefaultRouter()
router.register(r'messages', views.MessageViewSet)
router.register(r'tags', views.MessageTagViewSet)
router.register(r'settings', views.MessageSettingsViewSet)
router.register(r'playground', views.PlaygroundViewSet)
router.register(r'votes', views.MessageVoteViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('admin/', admin.site.urls),
    path(api_settings.PASSWORDLESS_AUTH_PREFIX + 'token/hero',
         ObtainAuthTokenWithoutCallbackToken.as_view()),
    path(api_settings.PASSWORDLESS_AUTH_PREFIX +
         'playground/', ObtainPlaygroundAuthToken.as_view()),
    path('', include('drfpasswordless.urls')),
    re_path('^.*', include('frontend.urls')),
]
