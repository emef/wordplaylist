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
            from django.core.mail import send_mail
            # new playlist, mass email subscribers
            msg = 'New Playlist, %s, at wordplaylist.com\n\n' % obj.name
            msg += 'Words included in %s:\n' % obj.name
            for word in obj.word_set.all():
                msg += "%s\n" % word.word
            #send the email
            send_mail('subject', msg, 'info@wordplaylist.com', [e.address for e in Email.objects.all()], fail_silently=False)
            
admin.site.register(Word)
admin.site.register(Playlist, PlaylistAdmin)
