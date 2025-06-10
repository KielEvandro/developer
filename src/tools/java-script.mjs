import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';
import log from '../log.mjs';
import { buildResponse } from '../toolHelpers.mjs';

const execAsync = promisify(exec);

export default async function (server, toolName = 'java-script') {
  server.tool(
    toolName,
    'Run JavaScript with Node.js on the remote Linux server',
    { script: z.string(), cwd: z.string().optional() },
    async (_args, _extra) => {
      try {
        const { stdout, stderr, exitCode } = await execAsync('node', { cwd: _args.cwd, input: _args.script });
        return buildResponse({ stdout, stderr, exitCode });
      } catch (err) {
        log.error('java-script', err);
        return buildResponse({ error: err.message, stdout: err.stdout, stderr: err.stderr, exitCode: err.exitCode });
      }
    }
  );
}
