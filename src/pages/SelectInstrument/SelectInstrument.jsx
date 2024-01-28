import React, { useState, useRef } from "react";
import PIANO from "./piano.png";
import GUITAR from "./guitar.png";
import LEFT_ARROW from "./left-arrow.png";
import Video from "../../components/Video";
import HandOverlay from "../../components/HandOverlay";
import np from "noteplayer";
import OpenSheetMusicDisplay from "./OpenSheetMusicDisplay";
import { OpenSheetMusicDisplay as OSMD } from "opensheetmusicdisplay";
import AR from "../../components/AR";

export default function SelectInstrument() {
  const [isPlaying, setIsPlaying] = useState(false);
  const playCallback = () => setIsPlaying(true);

  const [instrument, setInstrument] = useState("menu");
  const instruments = [
    { name: "piano", image: PIANO },
    { name: "guitar", image: GUITAR },
  ];
  const btns = [
    {
      onClick: () => setInstrument("piano"),
      ref: useRef(null),
      hover: useState(false),
    },
    {
      onClick: () => setInstrument("guitar"),
      ref: useRef(null),
      hover: useState(false),
    },
    {
      onClick: () => setInstrument("menu"),
      ref: useRef(null),
      hover: useState(false),
    },
  ];
  // 10-6 = left hand
  // 1-5 = right hand
  const NOTE_MAP = {
    10: "G2",
    9: "A3",
    8: "B3",
    7: "C3",
    6: "D3",
    1: "E3",
    2: "F3",
    3: "G3",
    4: "A4",
    5: "B4",
  };

  let osmd;
  const setupOsmd = (divRef, file) => {
    osmd = new OSMD(divRef.current, { autoResize: true, drawTitle: true });
    osmd.load(file).then(() => {
      osmd.render();
      // console.log(osmd, osmd.cursor, osmd.cursors[0])
      osmd.cursors[0].show();
    });
  };

  const NOTES = [
    "G2",
    "G2",
    "A3",
    "G2",
    "C3",
    "B3",
    "G2",
    "G2",
    "A3",
    "G2",
    "D3",
    "C3",
    "G2",
    "G2",
    "G3",
    "E3",
    "C3",
    "B3",
    "A3",
    "F3",
    "F3",
    "E3",
    "C3",
    "D3",
    "C3",
  ];
  let currNote = 0;

  return (
    <>
      <Video width={document.body.clientWidth} playCallback={playCallback} />
      <nav id="nav">
        <title id="title">
          {instrument === "menu" ? "SELECT AN INSTRUMENT" : "PLAY"}
        </title>
      </nav>
      {/* {instrument === "piano" ? <AR /> : null} */}
      <AR />
      {instrument === "menu" ? (
        <div id="instruments">
          {instruments.map((data, i) => (
            <img
              ref={btns[i].ref}
              className={
                "instrument-img btn" +
                (btns[i].hover[0] ? " instrument-hover" : "")
              }
              key={i}
              src={data.image}
              alt={data.name}
              onClick={() => setInstrument(data.name)}
            />
          ))}
        </div>
      ) : (
        <div id="back-circle" className="btn">
          <img
            src={LEFT_ARROW}
            ref={btns[2].ref}
            className={btns[2].hover[0] ? "instrument-hover" : ""}
            alt="back"
            id="back"
            onClick={() => setInstrument("menu")}
          ></img>
        </div>
      )}
      {/* <OpenSheetMusicDisplay setupOsmd={setupOsmd} file="happy-bday.xml" /> */}
      <HandOverlay
        hoverCallback={({ x, y }) => {
          btns.forEach((b) => {
            if (!b.ref.current) return;
            const rect = b.ref.current.getBoundingClientRect();
            // console.log(b.hover)
            if (
              rect.left <= x &&
              x <= rect.right &&
              rect.top <= y &&
              y <= rect.bottom
            )
              b.hover[1](true);
            else b.hover[1](false);
          });
        }}
        clickCallback={({ x, y }) => {
          // console.log("pinch:", x, y)
          btns.forEach((b) => {
            if (!b.ref.current) return;
            const rect = b.ref.current.getBoundingClientRect();
            // console.log("rect:", rect, rect.left, rect.right, rect.top, rect.bottom)
            if (
              rect.left <= x &&
              x <= rect.right &&
              rect.top <= y &&
              y <= rect.bottom
            ) {
              b.onClick();
              b.hover[1](false);
            }
          });
        }}
        keypressCallback={(finger) => {
          if (instrument === "menu") return;
          np.buildFromName(NOTE_MAP[finger]).play();
          if (NOTES[currNote] !== NOTE_MAP[finger]) return;
          osmd.cursor.next();
          currNote++;
          // console.log(osmd.cursor);
          // console.log(osmd.cursor.NotesUnderCursor());
          // console.log(NOTE_MAP[finger]);
        }}
        isPlaying={isPlaying}
      />
      {instrument === "piano" ? (
        <OpenSheetMusicDisplay setupOsmd={setupOsmd} file="happy-bday.xml" />
      ) : null}
    </>
  );
}
