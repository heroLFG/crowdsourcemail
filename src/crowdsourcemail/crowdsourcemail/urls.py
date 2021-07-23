from django.contrib import admin
from django.urls import include, path, re_path
from django.contrib.auth.models import User
from rest_framework import routers, serializers, viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from mail import views

from django.utils.module_loading import import_string
from drfpasswordless.settings import api_settings
from drfpasswordless.views import AbstractBaseObtainAuthToken

class ObtainAuthTokenWithoutCallbackToken(AbstractBaseObtainAuthToken):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        if request.data['email'] == 'anonymous@herolfg.com':
            user = User.objects.get_or_create(username='anonymous', email='anonymous@herolfg.com')
            token_creator = import_string(api_settings.PASSWORDLESS_AUTH_TOKEN_CREATOR)
            (token, _) = token_creator(user[0])

            if token:
                TokenSerializer = import_string(api_settings.PASSWORDLESS_AUTH_TOKEN_SERIALIZER)
                token_serializer = TokenSerializer(data=token.__dict__, partial=True)
                if token_serializer.is_valid():
                    return Response(token_serializer.data, status=status.HTTP_200_OK)
        else:
            logger.error("Couldn't log in unknown user. Errors on serializer: {}".format(serializer.error_messages))
        return Response({'detail': 'Couldn\'t log you in. Try again later.'}, status=status.HTTP_400_BAD_REQUEST)

router = routers.DefaultRouter()
router.register(r'messages', views.MessageViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('api/', include(router.urls)),
    # path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('admin/', admin.site.urls),
    path(api_settings.PASSWORDLESS_AUTH_PREFIX + 'token/hero', ObtainAuthTokenWithoutCallbackToken.as_view()),
    path('', include('drfpasswordless.urls')),
    re_path('^.*', include('frontend.urls')),  
]
