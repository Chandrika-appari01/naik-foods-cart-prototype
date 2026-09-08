import React from "react";

export default function ProductCard({ product, onAdd, compact = false }) {
  return (
    <article className={`product-card${compact ? " product-card--compact" : ""}`}>
      <div className="product-card__image" aria-hidden="true">
        {product.imageEmoji}
      </div>
      <div className="product-card__body">
        <p className="product-card__category">{product.category}</p>
        <h3 className="product-card__name">{product.name}</h3>
        {!compact && <p className="product-card__tagline">{product.tagline}</p>}
        <div className="product-card__footer">
          <div>
            <span className="product-card__price">₹{product.price}</span>
            {product.weight && <span className="product-card__weight"> · {product.weight}</span>}
          </div>
          <button className="btn btn--add" onClick={() => onAdd(product)}>
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
