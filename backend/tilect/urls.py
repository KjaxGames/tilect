from django.urls import path
from . import views

urlpatterns = [
    path('create-game', views.create_game, name='create_game'),
]