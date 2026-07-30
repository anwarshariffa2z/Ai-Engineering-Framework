import * as handlers from '../handlers/index.js';

// The admin surface is registered from a table read at startup. Which handler
// serves which path is decided by a name lookup, so the pairing is not visible
// in this file.
const TABLE = [
  ['/admin/reindex', 'reindex'],
  ['/admin/purge', 'purge'],
];

export function registerAdminRoutes(app) {
  for (const [path, handlerName] of TABLE) {
    app.post(path, handlers[handlerName]);
  }
}
