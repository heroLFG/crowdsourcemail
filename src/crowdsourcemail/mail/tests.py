import json
import logging
from django.test import TestCase
from django_mailbox.models import Mailbox, Message
from mail.models import MailTag
from mail.views import EMAILS_VISIBLE_TO_NON_MEMBERS
from rest_framework.test import RequestsClient
from django.contrib.auth.models import User
from django.utils.module_loading import import_string
from drfpasswordless.settings import api_settings

logger = logging.getLogger(__name__)


class MailTestCase(TestCase):

    def setUp(self) -> None:
        return super().setUp()

    def create_default_tags(self):
        tags = ['spam', 'star', 'trash', 'archive']
        for tag in tags:
            (tag, created) = MailTag.objects.get_or_create(value=tag)

    def get_token(self, user):
        token_creator = import_string(api_settings.PASSWORDLESS_AUTH_TOKEN_CREATOR)
        (token, _) = token_creator(user)
        return token.key

    def get_anonymous_token(self):
        client = RequestsClient()
        body = {
            'email': 'anonymous@herolfg.com',
            'token': None
        }
        response = client.post('http://localhost/auth/token/hero', json=body)
        return json.loads(response.content)['token']

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
        user1 = User.objects.create(email='gavin@herolfg.com', username='herolfg')
        token1 = self.get_token(user1)
        client = RequestsClient()
        client.headers.update({'Authorization': 'Token ' + token1})
        client.post('http://localhost/api/settings/', json={'key':EMAILS_VISIBLE_TO_NON_MEMBERS,'value':True})

        token = self.get_anonymous_token()
        mailbox = Mailbox.objects.create()
        Message.objects.create(mailbox_id=mailbox.id, from_email_address='gavin@herolfg.com')

        client.headers.update({'Authorization': 'Token ' + token})
        response = client.get('http://localhost/api/messages/')
        assert json.loads(response.content)['count'] == 1

        client.headers.update({'Authorization': 'Token ' + token1})
        client.post('http://localhost/api/settings/', json={'key':EMAILS_VISIBLE_TO_NON_MEMBERS,'value':True})

        client.headers.update({'Authorization': 'Token ' + token})
        response = client.get('http://localhost/api/messages/')
        assert json.loads(response.content)['count'] == 0

    def test_get_messages_provides_private_messages(self):
        user = User.objects.create(email='gavin@herolfg.com', username='herolfg')
        token = self.get_token(user)
        mailbox = Mailbox.objects.create()
        Message.objects.create(mailbox_id=mailbox.id)
        Message.objects.create(mailbox_id=mailbox.id)
        client = RequestsClient()
        client.headers.update({'Authorization': 'Token ' + token})
        response = client.get('http://localhost/api/messages/')
        assert json.loads(response.content)['count'] == 2

    def test_tag_message_and_get_messages_will_filter_messages(self):
        self.create_default_tags()
        mailbox = Mailbox.objects.create()
        message1 = Message.objects.create(mailbox_id=mailbox.id)
        message2 = Message.objects.create(mailbox_id=mailbox.id)
        message3 = Message.objects.create(mailbox_id=mailbox.id)
        message4 = Message.objects.create(mailbox_id=mailbox.id)
        message5 = Message.objects.create(mailbox_id=mailbox.id)
        user1 = User.objects.create(email='techsupport@herolfg.com', username='support')
        user2 = User.objects.create(email='gavin@herolfg.com', username='gavin')
        user3 = User.objects.create(email='help@herolfg.com', username='help')
        user4 = User.objects.create(email='wordpress@herolfg.com', username='wordpress')
        token1 = self.get_token(user1)
        token2 = self.get_token(user2)
        token3 = self.get_token(user3)
        token4 = self.get_token(user4)
        client = RequestsClient()
        client.headers.update({'Authorization': 'Token ' + token1})
        client.post('http://localhost/api/tags/', json={'value':'trash', 'message':message2.id})
        client.headers.update({'Authorization': 'Token ' + token2})
        client.post('http://localhost/api/tags/', json={'value':'trash', 'message':message2.id})
        client.headers.update({'Authorization': 'Token ' + token3})
        client.post('http://localhost/api/tags/', json={'value':'trash', 'message':message5.id})

        response = client.get('http://localhost/api/messages/?filter=trash')
        data = json.loads(response.content)
        assert data['count'] == 2
        assert data['results'][0]['mail_tags_count'] == 2
        assert data['results'][0]['id'] == message2.id
        assert data['results'][1]['mail_tags_count'] == 1
        assert data['results'][1]['id'] == message5.id

    def test_get_messages_has_correct_tag_count(self):
        self.create_default_tags()
        mailbox = Mailbox.objects.create()
        message1 = Message.objects.create(mailbox_id=mailbox.id)
        user1 = User.objects.create(email='techsupport@herolfg.com', username='support')
        user2 = User.objects.create(email='gavin@herolfg.com', username='gavin')
        user3 = User.objects.create(email='help@herolfg.com', username='help')
        user4 = User.objects.create(email='wordpress@herolfg.com', username='wordpress')
        token1 = self.get_token(user1)
        token2 = self.get_token(user2)
        token3 = self.get_token(user3)
        token4 = self.get_token(user4)
        client = RequestsClient()
        client.headers.update({'Authorization': 'Token ' + token1})
        client.post('http://localhost/api/tags/', json={'value':'spam', 'message':message1.id})
        client.headers.update({'Authorization': 'Token ' + token2})
        client.post('http://localhost/api/tags/', json={'value':'star', 'message':message1.id})
        client.headers.update({'Authorization': 'Token ' + token3})
        client.post('http://localhost/api/tags/', json={'value':'trash', 'message':message1.id})
        client.headers.update({'Authorization': 'Token ' + token4})
        client.post('http://localhost/api/tags/', json={'value':'archive', 'message':message1.id})

        response = client.get('http://localhost/api/messages/?filter=trash')
        data = json.loads(response.content)
        count = data['count']
        logger.log(msg=f'count:{count}', level=1)
        assert data['count'] == 1
        assert data['results'][0]['mail_tags_count'] == 1
        assert data['results'][0]['id'] == message1.id
