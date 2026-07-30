// The single client-to-service boundary. Every call site in this client goes
// through here, so the target interface is declared in one place.
import { config } from '../config/public-config.js';

// No cache and no optimistic update: a failed call surfaces to the caller.
export function getJson(path, params) {
  const target = `${config.apiBaseUrl}${path}`;
  return request(target, params);
}

function request(target, params) {
  // The transport is supplied by the host page; this module declares the call
  // and does not open the connection itself.
  return globalThis.__transport.read(target, params);
}
