import express from 'express';
import config from '../config/default.json' with { type: 'json' };
import { authenticate } from './middleware/authenticate.js';
import { requireTenantScope } from './middleware/authorize.js';
import { registerOrderRoutes } from './routes/orders.js';
import { registerAdminRoutes } from './routes/admin.js';
import { errorHandler } from './errors/handler.js';

const app = express();

app.use(express.json());
app.use(authenticate);
app.use(requireTenantScope);

registerOrderRoutes(app);
if (config.adminRoutesEnabled === 'true') {
  registerAdminRoutes(app);
}

app.use(errorHandler);

app.listen(config.port);
