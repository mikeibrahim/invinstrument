import React from "react";

export default function Video(props) {
  let video = React.createRef();

  const constraints = {
    audio: false,
    video: {
      // facingMode: "environment", // or 'environment'
      deviceId: {
        exact: props.deviceId,
      },
    },
  };

  const playVideo = () => {
    video.current.play();
    // props.playCallback();
  };

  navigator.mediaDevices.enumerateDevices().then((devices) => {
    devices.forEach((device) => {
      if (device.kind === "videoinput") {
        console.log(device.deviceId);
        console.log(device.label);
        console.log(device.kind);
      }
    });
  });

  if (!navigator.mediaDevices)
    console.log("Sorry, getUserMedia is not supported");
  else {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        console.log("stream: ", stream);
        if (video.current && !video.current.srcObject) {
          video.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  return (
    <video id="video" ref={video} autoPlay playsInline onCanPlay={playVideo} />
  );
}
