import React, { useCallback, useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import ProductGrid from "./components/ProductGrid.jsx";
import CartPanel from "./components/CartPanel.jsx";
import { LoadingState, ErrorState } from "./components/StateViews.jsx";
import { fetchProducts } from "./services/api.js";
import { useCart } from "./context/CartContext.jsx";
import "./App.css";

export default function App() {
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | error | ready
  const [errorMessage, setErrorMessage] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const loadProducts = useCallback(() => {
    setStatus("loading");
    setErrorMessage(null);
    fetchProducts()
      .then((data) => {
        setProducts(data);
        setStatus("ready");
      })
      .catch((err) => {
        setErrorMessage(err.message);
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <div className="app-shell">
      <Header onCartClick={() => setIsCartOpen(true)} />

      <main className="app-main">
        <div className="app-main__catalog">
          <div className="page-intro">
            <p className="page-intro__eyebrow">Prototype for Bits and Volts</p>
            <h2>Naik Foods free-delivery threshold, made visible while you shop</h2>
            <p className="page-intro__body">
              Naik Foods advertises free delivery over ₹999, but that number
              only shows up in a banner — not while you're actually adding
              items to your cart. This demo uses its own catalog to show what
              a live progress bar and gap-filling suggestions could look like.
            </p>
          </div>

          {status === "loading" && <LoadingState />}
          {status === "error" && (
            <ErrorState message={errorMessage} onRetry={loadProducts} />
          )}
          {status === "ready" && (
            <ProductGrid products={products} onAdd={addItem} />
          )}
        </div>

        <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </main>
    </div>
  );
}
