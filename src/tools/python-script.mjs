import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';
import log from '../log.mjs';
import { buildResponse } from '../toolHelpers.mjs';

const execAsync = promisify(exec);

export default async function (server, toolName = 'python-script') {
  server.tool(
    toolName,
    'Run Python script on the remote Linux server',
    { script: z.string(), cwd: z.string().optional() },
    async (_args, _extra) => {
      try {
        let execOptions = {};
        if (_args.cwd) execOptions.cwd = _args.cwd;
        let stdout, stderr, exitCode;
        try {
          const result = await execAsync('python', execOptions);
          stdout = result.stdout;
          stderr = result.stderr;
          exitCode = 0;
        } catch (err) {
          stdout = err.stdout;
          stderr = err.stderr;
          exitCode = typeof err.code === 'number' ? err.code : 1;
        }
        return buildResponse({ stdout, stderr, exitCode });
      } catch (err) {
        log.error('python-script', err);
        return buildResponse({ error: err.message });
      }
    }
  );
}
