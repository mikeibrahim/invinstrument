import "@tensorflow/tfjs-backend-webgl";
// import * as mpHands from "@mediapipe/hands";

import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import React, { useEffect, useState } from "react";
import { distance } from "./Math";

const handKey = {
  wrist: 0,
  thumb_cmc: 1,
  thumb_mcp: 2,
  thumb_ip: 3,
  thumb_tip: 4,
  index_finger_mcp: 5,
  index_finger_pip: 6,
  index_finger_dip: 7,
  index_finger_tip: 8,
  middle_finger_mcp: 9,
  middle_finger_pip: 10,
  middle_finger_dip: 11,
  middle_finger_tip: 12,
  ring_finger_mcp: 13,
  ring_finger_pip: 14,
  ring_finger_dip: 15,
  ring_finger_tip: 16,
  pinky_finger_mcp: 17,
  pinky_finger_pip: 18,
  pinky_finger_dip: 19,
  pinky_finger_tip: 20,
};

export default function HandOverlay(props) {
  const [detector, setDetector] = useState(null);
  const [size, setSize] = useState({ x: 0, y: 0 });
  const video = document.getElementById("video");
  const canvas = React.createRef();

  if (!detector) {
    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    const detectorConfig = {
      runtime: "mediapipe", // or 'tfjs',
      solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
      modelType: "full",
    };
    handPoseDetection
      .createDetector(model, detectorConfig)
      .then((value) => setDetector(value));
  }

  useEffect(() => {
    let intervalId;

    if (video && detector && props.isPlaying) {
      if (size.x === 0) {
        console.log("video: ", video);
        setSize({ x: video.offsetWidth, y: video.offsetHeight });
      }
      intervalId = setInterval(() => {
        detector.estimateHands(video).then((hands) => {
          console.log("hands: ", hands);
          hands?.forEach((hand) => {
            const keypoints = hand.keypoints;
            drawHand(keypoints);
            detectPinch(keypoints);
          });
        });
      }, 100);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  });

  const drawHand = (keypoints) => {
    if (!(canvas.current && keypoints)) return;
    const ctx = canvas.current.getContext("2d");
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
    ctx.fillStyle = "blue";
    let radius = 10;

    for (let i = 0; i < keypoints.length; i++) {
      let circle = new Path2D(); // <<< Declaration
      circle.arc(
        (keypoints[i].x / video.videoWidth) * size.x,
        (keypoints[i].y / video.videoHeight) * size.y,
        radius,
        0,
        2 * Math.PI,
        false
      );
      ctx.fill(circle); //   <<< pass circle to context
    }
  };

  const detectPinch = (keypoints) => {
    const thumbCoordinate = keypoints[handKey.thumb_tip];
    const pointerCoordinate = keypoints[handKey.index_finger_tip];
    const dist = distance(
      thumbCoordinate.x,
      thumbCoordinate.y,
      pointerCoordinate.x,
      pointerCoordinate.y
    );

    if (dist < 15) {
      props.clickCallback(pointerCoordinate); // returns {x: __, y: __}
    }
  };

  return (
    <canvas
      id="hand-canvas"
      ref={canvas}
      width={size.x}
      height={size.y}
    ></canvas>
  );
}
