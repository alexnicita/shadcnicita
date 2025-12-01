import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { ThemeColorProvider } from "@/components/shared/theme-color-provider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system">
      <ThemeColorProvider>
        <Router />
      </ThemeColorProvider>
    </ThemeProvider>
  </React.StrictMode>
);
