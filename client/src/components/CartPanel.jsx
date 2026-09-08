import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import {
  FREE_DELIVERY_THRESHOLD,
  getRemaining,
  getProgressPercent,
  hasFreeDelivery,
} from "../services/cartMath.js";
import { fetchSuggestions } from "../services/api.js";
import FreeDeliveryProgress from "./FreeDeliveryProgress.jsx";
import SuggestionList from "./SuggestionList.jsx";
import { EmptyState } from "./StateViews.jsx";

export default function CartPanel({ isOpen, onClose }) {
  const { items, subtotal, addItem, increment, decrement, removeItem } = useCart();

  const remaining = getRemaining(subtotal, FREE_DELIVERY_THRESHOLD);
  const progressPercent = getProgressPercent(subtotal, FREE_DELIVERY_THRESHOLD);
  const unlocked = hasFreeDelivery(subtotal, FREE_DELIVERY_THRESHOLD);

  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState(null);

  useEffect(() => {
    if (remaining <= 0) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;
    setSuggestionsLoading(true);
    setSuggestionsError(null);

    fetchSuggestions(remaining)
      .then((data) => {
        if (!cancelled) setSuggestions(data);
      })
      .catch((err) => {
        if (!cancelled) setSuggestionsError(err.message);
      })
      .finally(() => {
        if (!cancelled) setSuggestionsLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // Re-fetch whenever the remaining amount changes (i.e. subtotal changes).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  return (
    <>
      {isOpen && <div className="cart-backdrop" onClick={onClose} />}
      <aside
        className={`cart-panel${isOpen ? " cart-panel--open" : ""}`}
        aria-label="Shopping cart"
      >
        <div className="cart-panel__header">
          <h2>Your cart</h2>
          <button className="cart-panel__close" onClick={onClose} aria-label="Close cart">
            ×
          </button>
        </div>

        <div className="cart-panel__scroll">
          {items.length === 0 ? (
            <EmptyState
              title="Your cart is empty"
              body="Add a few products from the catalog to see the free delivery progress bar in action."
            />
          ) : (
            <ul className="cart-lines">
              {items.map((item) => (
                <li key={item._id} className="cart-line">
                  <span className="cart-line__emoji" aria-hidden="true">
                    {item.imageEmoji}
                  </span>
                  <div className="cart-line__info">
                    <p className="cart-line__name">{item.name}</p>
                    <p className="cart-line__price">₹{item.price} each</p>
                  </div>
                  <div className="cart-line__qty">
                    <button
                      onClick={() => decrement(item._id)}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      −
                    </button>
                    <span>{item.qty}</span>
                    <button
                      onClick={() => increment(item._id)}
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="cart-line__remove"
                    onClick={() => removeItem(item._id)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          <FreeDeliveryProgress
            subtotal={subtotal}
            remaining={remaining}
            progressPercent={progressPercent}
            unlocked={unlocked}
          />

          <SuggestionList
            suggestions={suggestions}
            loading={suggestionsLoading}
            error={suggestionsError}
            onAdd={addItem}
            remaining={remaining}
          />
        </div>

        <div className="cart-panel__footer">
          <div className="cart-panel__subtotal">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <p className="cart-panel__note">
            Demo only — no payment or order is actually placed.
          </p>
        </div>
      </aside>
    </>
  );
}
