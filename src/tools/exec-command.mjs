import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';
import log from '../log.mjs';
import { buildResponse } from '../toolHelpers.mjs';
import fs from 'fs/promises';

const execAsync = promisify(exec);

export default async function (server, toolName = 'exec-command') {
  server.tool(
    toolName,
    'Execute a command on the remote Linux server',
    { executable: z.string(), cwd: z.string().optional() },
    async (_args, _extra) => {
      try {
        let execOptions = {};
        let cwd = _args.cwd || '/tmp';
        // Validate cwd is a directory
        try {
          const stat = await fs.stat(cwd);
          if (!stat.isDirectory()) {
            throw new Error('cwd is not a directory');
          }
        } catch (e) {
          throw new Error('Invalid Linux path for cwd: ' + cwd);
        }
        execOptions.cwd = cwd;
        // Use execAsync and manually handle exit code
        let stdout, stderr, exitCode;
        try {
          const result = await execAsync(_args.executable, execOptions);
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
        log.error('exec-command', err);
        return buildResponse({ error: err.message });
      }
    }
  );
}
