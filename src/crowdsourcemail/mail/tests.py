import json
from django.test import TestCase
from django_mailbox.models import Mailbox, Message
from mail.models import MailSettings
from mail.views import EMAILS_VISIBLE_TO_NON_MEMBERS
from rest_framework.test import RequestsClient
from django.contrib.auth.models import User


class MailTestCase(TestCase):

    def setUp(self) -> None:
        self.anonymous_token = None
        return super().setUp()

    def get_anonymous_token(self):
        if not self.anonymous_token:
            client = RequestsClient()
            body = {
                'email': 'anonymous@herolfg.com',
                'token': None
            }
            response = client.post('http://localhost/auth/token/hero', json=body)
            assert response.status_code == 200
            self.anonymous_token = json.loads(response.content)['token']
        return self.anonymous_token

    def test_get_messages_returns_401_when_not_authenticated(self):
        client = RequestsClient()
        response = client.get('http://localhost/api/messages/')
        assert response.status_code == 401
    
    def test_post_anonymous_auth(self):
        token = self.get_anonymous_token()
        assert token != '' and token != None

    def test_get_messages_returns_200_when_authenticated(self):
        token = self.get_anonymous_token()
        client = RequestsClient()
        client.headers.update({'Authorization': 'Token ' + token})
        response = client.get('http://localhost/api/messages/')
        assert response.status_code == 200

    def test_get_messages_with_anonymous_token_does_not_provide_private_messages(self):
        token = self.get_anonymous_token()
        mailbox = Mailbox.objects.create()
        Message.objects.create(mailbox_id=mailbox.id)
        client = RequestsClient()
        client.headers.update({'Authorization': 'Token ' + token})
        response = client.get('http://localhost/api/messages/')
        assert json.loads(response.content)['count'] == 0

    def test_get_messages_with_anonymous_token_provides_public_messages(self):
        token = self.get_anonymous_token()
        user = User.objects.create(email='gavin@herolfg.com', username='herolfg')
        MailSettings.objects.create(user=user, key=EMAILS_VISIBLE_TO_NON_MEMBERS, value=True)
        mailbox = Mailbox.objects.create()
        Message.objects.create(mailbox_id=mailbox.id, from_email_address='gavin@herolfg.com')
        client = RequestsClient()
        client.headers.update({'Authorization': 'Token ' + token})
        response = client.get('http://localhost/api/messages/')
        assert json.loads(response.content)['count'] == 1
