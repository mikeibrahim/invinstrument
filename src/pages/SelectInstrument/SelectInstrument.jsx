import React, { useState } from "react";
import PIANO from './piano.png';
import GUITAR from './guitar.png';
import LEFT_ARROW from './left-arrow.svg';
import Video from "../../components/Video";

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
        <title id="title">{instrument === "menu" ? "SELECT AN INSTRUMENT" : "PLAY"}</title>
        {instrument === "menu"
            ? <div id="instruments">
                {instruments.map((data, i) =>
                    <img className="instrument-img btn" key={i} src={data.image} alt={data.name} onClick={() => setInstrument(data.name)} />)}
            </div>
            : <>
                <img src={LEFT_ARROW} alt="back" id="back" className="btn" onClick={() => setInstrument("menu")}></img>
            </>}
        <Video width={document.body.clientWidth} />
    </>
}
