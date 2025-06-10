import { z } from 'zod';
import db from '../db.mjs';
import log from '../log.mjs';
import { buildResponse } from '../toolHelpers.mjs';

export default async function (server, toolName = 'sql-query') {
  server.tool(
    toolName,
    'Run SQL query on the remote Linux server',
    { query: z.string(), database: z.string().optional() },
    async (_args, _extra) => {
      try {
        if (_args.database) await db.query(`USE \`${_args.database}\``);
        const [rows] = await db.query(_args.query);
        return buildResponse({ rows });
      } catch (err) {
        log.error('sql-query', err);
        return buildResponse({ error: err.message });
      }
    }
  );
}
