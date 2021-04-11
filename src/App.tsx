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
          <div className="subject">Subject:</div>
          <h1>Fravic Fernando</h1>
          <div className="title">Software Engineer</div>
          <div className="sample">
            <h4>DNA Sample Section</h4>
            <p>
              Access granted &mdash; subject's 23andMe results □
              <br />
              Eye color gene segment, viz built with React and Three.JS □
              <br />□ □ □ □ □
            </p>
          </div>
          <div className="fasta">{fasta.replace(/\n/, " ")}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
