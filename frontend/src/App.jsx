import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import ProductCatalog from "./components/ProductCatalog";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/products" element={<ProductList />} />
          <Route path="/cart" element={<Cart userId={1} />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/catalog" element={<ProductCatalog />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
