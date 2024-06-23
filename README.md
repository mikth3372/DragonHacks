# Serenity - emotionally intelligent video conferencing

Serenity is a full stack application, with embedded Zoom video conferencing, that analyzes particpant's emotions and provides suggestions on what to say/how to behave based on detected emotions.
Serenity can be used as a commercial tool by recruiters from large companies or simply by your closest friends to give more emotional insight on the person you're talking to.

2024 DragonHacks Hackathon
Award: Best .Tech Domain Name

## Running the Project Locally

### How to start server to generate Zoom meeting SDK via HTTP request
1. Navigate to the `frontend` folder:
   ```bash
   cd meetingsdk-auth-endpoint-sample
   ```
2. Install all required modules:
   ```bash
   npm install
   ```
3. Start server
   ```bash
   npm run start
   ```
### How to open application
1. Navigate to the `DragonHacks` folder:
2. Install all required modules:
3. Start application
   ```bash
   flask run
   ```

## Application Features
- Embedded Zoom video conferencing
- Real-time visual analysis on participant's emotions
- Suggestions on what to say/ how to behave based on detected emotions

## Website Sample

## Architecture
- Hume API and OpenAI API for emotion detection and feedback generation
- Backend: Flask
- Frontend: React.js
