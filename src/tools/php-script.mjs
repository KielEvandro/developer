import { z } from 'zod';
import { spawn } from 'child_process';
import log from '../log.mjs';
import { buildResponse } from '../toolHelpers.mjs';
import fs from 'fs/promises';

export default async function (server, toolName = 'php-script') {
  server.tool(
    toolName,
    'Run PHP script on the remote Linux server',
    { script: z.string(), cwd: z.string().optional() },
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
        return await new Promise((resolve) => {
          const child = spawn('php', execOptions);
          let stdout = '';
          let stderr = '';
          child.stdout.on('data', (data) => {
            stdout += data;
          });
          child.stderr.on('data', (data) => {
            stderr += data;
          });
          child.on('close', (exitCode) => {
            resolve(buildResponse({ stdout, stderr, exitCode }));
          });
          child.stdin.write(_args.script);
          child.stdin.end();
        });
      } catch (err) {
        log.error('php-script', err);
        return buildResponse({ error: err.message });
      }
    }
  );
}
