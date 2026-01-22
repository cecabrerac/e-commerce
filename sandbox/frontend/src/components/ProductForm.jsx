import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";

function ProductForm({ onProductCreated }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(null);
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await fetch("http://localhost:3000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, stock }),
    });

    setName("");
    setPrice(null);
    setStock(null);
    setLoading(false);

    onProductCreated(); // refresca la tabla
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <h3>Nuevo producto</h3>

      <div className="p-fluid grid">
        <div className="field col-12 md:col-4">
          <label>Nombre</label>
          <InputText
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="field col-12 md:col-4">
          <label>Precio</label>
          <InputNumber
            value={price}
            onValueChange={(e) => setPrice(e.value)}
            mode="currency"
            currency="USD"
          />
        </div>

        <div className="field col-12 md:col-4">
          <label>Stock</label>
          <InputNumber
            value={stock}
            onValueChange={(e) => setStock(e.value)}
            min={0}
          />
        </div>
      </div>

      <Button label="Crear" icon="pi pi-plus" loading={loading} />
    </form>
  );
}

export default ProductForm;
