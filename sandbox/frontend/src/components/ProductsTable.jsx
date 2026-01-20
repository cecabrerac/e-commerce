import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

function ProductsTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="card">
      <h2>Productos</h2>
      <DataTable value={products} loading={loading} paginator rows={5}>
        <Column field="id" header="ID" />
        <Column field="name" header="Nombre" />
        <Column field="price" header="Precio" />
        <Column field="stock" header="Stock" />
      </DataTable>
    </div>
  );
}

export default ProductsTable;
