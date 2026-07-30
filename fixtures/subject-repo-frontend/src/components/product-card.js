// Presentational. Takes everything it renders as input and fetches nothing.
export function ProductCard({ item, href }) {
  return {
    tag: 'article',
    attributes: { class: 'product-card' },
    children: [
      { tag: 'h2', children: [item.title] },
      // Navigation reference: this is what makes /orders/:orderId reachable.
      { tag: 'a', attributes: { href }, children: ['View order'] },
      { tag: 'img', attributes: { src: item.thumbnail } },
    ],
  };
}
