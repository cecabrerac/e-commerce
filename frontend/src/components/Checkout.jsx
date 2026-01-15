import React, { useState, useEffect } from "react";
import { useCart } from "../context/useCart";

function Checkout() {
  const { cartItems, clearCart } = useCart();
  const [checkoutSummary, setCheckoutSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  // Formulario de envío y pago
  const [formData, setFormData] = useState({
    shippingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    paymentMethod: "credit_card",
  });

  const userId = localStorage.getItem("userId") || 1; // Obtener userId del localStorage

  // Obtener resumen del checkout
  useEffect(() => {
    const fetchCheckoutSummary = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/checkout/${userId}/summary`
        );

        if (!response.ok) {
          throw new Error("Error al obtener el resumen del checkout");
        }

        const data = await response.json();
        setCheckoutSummary(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (cartItems.length > 0) {
      fetchCheckoutSummary();
    }
  }, [userId, cartItems.length]);

  // Validar cupón
  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage("Ingresa un código de cupón");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/checkout/validate-coupon",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            couponCode,
            totalAmount: checkoutSummary?.total || 0,
          }),
        }
      );

      const data = await response.json();

      if (data.valid) {
        setCouponDiscount(data.discountAmount);
        setCouponMessage(
          `✓ Cupón válido. Descuento: $${data.discountAmount.toFixed(2)}`
        );
      } else {
        setCouponDiscount(0);
        setCouponMessage(`✗ ${data.error}`);
      }
    } catch (err) {
      setCouponMessage("Error al validar el cupón");
      console.error("Error:", err);
    }
  };

  // Actualizar formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name === "paymentMethod") {
      setFormData({ ...formData, paymentMethod: value });
    } else {
      setFormData({
        ...formData,
        shippingAddress: {
          ...formData.shippingAddress,
          [name]: value,
        },
      });
    }
  };

  // Procesar el checkout
  const handleProcessCheckout = async (e) => {
    e.preventDefault();

    if (!formData.shippingAddress.street || !formData.shippingAddress.city) {
      setError("Por favor completa la dirección de envío");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: parseInt(userId),
          cartItems: cartItems.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
          })),
          shippingAddress: formData.shippingAddress,
          paymentMethod: formData.paymentMethod,
          discountApplied: couponDiscount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("¡Orden creada exitosamente!");
        clearCart();
        setError(null);
        // Redirigir a página de órdenes o confirmación
        // window.location.href = "/orders";
      } else {
        setError(data.error || "Error al procesar la orden");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="p-4">
        <h2>Checkout</h2>
        <p>No hay productos para comprar.</p>
      </div>
    );
  }

  if (loading && !checkoutSummary) {
    return <div className="p-4">Cargando...</div>;
  }

  const finalTotal = checkoutSummary
    ? checkoutSummary.total - couponDiscount
    : 0;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Resumen del carrito */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Resumen de Compra</h3>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between mb-2 pb-2 border-b"
              >
                <span>{item.name}</span>
                <span>
                  {item.quantity} x ${item.price} = $
                  {item.quantity * item.price}
                </span>
              </div>
            ))}
          </div>

          {checkoutSummary && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${checkoutSummary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Impuesto (8%):</span>
                <span>${checkoutSummary.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío:</span>
                <span>${checkoutSummary.shipping.toFixed(2)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Descuento:</span>
                  <span>-${couponDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Cupón de descuento */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">Código de descuento</h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ingresa tu cupón"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 px-3 py-2 border rounded"
              />
              <button
                onClick={handleValidateCoupon}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                Validar
              </button>
            </div>
            {couponMessage && (
              <p
                className="text-sm mt-2"
                style={{ color: couponMessage.includes("✓") ? "green" : "red" }}
              >
                {couponMessage}
              </p>
            )}
          </div>
        </div>

        {/* Formulario de envío y pago */}
        <div>
          <form onSubmit={handleProcessCheckout}>
            <h3 className="text-xl font-semibold mb-4">Información de Envío</h3>
            <div className="space-y-4 mb-6">
              <input
                type="text"
                name="street"
                placeholder="Calle y número"
                value={formData.shippingAddress.street}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="text"
                name="city"
                placeholder="Ciudad"
                value={formData.shippingAddress.city}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="text"
                name="state"
                placeholder="Provincia/Estado"
                value={formData.shippingAddress.state}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="text"
                name="zipCode"
                placeholder="Código postal"
                value={formData.shippingAddress.zipCode}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="text"
                name="country"
                placeholder="País"
                value={formData.shippingAddress.country}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>

            <h3 className="text-xl font-semibold mb-4">Método de Pago</h3>
            <div className="space-y-3 mb-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="credit_card"
                  checked={formData.paymentMethod === "credit_card"}
                  onChange={handleFormChange}
                  className="mr-2"
                />
                Tarjeta de Crédito
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="debit_card"
                  checked={formData.paymentMethod === "debit_card"}
                  onChange={handleFormChange}
                  className="mr-2"
                />
                Tarjeta de Débito
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={formData.paymentMethod === "bank_transfer"}
                  onChange={handleFormChange}
                  className="mr-2"
                />
                Transferencia Bancaria
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-green-600 text-black font-semibold rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? "Procesando..." : "Completar Compra"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
