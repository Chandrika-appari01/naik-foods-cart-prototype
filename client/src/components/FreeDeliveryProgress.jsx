import React from "react";
import { FREE_DELIVERY_THRESHOLD } from "../services/cartMath.js";

export default function FreeDeliveryProgress({ subtotal, remaining, progressPercent, unlocked }) {
  return (
    <div className={`fd-progress${unlocked ? " fd-progress--unlocked" : ""}`}>
      {unlocked ? (
        <p className="fd-progress__message fd-progress__message--success">
          🎉 You've unlocked free delivery!
        </p>
      ) : subtotal === 0 ? (
        <p className="fd-progress__message">
          Add ₹{FREE_DELIVERY_THRESHOLD} or more to unlock free delivery.
        </p>
      ) : (
        <p className="fd-progress__message">
          <strong>₹{remaining}</strong> more to unlock free delivery
        </p>
      )}

      <div
        className="fd-progress__track"
        role="progressbar"
        aria-valuenow={Math.round(progressPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progress toward free delivery"
      >
        <div
          className="fd-progress__fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="fd-progress__scale">
        <span>₹0</span>
        <span>₹{FREE_DELIVERY_THRESHOLD}</span>
      </div>
    </div>
  );
}
