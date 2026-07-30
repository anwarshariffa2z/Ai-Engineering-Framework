import clients from '../../config/clients.json' with { type: 'json' };

export async function charge(orderId, amount) {
  const response = await fetch(`${clients.payments.baseUrl}/charges`, {
    method: 'POST',
    body: JSON.stringify({ orderId, amount }),
    signal: AbortSignal.timeout(clients.payments.timeoutMs),
  });
  return response.json();
}
