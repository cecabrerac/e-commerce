import React from "react";
import { Menubar } from "primereact/menubar";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const items = [
    {
      label: "Productos",
      icon: "pi pi-fw pi-shopping-bag",
      command: () => navigate("/products"),
    },
    {
      label: "Catálogo",
      icon: "pi pi-fw pi-th-large",
      command: () => navigate("/catalog"),
    },
    {
      label: "Carrito",
      icon: "pi pi-fw pi-shopping-cart",
      command: () => navigate("/cart"),
    },
    {
      label: "Checkout",
      icon: "pi pi-fw pi-credit-card",
      command: () => navigate("/checkout"),
    },
    {
      label: "Prueba",
      icon: "pi pi-fw pi-credit-card",
      command: () => navigate("/prueba"),
    },
  ];

  return (
    <div>
      <Menubar model={items} />
    </div>
  );
}

export default Navbar;
