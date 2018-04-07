from django.urls import path

from . import views

app_name="chess_music"
urlpatterns = [
        path('',views.index,name="index"),
        ]
