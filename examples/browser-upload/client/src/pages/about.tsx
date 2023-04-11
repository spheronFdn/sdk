import React from "react";
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">gm!</h1>
        <p>
          We at Spheron are here to ship your app from your localhost to web3!
        </p>
        <a
          className="App-link"
          href="https://discord.com/invite/ahxuCtm"
          target="_blank"
          rel="noopener noreferrer"
        >
          Join our Discord
        </a>
        <div className="button-con">
          <Link to="/" className="button-53">
            Go back
          </Link>
        </div>
      </header>
    </div>
  );
}

export default About;
