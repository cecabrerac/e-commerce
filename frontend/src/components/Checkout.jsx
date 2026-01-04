import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

function Checkout() {
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(null);

  const paymentOptions = [
    { label: "Tarjeta de Crédito", value: "credit" },
    { label: "Tarjeta de Débito", value: "debit" },
    { label: "PayPal", value: "paypal" },
    { label: "Contraentrega", value: "cash" },
  ];

  const handleConfirm = () => {
    console.log("Checkout confirmado:", { address, paymentMethod });
    alert("¡Pedido confirmado! 🚀");
    // Aquí podrías hacer un fetch POST a /checkout con los datos
  };

  return (
    <Card title="Checkout" className="p-mt-4">
      <div className="p-fluid">
        <div className="p-field">
          <label htmlFor="address">Dirección de envío</label>
          <InputText
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Calle 123, Ciudad"
          />
        </div>

        <div className="p-field">
          <label htmlFor="payment">Método de pago</label>
          <Dropdown
            id="payment"
            value={paymentMethod}
            options={paymentOptions}
            onChange={(e) => setPaymentMethod(e.value)}
            placeholder="Selecciona un método"
          />
        </div>

        <Button
          label="Confirmar Pedido"
          icon="pi pi-check"
          className="p-button-success p-mt-3"
          onClick={handleConfirm}
        />
      </div>
    </Card>
  );
}

export default Checkout;
