import React from "react";
import ReactDOM from "react-dom/client";
import SelfTransferPage from "./SelfTransferPage.jsx";
import "./SelfTransferPage.css";
import mixpanel from "mixpanel-browser"; 
mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, {
  debug: true,
  track_pageview: true
});
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SelfTransferPage />
  </React.StrictMode>
);