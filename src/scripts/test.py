import os
import json

webhooks_str = os.getenv('CROWDSOURCEMAIL_WEBHOOKS')
print(webhooks_str)

webhooks = json.loads(webhooks_str)
print(webhooks)

for webhook in webhooks:
    print(webhook)
