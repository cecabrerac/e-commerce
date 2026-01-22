import { useEffect, useState } from "react";
import ProductForm from "./components/ProductForm";
import ProductsTable from "./components/ProductsTable";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:3000/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>E-Commerce (Learning)</h1>

      <ProductForm onProductCreated={loadProducts} />
      <ProductsTable
        products={products}
        loading={loading}
        onDelete={loadProducts}
      />
    </div>
  );
}

export default App;
