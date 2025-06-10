import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';
import log from '../log.mjs';
import { buildResponse } from '../toolHelpers.mjs';
import fs from 'fs/promises';

const execAsync = promisify(exec);

export default async function (server, toolName = 'bash-script') {
  server.tool(
    toolName,
    'Run bash script on the remote Linux server',
    { script: z.string(), cwd: z.string().optional() },
    async (_args, _extra) => {
      try {
        let execOptions = {};
        if (_args.cwd) {
          // Validate cwd is a directory
          try {
            const stat = await fs.stat(_args.cwd);
            if (!stat.isDirectory()) {
              throw new Error('cwd is not a directory');
            }
          } catch (e) {
            throw new Error('Invalid Linux path for cwd: ' + _args.cwd);
          }
          execOptions.cwd = _args.cwd;
        }
        let stdout, stderr, exitCode;
        try {
          const result = await execAsync(_args.script, execOptions);
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
        log.error('bash-script', err);
        return buildResponse({ error: err.message });
      }
    }
  );
}
