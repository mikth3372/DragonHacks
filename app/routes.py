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
import asyncio
import openai
import tiktoken
import time


openai.api_key = 'sk-'
os.environ['OPENAI_API_KEY'] = openai.api_key
CORS(app)
@app.route('/')

# @app.route('/test')
# # def index2():
# #     return render_template('test.html')

#create a global messages array
# global messages = []

async def main(image_path=None):
    client = HumeStreamClient(HUME_API_KEY)
    config = FaceConfig(identify_faces=True)
    async with client.connect([config]) as socket:
        result = await socket.send_file(image_path)
        print(result)
    return result    
    #asyncio.run(main())

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
        print(save_path)
        # call the function to process the image
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(main(save_path))
        max_score = 0
        #call gpt_response
        for emotion in result['face']['predictions'][0]['emotions']:
    # If the current emotion's score is higher than the current max score, update the max score and max emotion
            if emotion['score'] > max_score:
                max_score = emotion['score']
                max_emotion = emotion['name']
        sorted_emotions = sorted(result['face']['predictions'][0]['emotions'], key=lambda x: x['score'], reverse=True)
        top_4_emotions = sorted_emotions[:4]
        top_4_emotions_names_scores = [(emotion['name'], emotion['score']) for emotion in top_4_emotions]
        gpt_response = get_gpt_response(max_emotion)
        loop.close()
        
        return jsonify({"message": "File uploaded successfully", "result": result,"response":gpt_response, "emotion":max_emotion, "top_emotions":top_4_emotions_names_scores }), 200
    return jsonify({"error": "No file part"}), 400


@app.route('/')
@app.route('/index')

def index():
    return render_template('index.html')

async def main(image_path=None):
    client = HumeStreamClient(HUME_API_KEY)
    config = FaceConfig(identify_faces=True)
    async with client.connect([config]) as socket:
        result = await socket.send_file(image_path)
        print(result)
    return result    
    #asyncio.run(main())


def get_gpt_response(input_text, max_response_tokens=500, max_retries=3, base_wait_time=2):

    overall_max_tokens = 4096
    prompt_max_tokens = overall_max_tokens - max_response_tokens

    system_query = {"role": "system", "content": "This is an interview and you are helping the interviewer understand the emotions of the interviewee and help guide them accordingly. Based on the emotion they feel, give the interviewer a response that would help the interviewee feel better. The interviewee is feeling the following emotion:"}

    formatted_query = {"role": "user", "content": input_text}

    # Adding the query to the messages
    #create a new messages array
    messages=[]
    messages.append(system_query)

    messages.append(formatted_query)
        # Adding the query to the cache
    # self.conversation_cache.append(formatted_query)
        # print(self.messages)
        # To check if the prompt has tokens within the limit
    token_count = num_tokens_from_messages(messages)
        # print(f"Token_Count: {token_count}")
    while token_count > prompt_max_tokens and len(messages) > 1:
        #print(f"Deleting the message: { self.messages[1]}")
    # We can pop the element 1 to keep the context(system) alive [rather than 0]
        messages.pop(1)  # To keep the prompt intact
        token_count = num_tokens_from_messages(messages)
        print(f"Token_Count: {token_count}")
        print(f"Max count: {prompt_max_tokens}")

    for retry in range(max_retries):
        # try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo", temperature=0.8, max_tokens=500, messages=messages)                
        # the response from the assistant is saved into the chat history(messages)
        messages.append(dict(response["choices"][0]["message"]))
        # Adding to the response to the cache
        # self.conversation_cache.append(
        #     response["choices"][0]["message"])
        return response["choices"][0]["message"]["content"]

        # except openai.error.APIConnectionError as e:
        #     wait_time = base_wait_time * \
        #         (2 ** retry)  # Exponential backoff
        #     time.sleep(wait_time)
        #     continue
    # raise Exception("Max retries reached.")

def num_tokens_from_messages(messages, model="gpt-4"):
    encoding = tiktoken.encoding_for_model(model)
    num_tokens = 0
    for message in messages:
        # every message follows <im_start>{role/name}\n{content}<im_end>\n
        num_tokens += 4
        for key, value in message.items():
            num_tokens += len(encoding.encode(value))
            if key == "name":  # if there's a name, the role is omitted
                num_tokens += -1  # role is always required and always 1 token
    num_tokens += 2  # every reply is primed with <im_start>assistant
    return num_tokens
    

# @socketio.on('send_frame')
# def handle_send_frame(frame_data):
#     socketio.start_background_task(send_frame_to_hume, frame_data)

# @socketio.on('connect')
# def handle_connect():
#     print('Client connected')
    
# @socketio.on('send_frame')
# def handle_send_frame(data):
#     frame_data = data['frameData']
#     print("Received frame data from client, starting background task.")
#     def start_async_task():
#         loop = asyncio.new_event_loop()
#         asyncio.set_event_loop(loop)
#         loop.run_until_complete(process_frame(frame_data))
#         loop.close()
#     socketio.start_background_task(start_async_task)

# async def send_frame_to_hume(frame_data):
#     uri = f"wss://api.hume.ai/v0/stream/models?apiKey={HUME_API_KEY}"
#     async with websockets.connect(uri) as websocket:
#         byte_data = base64.b64decode(frame_data)
#         message = {
#             "models": {"expression": {}},
#             "data": base64.b64encode(byte_data).decode('utf-8')
#         }
#         await websocket.send(json.dumps(message))
#         response = await websocket.recv()
#         print("Received:", response)
#         socketio.emit('response_from_server', {'data': response})

# def save_image_from_base64(base64_string, path_to_save):
#     with open(path_to_save, "wb") as fh:
#         image_data = base64.b64decode(base64_string.split(",")[1])  # Remove the base64 prefix if present
#         fh.write(image_data)

# async def process_frame(frame_data):
#     api_key = HUME_API_KEY
#     client = HumeStreamClient(api_key)
#     config = FaceConfig(identify_faces=True)
#     try:
#         img_data = base64.b64decode(frame_data)
#         filepath = 'temp_image.jpg'
#         with open(filepath, 'wb') as f:
#             f.write(img_data)

#         async with client.connect([config]) as socket:
#             result = await socket.send_file(filepath)
#             print(result)
#             socketio.emit('response_from_server', {'data': result})
#     except Exception as e:
#         print(f"Error processing frame with Hume SDK: {e}")
#         socketio.emit('response_from_server', {'error': str(e)})
