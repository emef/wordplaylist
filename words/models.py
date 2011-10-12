from django.db import models
import simplejson as json

class Email(models.Model):
    address = models.CharField(max_length=200, primary_key=True)

    def __unicode__(self):
        return self.address[:20]

    def __save__(self, *args, **kwargs):
        self.address = self.address.lower()
        super(Email, self).save(*args, **kwargs)
    
class Playlist(models.Model):
    name = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now=True)
    
    def get_words(self):
        import random
        ws = list(self.words.all())
        random.shuffle(ws)
        return ws

    def json(self):
        ws = [w.obj() for w in self.get_words()]
        return json.dumps({'name': self.name, 'words': ws})
    
    def __unicode__(self):
        return self.name
    
class Word(models.Model):
    word = models.CharField(max_length=150)
    definition = models.CharField(max_length=250)
    synonyms = models.CharField(max_length=250, blank=True)
    playlist = models.ForeignKey(Playlist)

    def obj(self):
        return {'word': self.word,
                'definition': self.definition,
                'synonyms': self.synonyms}
    
    def json(self):
        return json.dumps(self.obj())

    def __unicode__(self):
        return self.word
