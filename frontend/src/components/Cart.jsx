import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

function Cart({ userId }) {
  const [items, setItems] = useState([]);

  // Cargar carrito desde tu backend
  useEffect(() => {
    fetch(`http://localhost:3000/cart/${userId}`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Error cargando carrito:", err));
  }, [userId]);

  // Renderizar columna de acciones
  const actionBodyTemplate = (rowData) => {
    return (
      <Button
        icon="pi pi-trash"
        label="Eliminar"
        className="p-button-sm p-button-danger"
        onClick={() => handleRemove(rowData)}
      />
    );
  };

  // Ejemplo de acción al eliminar del carrito
  const handleRemove = (item) => {
    console.log("Eliminado del carrito:", item);
    // Aquí podrías hacer un fetch DELETE a /cart/:userId/:itemId
  };

  // Plantilla para mostrar el total por producto
  const totalBodyTemplate = (rowData) => {
    return `$${rowData.price * rowData.quantity}`;
  };

  return (
    <div className="card">
      <h2>Carrito</h2>
      <DataTable value={items} paginator rows={5} responsiveLayout="scroll">
        <Column field="name" header="Producto" />
        <Column field="quantity" header="Cantidad" />
        <Column field="price" header="Precio Unitario" />
        <Column body={totalBodyTemplate} header="Total" />
        <Column body={actionBodyTemplate} header="Acciones" />
      </DataTable>
    </div>
  );
}

export default Cart;
