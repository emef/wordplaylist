from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls.defaults import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'vocab.views.home', name='home'),
    # url(r'^vocab/', include('vocab.foo.urls')),

    url(r'^$', 'wordplaylist.words.views.home'),
    url(r'^playlist/(?P<pl_id>[^/]+)/', 'wordplaylist.words.views.get_playlist'),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
