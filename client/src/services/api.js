const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function handleResponse(res) {
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // response wasn't JSON, keep the default message
    }
    throw new Error(message);
  }
  return res.json();
}

export async function fetchProducts() {
  const res = await fetch(`${API_BASE_URL}/products`);
  const data = await handleResponse(res);
  return data.products;
}

export async function fetchSuggestions(remaining) {
  const res = await fetch(`${API_BASE_URL}/products/suggestions?remaining=${remaining}`);
  const data = await handleResponse(res);
  return data.suggestions;
}
