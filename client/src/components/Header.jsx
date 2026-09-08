import React from "react";
import { useCart } from "../context/CartContext.jsx";

export default function Header({ onCartClick }) {
  const { itemCount } = useCart();

  return (
    <header className="header">
      <div className="header__brand">
        <span className="header__mark" aria-hidden="true">◈</span>
        <div>
          <h1 className="header__title">Bazaar Basket</h1>
          <p className="header__subtitle">Free-delivery cart demo — not the Naik Foods store</p>
        </div>
      </div>

      <button
        className="header__cart-btn"
        onClick={onCartClick}
        aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
      >
        Cart
        {itemCount > 0 && <span className="header__cart-count">{itemCount}</span>}
      </button>
    </header>
  );
}
