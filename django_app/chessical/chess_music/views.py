from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
import pyrebase

# Create your views here.
def index(request):
    if request.method=='POST':
        game=request.POST.get('GameList') 
        return render(request,'chess_music/musicPlayer.html')

        return HttpResponse(game) 
    config = {
    "apiKey": "AIzaSyBoFfC1va0c9vhgSbVntIWzDC-jtxVV6HI",
    "authDomain": "chess-app-cbfb0.firebaseapp.com",
    "databaseURL": "https://chess-app-cbfb0.firebaseio.com",
    "storageBucket": "chess-app-cbfb0.appspot.com",
    "projectId": "chess-app-cbfb0",
    "messagingSenderId": "1089239373610"
    }
    firebase = pyrebase.initialize_app(config)
    db=firebase.database()
    context = {
    "games" : list(db.get().val().items())
    }
    return render(request,'chess_music/index.html',context)

def musicPlayer(request):
    return render(request,'chess_music/musicPlayer.html')
