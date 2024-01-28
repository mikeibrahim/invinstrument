import React, { useRef, useState } from "react";
import piano from './piano.png';
import guitar from './guitar.png';

export default function SelectInstrument() {
    const [instrument, setInstrument] = useState("menu")
    return <>
        <title id="title">{instrument === "menu" ? "SELECT AN INSTRUMENT" : "PLAY"}</title>
        {instrument === "menu"
            ? <div id="instruments">
                <img src={piano} alt="piano" onClick={() => setInstrument("piano")} />
                <img src={guitar} alt="guitar" onClick={() => setInstrument("guitar")} />
            </div>
            : null}
    </>
}
