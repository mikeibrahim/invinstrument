import React from "react";
// import AFRAME from "ar.js";

export default function AR(props) {
  return (
    <a-scene
      embedded
      arjs="patternRatio: 0.9; debugUIEnabled: false;"
      vr-mode-ui="enabled: false"
    >
      <a-marker type="pattern" url="/marker.patt">
        {/* <a-entity
          // class="clickable"
          obj-model="obj: url(/piano.obj); mtl: url(/piano.mtl)"
          scale="10 10 10"
          position="0 0 0"
        ></a-entity> */}
        <a-entity
          position="0 1 0"
          scale="13 13 13"
          rotation="0 0 0"
          gltf-model="/piano.glb"
        ></a-entity>
      </a-marker>
      <a-entity camera></a-entity>
    </a-scene>
  );
}
