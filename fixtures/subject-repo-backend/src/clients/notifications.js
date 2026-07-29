import clients from '../../config/clients.json' with { type: 'json' };

// No timeout and no retry. A slow notification service holds the request open.
export async function notify(customerId, event) {
  const response = await fetch(`${clients.notifications.baseUrl}/send`, {
    method: 'POST',
    body: JSON.stringify({ customerId, event }),
  });
  return response.json();
}
