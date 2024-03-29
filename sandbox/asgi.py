# """
# ASGI config for sandbox project.

# It exposes the ASGI callable as a module-level variable named ``application``.

# For more information on this file, see
# https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
# """

# import os

# from django.core.asgi import get_asgi_application

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "sandbox.settings")

# application = get_asgi_application()


"""
ASGI config for sandbox project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from sphere.routing import websocket_urlpatterns  # Adjust this import based on your project structure

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "sandbox.settings")

# application = ProtocolTypeRouter({
#     "http": get_asgi_application(),  # Django's ASGI application for handling traditional HTTP requests
#     "websocket": AuthMiddlewareStack(
#         URLRouter(
#             websocket_urlpatterns  # Use your project's WebSocket URL patterns
#         )
#     ),
# })
