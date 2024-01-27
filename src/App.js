import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/Main/Main.jsx";
import SelectInstrument from "./pages/SelectInstrument/SelectInstrument.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/SelectInstrument" element={<SelectInstrument />} />
      </Routes>
    </BrowserRouter>
  );
}
