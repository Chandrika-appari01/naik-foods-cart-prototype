import React, { useMemo, useState } from "react";
import ProductCard from "./ProductCard.jsx";
import { EmptyState } from "./StateViews.jsx";

export default function ProductGrid({ products, onAdd }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category)));
    return ["All", ...unique];
  }, [products]);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <section aria-label="Product catalog">
      <div className="filter-row" role="tablist" aria-label="Filter by category">
        {categories.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={activeCategory === cat}
            className={`chip${activeCategory === cat ? " chip--active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No products in this category"
          body="Try a different filter."
        />
      ) : (
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} onAdd={onAdd} />
          ))}
        </div>
      )}
    </section>
  );
}
