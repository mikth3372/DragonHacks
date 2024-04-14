import logo from "./logo.svg";
import "./App.css";
import { ZoomMtg } from "@zoom/meetingsdk";
import ZoomMtgEmbedded from "@zoom/meetingsdk/embedded";
import Footer from "./components/footer";
import Header from "./components/header";
import { useState } from "react";
import StatusBox from "./components/StatusBox";
// import Zoom from "./components/Zoom";

function App() {
  // variable for user status
  const [userStatus, setUserStatus] = useState("good");

  const client = ZoomMtgEmbedded.createClient();
  var authEndpoint = "http://localhost:4000";
  var sdkKey = "4VvHTcUiRoqpvg0rsBe5kw";
  var meetingNumber = "85719114952";
  var passWord = "m5e1q2";
  var role = 1;
  var userName = ""
  var userEmail = "";
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

  function startMeeting(signature) {
    let meetingSDKElement = document.getElementById("meetingSDKElement");

    client
      .init({
        zoomAppRoot: meetingSDKElement,
        language: "en-US",
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
          <div className="flex w-1/2 p-60">ZOOM BOX</div>
          <div className="flex flex-col w-1/2 p-60 border">
            <div className="flex h-3/5">ChatBox</div>
            <StatusBox userStatus={userStatus} />
          </div>
        </div>

        <div id="meetingSDKElement">
          {/* Zoom Meeting SDK Component View Rendered Here */}
        </div>

        <button onClick={getSignature}>Join Meeting</button>
      </main>
      <Footer />
    </div>
  );
}

export default App;
