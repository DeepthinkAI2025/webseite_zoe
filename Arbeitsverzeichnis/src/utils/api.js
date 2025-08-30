// Simple helper to resolve API base URL across envs
export const API_BASE = (() => {
  // Vite env var if provided
  const explicit = import.meta?.env?.VITE_API_BASE_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  // If running on localhost in dev, default to backend port 3001
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${protocol}//${hostname}:3001`;
    }
    // Otherwise same-origin
    return `${protocol}//${hostname}`;
  }

  // Fallback
  return '';
})();
