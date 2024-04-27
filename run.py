from app import app, socketio

# Starts the app with socketio support
if __name__ == '__main__':
    socketio.init_app(app, manage_session=False, cors_allowed_origins=['http://localhost:5173'])
    socketio.run(app, debug=True, host='localhost', port=8000)