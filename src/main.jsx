import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./styles/tokens.css";

// HashRouter is used so the app works on static hosts (like GitHub Pages) that
// can't rewrite deep links back to index.html. URLs look like /#/dashboard.
// If you deploy somewhere with SPA rewrites (Firebase Hosting, Vercel, Netlify),
// you can switch this back to BrowserRouter for clean URLs.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);
