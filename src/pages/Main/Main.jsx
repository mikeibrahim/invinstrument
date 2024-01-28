import React, { useState } from "react";
import Video from "../../components/Video.jsx";
import HandOverlay from "../../components/HandOverlay.jsx";
import AR from "../../components/AR.jsx";

export default function Main() {
  const [isPlaying, setIsPlaying] = useState(false);
  const playCallback = () => setIsPlaying(true);

  const clickCallback = (coordinates) => {
    console.log("Clicked: ", coordinates);
  };

  return (
    <div>
      <Video
        deviceId={
          "1d257b7114c6784b7da15efb068ce2976cc5eb3e3c62268255805c50c1fbe5f3" // iphone
          // "4a219b2d248c56c039e55cb378188fef9514fb8be5eb3731472bcb74352185ea" // mac
        }
        playCallback={playCallback}
      />
      <AR />
      <HandOverlay
        clickCallback={clickCallback}
        hoverCallback={() => {}}
        isPlaying={isPlaying}
        keypressCallback={() => {}}
      />
    </div>
  );
}
