import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import ProductCatalog from "./components/ProductCatalog";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import { CartProvider } from "./context/CartProvider";

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/products" element={<ProductList />} />
            <Route path="/catalog" element={<ProductCatalog />} />
            <Route path="/cart" element={<Cart userId={1} />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
