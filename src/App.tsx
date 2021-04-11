import "./App.css";

import { Canvas3D } from "./Canvas3D/";
import { fasta } from "./sequence.fa.js";

function App() {
  return (
    <div className="appContainer">
      <div className="canvasContainer">
        <Canvas3D />
      </div>
      <div className="gradient" />
      <div className="bodyContainer">
        <div className="body">
          <div className="subject typewriter-0">Subject:</div>
          <h1 className="typewriter-1">Fravic Fernando</h1>
          <div className="subject typewriter-2">Software Engineer</div>
          <div className="sample">
            <h4>DNA Sample Section</h4>
            <div className="icons">
              <a
                href="https://twitter.com/fravic"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-twitter-square"></i>
              </a>
              <a
                href="https://linkedin.com/in/fravic"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
            <p>
              Access granted
              <br />
              Loading subject 23andMe results [eye color gene]
              <br />
              Rendering in React and Three.js
              <br />
              ...
              <br />
              Done in 890ms
            </p>
          </div>
          <div className="fasta">{fasta.replace(/\n/, " ")}</div>
        </div>
      </div>
    </div>
  );
}
export default App;
