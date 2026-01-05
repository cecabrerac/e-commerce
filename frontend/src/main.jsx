import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import "./index.css";
import App from "./App.jsx";

// PrimeReact CSS
// import "primereact/resources/themes/lara-dark-indigo/theme.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // Tema base
// import "primereact/resources/themes/saga-orange/theme.css";
// import "primereact/resources/themes/arya-purple/theme.css";
import "primereact/resources/primereact.min.css"; // Estilos de componentes
import "primeicons/primeicons.css"; // Íconos
import "primeflex/primeflex.css"; // Utilidades de grid
import "./index.css"; // Tus estilos personalizados

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
