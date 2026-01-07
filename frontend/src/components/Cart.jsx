import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useCart } from "../context/useCart";

function Cart() {
  const { cartItems, removeFromCart, clearCart } = useCart();

  return (
    <div className="p-4">
      <h2>Carrito</h2>
      {cartItems.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.name} - Cantidad: {item.quantity}
                <Button
                  label="Eliminar"
                  className="p-button-danger p-button-sm ml-2"
                  onClick={() => removeFromCart(item.product_id)}
                />
              </li>
            ))}
          </ul>
          <Button
            label="Vaciar carrito"
            className="p-button-warning mt-3"
            onClick={clearCart}
          />
        </>
      )}
    </div>
  );
}

export default Cart;
