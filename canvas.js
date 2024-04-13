let socket;
let intervalId; // Variable to store the interval ID

// Get the start button
const startButton = document.getElementById("startButton");

// If start button is clicked, then start sending frames to Hume
startButton.addEventListener("click", function () {
  // Start capturing and sending frames
  captureAndSendFrame();
});

// Get the end button
const endButton = document.getElementById("endButton");

// If end button is clicked, then stop sending frames to Hume
endButton.addEventListener("click", function () {
  // Clear the interval to stop capturing and sending frames
  clearInterval(intervalId);
});

// capture frames from video
async function captureAndSendFrame() {
  const video = document.getElementById("videoElement");
  const canvas = document.getElementById("canvasElement");
  const context = canvas.getContext("2d");

  // connect to Hume
  connectHume(apiKey);

  // Set the canvas size to the video size
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Take frames every 200ms
  intervalId = setInterval(function () {
    // Draw the video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the canvas image to Base64
    var base64ImageData = canvas.toDataURL("image/jpeg");

    // Convert Base64 to Blob
    var blob = base64ToBlob(base64ImageData);

    // Send the Blob over WebSocket
    socket.send(blob);
  }, 200);
}

// Function to convert Base64 image to Blob
function base64ToBlob(base64) {
  var binary = atob(base64.split(",")[1]);
  var array = [];
  for (var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: "image/jpeg" });
}

// create connection to HUME
function connectHume(apiKey) {
  const wsURL = `wss://api.hume.ai/v0/stream/models?apikey=${apiKey}`;

  const socket = new WebSocket(webSocketURL);

  socket.addEventListener("open", () => {
    console.log("WebSocket connection established.");
  });

  socket.addEventListener("message", (event) => {
    // parse the message response body
    const data = JSON.parse(event.data);
    console.log("Message response body: ", data);
  });
}
