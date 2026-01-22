import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

function ProductsTable({ products, loading, onDelete }) {
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar producto?")) return;

    await fetch(`http://localhost:3000/products/${id}`, {
      method: "DELETE",
    });

    onDelete(); // recarga desde App
  };

  return (
    <DataTable value={products} loading={loading} paginator rows={5}>
      <Column field="id" header="ID" />
      <Column field="name" header="Nombre" />
      <Column field="price" header="Precio" />
      <Column field="stock" header="Stock" />
      <Column
        header="Acciones"
        body={(row) => (
          <Button
            icon="pi pi-trash"
            className="p-button-text p-button-danger"
            onClick={() => handleDelete(row.id)}
          />
        )}
      />
    </DataTable>
  );
}

export default ProductsTable;
