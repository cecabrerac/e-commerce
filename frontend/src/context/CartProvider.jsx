import React, { useState, useEffect } from "react";
import axios from "axios";
import { CartContext } from "./CartContext";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const USER_ID = 1; // por ahora puedes hardcodear, luego lo obtienes del login

  // cargar carrito
  useEffect(() => {
    axios
      .get(`http://localhost:3000/cart/${USER_ID}`)
      .then((res) => setCartItems(res.data))
      .catch((err) => console.error("Error cargando carrito:", err));
  }, []);

  // agregar producto
  const addToCart = async (product) => {
    try {
      await axios.post("http://localhost:3000/cart", {
        user_id: USER_ID,
        product_id: product.id,
        quantity: 1,
      });

      // después de agregar, refrescar carrito
      const updated = await axios.get(`http://localhost:3000/cart/${USER_ID}`);
      setCartItems(updated.data);
    } catch (err) {
      console.error("Error agregando producto:", err);
    }
  };

  // eliminar producto
  const removeFromCart = async (productId) => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/cart/${USER_ID}/${productId}`
      );
      setCartItems(res.data);
    } catch (err) {
      console.error("Error eliminando producto:", err);
    }
  };

  // vaciar carrito
  const clearCart = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/cart/${USER_ID}/clear`
      );
      setCartItems(res.data);
    } catch (err) {
      console.error("Error vaciando carrito:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
