import React, { useRef, useState, useEffect, createRef } from "react";
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
      <Video playCallback={playCallback} />
      <HandOverlay isPlaying={isPlaying} />
    </div>
  );
}
