import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import './index.css'
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <FluentProvider theme={teamsLightTheme}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </FluentProvider>
);
