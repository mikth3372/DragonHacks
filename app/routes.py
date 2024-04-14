import base64
import websockets
from app import app, socketio
from flask import render_template
from flask_socketio import emit
from config import HUME_API_KEY
from hume import HumeStreamClient, StreamSocket
from hume.models.config import FaceConfig
import base64
import asyncio
import os
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
import json

CORS(app)
@app.route('/')

# @app.route('/test')
# # def index2():
# #     return render_template('test.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    print("Inside file")
    if 'screenshot' in request.files:
        file = request.files['screenshot']
        filename = secure_filename(file.filename)
        print(f"Saving file: {filename}")
        save_path = os.path.join('uploads', filename)
        if not os.path.exists('uploads'):
            print("No uploads folder, creating one")
            os.makedirs('uploads')
        file.save(save_path)
        return jsonify({"message": "File uploaded successfully", "path": save_path}), 200
    return jsonify({"error": "No file part"}), 400


@app.route('/')
@app.route('/index')

def index():
    return render_template('index.html')

async def main():
    client = HumeStreamClient(HUME_API_KEY)
    config = FaceConfig(identify_faces=True)
    async with client.connect([config]) as socket:
        result = await socket.send_file("temp_image.jpg")
        print(result)
    asyncio.run(main())

@socketio.on('send_frame')
def handle_send_frame(frame_data):
    socketio.start_background_task(send_frame_to_hume, frame_data)

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    
@socketio.on('send_frame')
def handle_send_frame(data):
    frame_data = data['frameData']
    print("Received frame data from client, starting background task.")
    def start_async_task():
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(process_frame(frame_data))
        loop.close()
    socketio.start_background_task(start_async_task)

async def send_frame_to_hume(frame_data):
    uri = f"wss://api.hume.ai/v0/stream/models?apiKey={HUME_API_KEY}"
    async with websockets.connect(uri) as websocket:
        byte_data = base64.b64decode(frame_data)
        message = {
            "models": {"expression": {}},
            "data": base64.b64encode(byte_data).decode('utf-8')
        }
        await websocket.send(json.dumps(message))
        response = await websocket.recv()
        print("Received:", response)
        socketio.emit('response_from_server', {'data': response})

def save_image_from_base64(base64_string, path_to_save):
    with open(path_to_save, "wb") as fh:
        image_data = base64.b64decode(base64_string.split(",")[1])  # Remove the base64 prefix if present
        fh.write(image_data)

async def process_frame(frame_data):
    api_key = HUME_API_KEY
    client = HumeStreamClient(api_key)
    config = FaceConfig(identify_faces=True)
    try:
        img_data = base64.b64decode(frame_data)
        filepath = 'temp_image.jpg'
        with open(filepath, 'wb') as f:
            f.write(img_data)

        async with client.connect([config]) as socket:
            result = await socket.send_file(filepath)
            print(result)
            socketio.emit('response_from_server', {'data': result})
    except Exception as e:
        print(f"Error processing frame with Hume SDK: {e}")
        socketio.emit('response_from_server', {'error': str(e)})
