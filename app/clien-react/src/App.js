import logo from "./logo.svg";
import "./App.css";
import { ZoomMtg } from "@zoom/meetingsdk";
import ZoomMtgEmbedded from "@zoom/meetingsdk/embedded";
import Footer from "./components/footer";
import Header from "./components/header";
import { useState } from "react";
import StatusBox from "./components/StatusBox";
import html2canvas from "html2canvas";
// import Zoom from "./components/Zoom";

function App() {
  // variable for user status
  const [userStatus, setUserStatus] = useState("good");
  const [meeting, setMeeting] = useState("83243247640");

  const client = ZoomMtgEmbedded.createClient();
  var authEndpoint = "http://localhost:4000";
  var sdkKey = "4VvHTcUiRoqpvg0rsBe5kw";
  var meetingNumber = "83243247640";
  var passWord = "9u0D8c";
  var role = 1;
  var userName = "allykim@seas.upenn.edu";
  var userEmail = "allykim@seas.upenn.edu";
  var registrantToken = "";
  var zakToken = "";

  function getSignature(e) {
    e.preventDefault();

    fetch(authEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meetingNumber: meetingNumber,
        role: role,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        startMeeting(response.signature);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const captureScreenshot = () => {
    // Capture the screenshot from the entire window/document
    html2canvas(document.body)
      .then((canvas) => {
        // Convert canvas to Blob
        canvas.toBlob((blob) => {
          // Check if blob is null
          if (!blob) {
            console.error("Blob was null");
            return;
          }
          const formData = new FormData();
          formData.append("screenshot", blob, "screenshot.png");

          // Send the Blob to the Flask server
          fetch("http://127.0.0.1:5000/upload", {
            method: "POST",
            headers: {
              "Access-Control-Allow-Origin": "*"
            },
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Success:", data);
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }, "image/png");
      })
      .catch((err) => {
        console.error("Error capturing screenshot:", err);
      });
  };

  function startMeeting(signature) {
    let meetingSDKElement = document.getElementById("meetingSDKElement");

    client
      .init({
        zoomAppRoot: meetingSDKElement,
        language: "en-US",
        customize: {
          video: {
            // isResizable: true,
            viewSizes: {
              default: {
                width: 720,
                height: 411,
              },
              ribbon: {
                width: 300,
                height: 700,
              },
            },
          },
        },
        patchJsMedia: true,
      })
      .then(() => {
        client
          .join({
            signature: signature,
            sdkKey: sdkKey,
            meetingNumber: meetingNumber,
            password: passWord,
            userName: userName,
            userEmail: userEmail,
            tk: registrantToken,
            zak: zakToken,
          })
          .then(() => {
            console.log("joined successfully");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="App">
      <Header />
      <main>
        {/* For Component View */}
        <div className="flex flex-row">
          <div className="flex w-1/2">
            <div id="meetingSDKElement" className="flex p-10">
              {/* Zoom Meeting SDK Component View Rendered Here */}
            </div>
          </div>
          <div className="flex flex-col w-1/2">
            <div className="flex h-3/5">ChatBox</div>
            <StatusBox userStatus={userStatus} />
          </div>
        </div>

        {/* <input
          type="text"
          value="Set Meeting Number"
          onClick={() => setMeeting(meetingNumber)}
        /> */}

        <button onClick={getSignature}>Join Meeting</button>
        <button onClick={captureScreenshot}>Screenshot Button</button>
        {/* <ScreenshotButton /> */}
      </main>
      <Footer />
    </div>
  );
}

export default App;
