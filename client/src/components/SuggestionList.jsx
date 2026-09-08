import React from "react";

export default function SuggestionList({ suggestions, loading, error, onAdd, remaining }) {
  if (remaining <= 0) return null;

  return (
    <div className="suggestions">
      <p className="suggestions__title">Add one of these to get closer</p>

      {loading && <p className="suggestions__hint">Finding good options…</p>}

      {!loading && error && (
        <p className="suggestions__hint suggestions__hint--error">
          Couldn't load suggestions right now.
        </p>
      )}

      {!loading && !error && suggestions.length === 0 && (
        <p className="suggestions__hint">
          No close matches in the demo catalog for this amount.
        </p>
      )}

      {!loading && !error && suggestions.length > 0 && (
        <ul className="suggestions__list">
          {suggestions.map((product) => (
            <li key={product._id} className="suggestion-item">
              <span className="suggestion-item__emoji" aria-hidden="true">
                {product.imageEmoji}
              </span>
              <div className="suggestion-item__info">
                <p className="suggestion-item__name">{product.name}</p>
                <p className="suggestion-item__price">₹{product.price}</p>
              </div>
              <button className="btn btn--small" onClick={() => onAdd(product)}>
                Add
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
