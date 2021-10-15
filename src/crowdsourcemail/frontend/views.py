import os
from django.shortcuts import render

# Create your views here.
def index(request):
    settings = {
        "host": os.getenv('CDN_HOST'),
        "google_api_key": os.getenv('GOOGLE_API_KEY'),
        "google_client_id": os.getenv('GOOGLE_CLIENT_ID')
    }
    return render(request, "frontend/index.html", settings)
