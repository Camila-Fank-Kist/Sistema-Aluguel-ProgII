import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {/*adicionei router porque uso ele pra mudar de uma tela pra outra*/}
      <App />
    </BrowserRouter>
  </StrictMode>
);
