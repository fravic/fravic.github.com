import React from "react";
import "./App.css";

import { Canvas3D } from "./Canvas3D/";
import { fasta } from "./sequence.fa.js";

function App() {
  return (
    <div className="appContainer">
      <div className="canvasContainer">
        <Canvas3D />
      </div>
      <div className="bodyContainer">
        <div className="body">
          <h1>Hi, I'm Fravic</h1>
          <p>
            This is a rough visualization of a section of my DNA that I built
            using React and three.js. It contains one SNP tested by 23andMe
            (highlighted) associated with my eye color. The other base pairs are
            from the human genome reference sequence. Hydrogen omitted for
            simplicity.
          </p>
          <div className="fasta">
            {fasta.split("\n").map((line) => (
              <div>{line}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
