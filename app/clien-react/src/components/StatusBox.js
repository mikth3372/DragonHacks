import React from "react";

function StatusBox({ userStatus }) {
  const bgColorClass = userStatus === "good" ? "bg-green-500" : "bg-red-500";

  return (
    <div className={`flex w-40 h-10 rounded ${bgColorClass}`}>
      User Status: {userStatus}
    </div>
  );
}

export default StatusBox;
