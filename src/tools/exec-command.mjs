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
    'Execute a command',
    { executable: z.string(), cwd: z.string().optional() },
    async (_args, _extra) => {
      try {
        let execOptions = {};
        if (_args.cwd) {
          // Check if cwd exists and is a directory
          const stat = await fs.stat(_args.cwd);
          if (!stat.isDirectory()) {
            throw new Error(`cwd '${_args.cwd}' is not a directory`);
          }
          execOptions.cwd = _args.cwd;
        }
        const { stdout, stderr } = await execAsync(_args.executable, execOptions);
        return buildResponse({ stdout, stderr });
      } catch (err) {
        log.error('exec-command', err);
        return buildResponse({ error: err.message, stdout: err.stdout, stderr: err.stderr });
      }
    }
  );
}
