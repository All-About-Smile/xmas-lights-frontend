import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { GateProvider } from "@/contexts/GateContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <GateProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </GateProvider>
    </BrowserRouter>
  </StrictMode>
);