import os, sys
sys.path.append('/usr/django')
os.environ['DJANGO_SETTINGS_MODULE'] = 'wordplaylist.settings'

import django.core.handlers.wsgi

application = django.core.handlers.wsgi.WSGIHandler()
