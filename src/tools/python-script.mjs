import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';
import log from '../log.mjs';
import { buildResponse } from '../toolHelpers.mjs';

const execAsync = promisify(exec);

export default async function (server, toolName = 'python-script') {
  server.tool(
    toolName,
    'Run Python script',
    { script: z.string(), cwd: z.string().optional() },
    async (_args, _extra) => {
      try {
        const { stdout, stderr } = await execAsync('python', { cwd: _args.cwd, input: _args.script });
        return buildResponse({ stdout, stderr });
      } catch (err) {
        log.error('python-script', err);
        return buildResponse({ error: err.message, stdout: err.stdout, stderr: err.stderr });
      }
    }
  );
}
