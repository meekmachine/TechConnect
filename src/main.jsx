import React from "react";
import ReactDOM from "react-dom/client"; // Updated import for React 18

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

// Create the root using ReactDOM.createRoot() for React 18
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();