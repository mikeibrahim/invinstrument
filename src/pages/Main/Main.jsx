import React, { useState } from "react";
import Video from "../../components/Video.jsx";
import HandOverlay from "../../components/HandOverlay.jsx";

export default function Main() {
  const [isPlaying, setIsPlaying] = useState(false);
  const playCallback = () => {
    console.log("playing");
    setIsPlaying(true);
  };

  return (
    <div>
      <Video width={document.body.clientWidth} playCallback={playCallback} />
      <HandOverlay isPlaying={isPlaying} />
    </div>
  );
}
