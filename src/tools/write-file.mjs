import { z } from 'zod';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import log from '../log.mjs';
import { buildResponse } from '../toolHelpers.mjs';

const execAsync = promisify(exec);

export default async function (server, toolName = 'write-file') {
  server.tool(
    toolName,
    'Write file with owner, group, chmod',
    { path: z.string(), content: z.string(), owner: z.string(), group: z.string(), chmod: z.string() },
    async (_args, _extra) => {
      try {
        await fs.writeFile(_args.path, _args.content, 'utf8');
        await execAsync(`chown ${_args.owner}:${_args.group} "${_args.path}"`);
        await execAsync(`chmod ${_args.chmod} "${_args.path}"`);
        return buildResponse({ bytesWritten: Buffer.byteLength(_args.content, 'utf8') });
      } catch (err) {
        log.error('write-file', err);
        return buildResponse({ error: err.message });
      }
    }
  );
}
