import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useCart } from "../context/useCart";

function Cart() {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const actionTemplate = (rowData) => (
    <Button
      icon="pi pi-trash"
      className="p-button-rounded p-button-danger p-button-sm"
      onClick={() => removeFromCart(rowData.product_id)}
      tooltip="Eliminar del carrito"
      tooltipPosition="top"
    />
  );

  const priceTemplate = (rowData) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(rowData.price);
  };

  const subtotalTemplate = (rowData) => {
    const subtotal = rowData.price * rowData.quantity;
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(subtotal);
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-4">
      <h2>Carrito de Compras</h2>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Tu carrito está vacío.</p>
      ) : (
        <>
          <DataTable value={cartItems} responsiveLayout="scroll" stripedRows>
            <Column field="name" header="Producto" />
            <Column
              field="quantity"
              header="Cantidad"
              style={{ width: "120px" }}
            />
            <Column
              field="price"
              header="Precio Unitario"
              body={priceTemplate}
            />
            <Column
              header="Subtotal"
              body={subtotalTemplate}
              style={{ width: "150px" }}
            />
            <Column
              body={actionTemplate}
              style={{ width: "100px", textAlign: "center" }}
            />
          </DataTable>

          <div className="mt-4">
            <div className="text-lg font-bold mb-4">
              Total:{" "}
              {new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
              }).format(totalPrice)}
            </div>
            <Button
              label="Vaciar carrito"
              icon="pi pi-trash"
              className="p-button-warning"
              onClick={clearCart}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
