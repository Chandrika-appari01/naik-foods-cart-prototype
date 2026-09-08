import React, { createContext, useContext, useMemo, useReducer } from "react";
import { getSubtotal } from "../services/cartMath.js";

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const product = action.payload;
      const existing = state.find((item) => item._id === product._id);
      if (existing) {
        return state.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...state, { ...product, qty: 1 }];
    }
    case "INCREMENT": {
      return state.map((item) =>
        item._id === action.payload ? { ...item, qty: item.qty + 1 } : item
      );
    }
    case "DECREMENT": {
      return state
        .map((item) =>
          item._id === action.payload ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0);
    }
    case "REMOVE_ITEM": {
      return state.filter((item) => item._id !== action.payload);
    }
    case "CLEAR": {
      return [];
    }
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  const subtotal = useMemo(() => getSubtotal(items), [items]);
  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items]
  );

  const value = {
    items,
    subtotal,
    itemCount,
    addItem: (product) => dispatch({ type: "ADD_ITEM", payload: product }),
    increment: (id) => dispatch({ type: "INCREMENT", payload: id }),
    decrement: (id) => dispatch({ type: "DECREMENT", payload: id }),
    removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: id }),
    clear: () => dispatch({ type: "CLEAR" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside a CartProvider");
  }
  return ctx;
}
