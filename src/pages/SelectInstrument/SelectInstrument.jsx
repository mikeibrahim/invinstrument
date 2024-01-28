import React, { useState, useRef } from "react";
import PIANO from './piano.png';
import GUITAR from './guitar.png';
import LEFT_ARROW from './left-arrow.png';
import Video from "../../components/Video";
import HandOverlay from "../../components/HandOverlay";

export default function SelectInstrument() {
    const [isPlaying, setIsPlaying] = useState(false);
    const playCallback = () => setIsPlaying(true);

    const [instrument, setInstrument] = useState("menu")
    const instruments = [
        { name: "piano", image: PIANO },
        { name: "guitar", image: GUITAR }
    ]
    const btns = [
        {
            onClick: setInstrument("piano"),
            ref: useRef(null),
            hover: useState(false)
        },
        {
            onClick: setInstrument("guitar"),
            ref: useRef(null),
            hover: useState(false)
        },
        {
            onClick: setInstrument("menu"),
            ref: useRef(null),
            hover: useState(false)
        }
    ]
    return <>
        <Video width={document.body.clientWidth} playCallback={playCallback} />
        <nav id="nav">
            <title id="title">{instrument === "menu" ? "SELECT AN INSTRUMENT" : "PLAY"}</title>
        </nav>
        {instrument === "menu"
            ? <div id="instruments">
                {instruments.map((data, i) =>
                    <img ref={btns[i].ref} className={"instrument-img btn" + (btns[i].hover[0] ? " instrument-hover" : "")} key={i} src={data.image} alt={data.name} onClick={() => setInstrument(data.name)} />)}
            </div>
            : <div id="back-circle" className="btn">
                <img src={LEFT_ARROW} ref={btns[2].ref} className={btns[2].hover[0] ? "instrument-hover" : ""} alt="back" id="back" onClick={() => setInstrument("menu")}></img>
            </div>}
        <HandOverlay hoverCallback={({ x, y }) => {
            btns.forEach(b => {
                const rect = b.ref.current.getBoundingClientRect();
                console.log(b.hover);
                if (
                    rect.left <= x && x <= rect.right &&
                    rect.top <= y && y <= rect.bottom
                ) b.hover[1](true)
                else b.hover[1](false)
            })
        }} clickCallback={({ x, y }) => {
            console.log("pinch:", x, y)
            btns.forEach(b => {
                const rect = b.ref.current.getBoundingClientRect();
                // console.log("rect:", rect, rect.left, rect.right, rect.top, rect.bottom)
                if (
                    rect.left <= x && x <= rect.right &&
                    rect.top <= y && y <= rect.bottom
                ) b.onClick()
            })
        }} isPlaying={isPlaying} />
    </>
}
