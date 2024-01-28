import React, { useState, useRef } from "react";
import PIANO from './piano.png';
import GUITAR from './guitar.png';
import LEFT_ARROW from './left-arrow.png';
import Video from "../../components/Video";
import HandOverlay from "../../components/HandOverlay";

export default function SelectInstrument() {
    const [instrument, setInstrument] = useState("menu")
    const instruments = [
        {
            "name": "piano",
            "image": PIANO,
            "ref": useRef(null),
            // "state"
        },
        {
            "name": "guitar",
            "image": GUITAR,
            "ref": useRef(null)
        }
    ]
    return <>
        <Video width={document.body.clientWidth} />
        <nav id="nav">
            <title id="title">{instrument === "menu" ? "SELECT AN INSTRUMENT" : "PLAY"}</title>
        </nav>
        {instrument === "menu"
            ? <div id="instruments">
                {instruments.map((data, i) =>
                    <img ref={data.ref} className="instrument-img btn" key={i} src={data.image} alt={data.name} onClick={() => setInstrument(data.name)} />)}
            </div>
            : <div id="back-circle" className="btn">
                <img src={LEFT_ARROW} alt="back" id="back" onClick={() => setInstrument("menu")}></img>
            </div>}
        {/* <HandOverlay hoverCallback={(x, y) => {
            instruments.forEach(i => {
                const el = i.ref.current;
                if (
                    el.x <= x && x <= el.x + el.width &&
                    el.y <= y && y <= el.y + el.height
                ) setHover(true)
            })
        }} clickCallback={
            instruments.forEach(i => {
                const el = i.ref.current;
                if (
                    el.x <= x && x <= el.x + el.width &&
                    el.y <= y && y <= el.y + el.height
                ) setInstrument(i.name)
            })
        } isPlaying={ } /> */}
    </>
}
