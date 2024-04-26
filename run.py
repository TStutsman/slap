from app import app, socketio

# Starts the app with socketio support
if __name__ == '__main__':
    print('success')
    socketio.init_app(app, cors_allowed_origins=['http://localhost:5173'])
    socketio.run(app, debug=True, port=8000)