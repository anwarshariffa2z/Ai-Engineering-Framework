// Client entry point. Registers the routes and hands rendering to the router.
// There is no store, no context provider, and no persistence: every component
// receives what it renders as input.
import { routes } from './routes/routes.js';

export function start(mount) {
  return { mount, routes };
}
