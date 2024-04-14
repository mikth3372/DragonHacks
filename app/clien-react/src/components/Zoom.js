import React from "react";
import ZoomMtgEmbedded from "@zoom/meetingsdk/embedded";

const client = ZoomMtgEmbedded.createClient();
let meetingSDKElement = document.getElementById("meetingSDKElement");
client.init({ zoomAppRoot: meetingSDKElement, language: "en-US" });

const Zoom = () => {
  return (
    <div>
      <div id="meetingSDKElement"></div>
    </div>
  );
};

export default Zoom;
