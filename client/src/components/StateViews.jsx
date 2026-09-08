import React from "react";

export function LoadingState({ label = "Loading products…" }) {
  return (
    <div className="state-view" role="status" aria-live="polite">
      <div className="state-view__spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="state-view state-view--error" role="alert">
      <p className="state-view__title">Couldn't load the catalog</p>
      <p className="state-view__body">
        {message || "The API might be offline. Check that the server is running."}
      </p>
      {onRetry && (
        <button className="btn btn--ghost" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, body }) {
  return (
    <div className="state-view">
      <p className="state-view__title">{title}</p>
      {body && <p className="state-view__body">{body}</p>}
    </div>
  );
}
