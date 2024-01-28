import React from "react";
// import AFRAME from "ar.js";

export default function AR(props) {
  // AFRAME.registerComponent("collider-check", {
  //   dependencies: ["raycaster"],

  //   init: function () {
  //     this.el.addEventListener("raycaster-intersection", function () {
  //       console.log("Player hit something!");
  //     });
  //   },
  // });
  return (
    <a-scene
      embedded
      arjs="patternRatio: 0.9; debugUIEnabled: false;"
      vr-mode-ui="enabled: false"
    >
      <a-marker type="pattern" url="/marker.patt">
        {/* <a-box position="0 0.5 0" material="color: red;"></a-box> */}
        <a-entity
          collider-check
          raycaster="objects: .collidable; showLine:true;"
          obj-model="obj: url(/piano.obj); mtl: url(/piano.mtl)"
          scale="10 10 10"
          position="0 0 1"
        ></a-entity>
      </a-marker>
      <a-entity camera></a-entity>
    </a-scene>
  );
}
