from django.http import HttpResponse
from django.shortcuts import render_to_response, get_object_or_404
from django.core import serializers
from wordplaylist.words.models import Word, Playlist

def home(request):
    ps = Playlist.objects.order_by('-name')
    return render_to_response('home.html', {'playlists': ps})

def get_playlist(request, pl_id):
    pl = Playlist.objects.filter(pk=pl_id)
    if len(pl) > 0:
        return HttpResponse(pl[0].json())
    else:
        return HttpResponse('null')
