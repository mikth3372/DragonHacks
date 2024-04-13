from app import app
from flask import Flask, render_template, request
import asyncio
import websockets
import base64
import cv2
from config import HUME_API_KEY

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/send_frame', methods=['POST'])
def send_frame():
    frame_data = request.data
    asyncio.run(send_frame_to_hume(frame_data))
    return "Frame sent to Hume AI API"

async def send_frame_to_hume(frame_data):
    uri = f"wss://api.hume.ai/v0/stream/models?apiKey={HUME_API_KEY}"
    async with websockets.connect(uri) as websocket:
        message = {
            "models": {
                "expression": {}
            },
            "data": base64.b64encode(frame_data).decode("utf-8")
        }
        await websocket.send(message)
        response = await websocket.recv()
        print("Received:", response)

if __name__ == '__main__':
    app.run(debug=True)
