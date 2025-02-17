import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { DataProviderUser } from "./page/Context/DataContextUser";
import { DataProviderAdmin } from "./page/Context/DataContextAdmin";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DataProviderUser>
      <DataProviderAdmin>
        <App />
      </DataProviderAdmin>
    </DataProviderUser>
  </StrictMode>
);
