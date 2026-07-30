// Renders the catalogue. Fetches through the shared client rather than calling
// the network directly, and navigates to the order view by route reference.
import { getJson } from '../api/client.js';
import { ProductCard } from './product-card.js';

export function CatalogueView({ facet }) {
  const items = getJson('/catalogue', { facet });
  return {
    tag: 'main',
    attributes: { role: 'main', 'aria-label': 'Product catalogue' },
    children: items.map((item) => ProductCard({ item, href: `/orders/${item.orderId}` })),
  };
}
