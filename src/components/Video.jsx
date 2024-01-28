import React from "react";

const constraints = {
  audio: false,
  video: {
    // aspectRatio: window.screen.width / window.screen.height,
    width: document.body.clientWidth,
    // height: window.screen.height,
    facingMode: "environment", // or 'environment'
    // deviceId: {
    //   exact: "1d257b7114c6784b7da15efb068ce2976cc5eb3e3c62268255805c50c1fbe5f3",
    // }, // webcam
    deviceId: {
      exact: "4a219b2d248c56c039e55cb378188fef9514fb8be5eb3731472bcb74352185ea",
    }, // mac
  },
};

export default function Video(props) {
  let video = React.createRef();

  const playVideo = () => {
    video.current.play();
    props.playCallback();
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
