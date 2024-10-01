from django.urls import path, include
from .views import login, register,get_user


urlpatterns = [
    path('login/', login, name='login'),
    path('register/', register, name='register'),
   path('user/',get_user, name='user'),
]