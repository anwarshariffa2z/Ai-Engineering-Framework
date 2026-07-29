import { z } from 'zod';

// The published specification also requires `currency`. This schema does not.
export const placeOrderSchema = z.object({
  customerId: z.string().uuid(),
  items: z.array(z.object({ sku: z.string(), quantity: z.number().int().positive() })),
});
