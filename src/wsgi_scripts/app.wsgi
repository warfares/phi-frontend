import os
import sys
sys.path.append('/Code/git/phi/src/wsgi_scripts')

import bottle
from beaker.middleware import SessionMiddleware


session_opts = {
    'session.type': 'file',
    'session.cookie_expires': 300,
    'session.data_dir': './data',
    'session.auto': True
}

my_app = SessionMiddleware(bottle.default_app(), session_opts)

bottle.debug(True)

#Phi-Backend 1.0 

from phi.rest.user import *
from phi.rest.workspace import *
from phi.rest.layer import *
from phi.rest.location import *
from phi.rest.group import *
from phi.rest.role import *


#geo-lib 1.0 

from geo.rest.group import *
from geo.rest.layer import *
from geo.rest.metadata import * 


application = my_app