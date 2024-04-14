import logo from "./logo.svg";
import "./App.css";
import { ZoomMtg } from "@zoom/meetingsdk";
import ZoomMtgEmbedded from "@zoom/meetingsdk/embedded";
import Footer from "./components/footer";
import Header from "./components/header";
import { useState } from "react";
import html2canvas from "html2canvas";
// import Zoom from "./components/Zoom";

function App() {
  // variable for user status
  const [userStatus, setUserStatus] = useState("good");
  const [meeting, setMeeting] = useState("");
  const bgColorClass = userStatus === "good" ? "bg-green-500" : "bg-red-500";

  const client = ZoomMtgEmbedded.createClient();
  var authEndpoint = "http://localhost:4000";
  var sdkKey = "4VvHTcUiRoqpvg0rsBe5kw";
  var meetingNumber = meeting;
  var passWord = "azx8A8";
  var role = 1;
  var userName = "allykim@seas.upenn.edu";
  var userEmail = "allykim@seas.upenn.edu";
  var registrantToken = "";
  var zakToken = "";

  function handleJoinMeeting(e) {
    e.preventDefault();
    getSignature(e);
  }

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
          fetch("http://localhost:5000/upload", {
            method: "POST",
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
    <div className="App bg-main-color">
      <Header />
      <main>
        {/* For Component View */}
        <div className="flex place-content-center pb-16 bg-main-color">
          <form onSubmit={handleJoinMeeting} className="flex flex-row">
            <input
              type="text"
              name="meeting-number"
              id="meeting-number"
              onChange={(e) => setMeeting(e.target.value)}
              placeholder="Enter Meeting Number"
              className="p-10 appearance-none border rounded w-15 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <button
              type="submit"
              onSubmit={handleJoinMeeting}
              className="ml-10 bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-full"
            >
              Join Meeting
            </button>
          </form>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col w-1/2 bg-slate-200 mx-auto mb-60">
            <div className={`flex rounded ${bgColorClass} justify-center`}>
              User Status: {userStatus}
            </div>
            <div className="flex w-auto h-96">
              <div id="meetingSDKElement" className="flex">
                {/* Zoom Meeting SDK Component View Rendered Here */}
              </div>
            </div>
          </div>
        </div>
        {/* <button onClick={captureScreenshot}>Screenshot Button</button> */}
      </main>
      <Footer />
    </div>
  );
}

export default App;
