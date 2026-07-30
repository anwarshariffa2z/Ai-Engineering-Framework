// Explicit route registration. The router requires every route to be listed
// here; a file under src/pages is not a route until it appears below.
import { CatalogueView } from '../components/catalogue-view.js';
import { OrderView } from '../components/order-view.js';
import { AdminView } from '../components/admin-view.js';

export const routes = [
  { path: '/', component: CatalogueView, guard: null },
  { path: '/orders/:orderId', component: OrderView, guard: 'requiresSignedIn' },
  // Registered and reachable from no navigation reference in this client.
  { path: '/admin/settings', component: AdminView, guard: 'requiresStaff' },
];

// Constructed at call time from a catalogue facet. The resulting paths are not
// enumerable from source; the construction site is here.
export function facetRoute(facet) {
  return `/catalogue/${facet}`;
}
