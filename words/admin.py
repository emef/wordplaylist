from django.contrib import admin
from wordplaylist.words.models import Word, Playlist, Email

class WordInline(admin.StackedInline):
    model = Word
    extra = 3

class PlaylistAdmin(admin.ModelAdmin):
    inlines = [WordInline]
        
    def save_model(self, request, obj, form, **kwargs):
        #save data like normal
        obj.save()
        form.save_m2m()

        if not kwargs.get('change', True):
            from django.core.mail import EmailMessage
            # new playlist, mass email subscribers
            msg = '<h2>New Playlist, %s, at wordplaylist.com</h2>' % obj.name
            msg += '<div>Words included in %s:<ul>' % obj.name
            for word in obj.word_set.all():
                msg += "<li>%s</li>" % word.word
                msg += "</ul></div>"
            #send the email
            email = EmailMessage('New Playlist at wordplaylist.com',
                                 msg,
                                 'info@wordplaylist.com',
                                 [e.address for e in Email.objects.all()])
            email.content_subtype = 'html'
            email.send()
            
admin.site.register(Word)
admin.site.register(Playlist, PlaylistAdmin)
