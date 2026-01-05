import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import "./ProductCatalog.css"; // Importa estilos personalizados

function ProductCatalog() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error cargando productos:", err));
  }, []);

  return (
    <div className="grid gap-0 justify-content-center catalog-grid">
      {products.map((product) => (
        <div key={product.id} className="col-12 md:col-4 lg:col-3 p-2">
          <Card
            title={product.name}
            subTitle={`$${product.price}`}
            className="custom-card"
            footer={
              <Button
                label="Agregar al carrito"
                icon="pi pi-shopping-cart"
                className="p-button-rounded p-button-success"
                onClick={() => console.log("Agregado:", product)}
              />
            }
          >
            <p className="product-description">{product.description}</p>
            <p className="product-stock">
              <strong>Stock:</strong> {product.stock}
            </p>
          </Card>
        </div>
      ))}
    </div>
  );
}

export default ProductCatalog;
