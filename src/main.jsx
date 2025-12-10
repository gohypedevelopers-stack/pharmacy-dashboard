// src/main.jsx
// Entry file: mounts React app and wraps it with BrowserRouter.

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { RegistrationProvider } from "./lib/registrationContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <RegistrationProvider>
        <App />
      </RegistrationProvider>
    </BrowserRouter>
  </React.StrictMode>
);
