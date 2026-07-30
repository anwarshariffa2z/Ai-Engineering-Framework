// Reached only by typing the address. The guard below is a rendering decision
// and is not an authorization control; whether the endpoint enforces staff
// access is established elsewhere.
export function AdminView({ profile }) {
  if (!profile || profile.role !== 'staff') {
    return { tag: 'p', children: ['Not available.'] };
  }
  return {
    tag: 'section',
    children: [
      // No heading element, and the control below is a div with a click handler.
      { tag: 'div', attributes: { onclick: 'saveSettings()' }, children: ['Save settings'] },
    ],
  };
}
