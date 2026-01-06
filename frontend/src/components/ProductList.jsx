import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useCart } from "../context/useCart";

function ProductList() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  // Cargar productos desde tu backend
  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error cargando productos:", err));
  }, []);

  // Renderizar columna de acciones
  const actionBodyTemplate = (products) => {
    return (
      <Button
        icon="pi pi-shopping-cart"
        label="Agregar"
        className="p-button-sm p-button-success"
        onClick={() => addToCart(products)}
      />
    );
  };

  return (
    <div className="card">
      <h2>Productos</h2>
      <DataTable value={products} paginator rows={5} responsiveLayout="scroll">
        <Column field="name" header="Nombre" />
        <Column field="description" header="Descripción" />
        <Column field="price" header="Precio" />
        <Column field="stock" header="Stock" />
        <Column body={actionBodyTemplate} header="Acciones" />
      </DataTable>
    </div>
  );
}

export default ProductList;
