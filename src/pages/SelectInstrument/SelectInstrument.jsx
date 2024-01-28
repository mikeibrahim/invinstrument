import React, { useState } from "react";
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
            "image": PIANO
        },
        {
            "name": "guitar",
            "image": GUITAR
        }
    ]
    return <>
        <Video width={document.body.clientWidth} />
        <title id="title">{instrument === "menu" ? "SELECT AN INSTRUMENT" : "PLAY"}</title>
        {instrument === "menu"
            ? <div id="instruments">
                {instruments.map((data, i) =>
                    <img className="instrument-img btn" key={i} src={data.image} alt={data.name} onClick={() => setInstrument(data.name)} />)}
            </div>
            : <div id="back-circle" className="btn">
                <img src={LEFT_ARROW} alt="back" id="back" onClick={() => setInstrument("menu")}></img>
            </div>}
        <HandOverlay />
    </>
}
