from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS


app = Flask(__name__)
# socketio = SocketIO(app)
socketio = SocketIO(app, cors_allowed_origins="*")

CORS(app)

# Import other parts of your application
from app import routes
