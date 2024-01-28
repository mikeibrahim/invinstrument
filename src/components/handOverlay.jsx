import "@tensorflow/tfjs-backend-webgl";
// import * as mpHands from "@mediapipe/hands";

import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import React, { useEffect, useState } from "react";
import { distance, distance3D } from "./Math";
import { keyboard } from "@testing-library/user-event/dist/keyboard";

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

const fingerTips = [
  handKey.thumb_tip,
  handKey.index_finger_tip,
  handKey.middle_finger_tip,
  handKey.ring_finger_tip,
  handKey.pinky_finger_tip,
];

const connections = [
  [handKey.wrist, handKey.thumb_cmc],
  [handKey.thumb_cmc, handKey.thumb_mcp],
  [handKey.thumb_mcp, handKey.thumb_ip],
  [handKey.thumb_ip, handKey.thumb_tip],
  [handKey.wrist, handKey.index_finger_mcp],
  [handKey.index_finger_mcp, handKey.index_finger_pip],
  [handKey.index_finger_pip, handKey.index_finger_dip],
  [handKey.index_finger_dip, handKey.index_finger_tip],
  [handKey.wrist, handKey.middle_finger_mcp],
  [handKey.middle_finger_mcp, handKey.middle_finger_pip],
  [handKey.middle_finger_pip, handKey.middle_finger_dip],
  [handKey.middle_finger_dip, handKey.middle_finger_tip],
  [handKey.wrist, handKey.ring_finger_mcp],
  [handKey.ring_finger_mcp, handKey.ring_finger_pip],
  [handKey.ring_finger_pip, handKey.ring_finger_dip],
  [handKey.ring_finger_dip, handKey.ring_finger_tip],
  [handKey.wrist, handKey.pinky_finger_mcp],
  [handKey.pinky_finger_mcp, handKey.pinky_finger_pip],
  [handKey.pinky_finger_pip, handKey.pinky_finger_dip],
  [handKey.pinky_finger_dip, handKey.pinky_finger_tip],
];

export default function HandOverlay(props) {
  const [detector, setDetector] = useState(null);
  const [size, setSize] = useState({ x: 0, y: 0 });
  const [prevHandPos, setPrevHandPos] = useState([
    { x: null, y: null },
    { x: null, y: null },
    { x: null, y: null },
    { x: null, y: null },
    { x: null, y: null },
    { x: null, y: null },
    { x: null, y: null },
    { x: null, y: null },
    { x: null, y: null },
    { x: null, y: null },
  ]);
  let [clicking, setClicking] = useState(false);
  const [keyCooldown, setKeyCooldown] = useState(2);
  let currentKeyCooldown = keyCooldown;
  let currentPrevHandPos = prevHandPos;

  const video = document.getElementById("video");
  const canvas = React.createRef();
  console.log("currentKeyCooldown", currentKeyCooldown);

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
    if (video && detector && props.isPlaying && canvas.current) {
      if (size.x === 0) {
        setSize({ x: video.offsetWidth, y: video.offsetHeight });
      }
      intervalId = setInterval(() => {
        clearCanvas();
        detector.estimateHands(video).then((hands) => {
          hands?.forEach((hand, i) => {
            const keypoints = hand.keypoints;
            drawHandConnections(keypoints);
            drawHand(keypoints);
            detectPinch(keypoints);
            detectFingerDown(
              keypoints,
              hand.handedness === "Right",
              currentKeyCooldown
            );
            // console.log(keyCooldown);
          });
          currentKeyCooldown -= 0.1;
          setKeyCooldown(currentKeyCooldown);
          setPrevHandPos(currentPrevHandPos);
        });
      }, 10);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  });

  const clearCanvas = () => {
    if (!canvas.current) return;
    const ctx = canvas.current.getContext("2d");
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
  };

  const drawHand = (keypoints) => {
    if (!(canvas.current && keypoints)) return;
    const ctx = canvas.current.getContext("2d");
    ctx.fillStyle = "blue";
    let radius = 15;

    for (let i = 0; i < keypoints.length; i++) {
      if (!fingerTips.includes(i)) continue;

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

  const drawHandConnections = (keypoints) => {
    connections.forEach((connection) => {
      const ctx = canvas?.current?.getContext("2d");
      if (!ctx) {
        return;
      }
      ctx.strokeStyle = "#484b89";
      ctx.lineWidth = 30;
      ctx.beginPath();
      ctx.moveTo(
        (keypoints[connection[0]].x / video.videoWidth) * size.x,
        (keypoints[connection[0]].y / video.videoHeight) * size.y
      );
      ctx.lineTo(
        (keypoints[connection[1]].x / video.videoWidth) * size.x,
        (keypoints[connection[1]].y / video.videoHeight) * size.y
      );
      ctx.stroke();
    });
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

    thumbCoordinate.x =
      (thumbCoordinate.x / video.videoWidth) * document.body.clientWidth;
    pointerCoordinate.x =
      (pointerCoordinate.x / video.videoWidth) * document.body.clientWidth;
    thumbCoordinate.y =
      (thumbCoordinate.y / video.videoHeight) * document.body.clientHeight;
    pointerCoordinate.y =
      (pointerCoordinate.y / video.videoHeight) * document.body.clientHeight;

    if (video.getBoundingClientRect().height < document.body.clientHeight) {
      pointerCoordinate.y +=
        (document.body.clientHeight - video.getBoundingClientRect().height) / 2;
    }
    if (dist < 15) {
      props.hoverCallback(pointerCoordinate); // returns {x: __, y: __}
      if (!clicking) {
        setClicking(true);
      }
    } else if (dist > 30) {
      if (clicking) {
        props.clickCallback(pointerCoordinate);
        setClicking(false);
      }
    }
  };

  const detectFingerDown = (keypoints, handNumber, cooldown) => {
    fingerTips.forEach((fingerKey, i) => {
      const finger = keypoints[fingerKey];
      const prevFinger = prevHandPos[i + 5 * handNumber];
      // const wrist = keypoints[handKey.wrist];

      if (prevFinger.x) {
        const deltax = finger.x - prevFinger.x;
        const deltay = finger.y - prevFinger.y;
        // if (handNumber === 0 && i === 0) {
        //   console.log(deltay);
        // }
        if (deltay > 15 && cooldown <= 0) {
          console.log("CLICK: ", i + 5 * handNumber + 1);
          props.keypressCallback(i + 5 * handNumber + 1);
          currentKeyCooldown = 0.5;
          cooldown = 0.5;
        }
      }

      currentPrevHandPos[handNumber * 5 + i] = {
        x: keypoints[fingerKey].x,
        y: keypoints[fingerKey].y,
      };
    });
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
