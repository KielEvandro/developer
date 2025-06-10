import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';
import log from '../log.mjs';
import { buildResponse } from '../toolHelpers.mjs';

const execAsync = promisify(exec);

export default async function (server, toolName = 'exec-command') {
  server.tool(
    toolName,
    'Execute a command',
    { executable: z.string(), cwd: z.string().optional() },
    async (_args, _extra) => {
      try {
        const { stdout, stderr } = await execAsync(_args.executable, { cwd: _args.cwd });
        return buildResponse({ stdout, stderr });
      } catch (err) {
        log.error('exec-command', err);
        return buildResponse({ error: err.message, stdout: err.stdout, stderr: err.stderr });
      }
    }
  );
}
