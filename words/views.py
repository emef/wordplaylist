from django.http import HttpResponse
from django.shortcuts import render_to_response, get_object_or_404
from django.core import serializers
from wordplaylist.words.models import Word, Playlist, Email

def home(request):
    ps = Playlist.objects.order_by('-name')
    return render_to_response('home.html', {'playlists': ps})

def add_email(request):
    email = request.GET.get('email', None)
    if email is not None:
        e = Email(address=email)
        e.save()
        return HttpResponse('true')
    else:
        return HttpResponse('null')

def get_playlist(request, pl_id):
    pl = get_object_or_404(Playlist, id=pl_id)
    return HttpResponse(pl.json())
