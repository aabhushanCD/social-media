import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "./components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/react";

import { NotificationProvider } from "./features/notification/NotificationStore";
import { AuthContextProvider } from "./features/auth/authContext";

createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <NotificationProvider>
      <App />
      <Toaster richColors closeButton duration={2000}></Toaster>
      <SpeedInsights />
    </NotificationProvider>
  </AuthContextProvider>,
);
