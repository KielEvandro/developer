import { z } from 'zod';
import { buildResponse } from '../toolHelpers.mjs';

export default async function (server, toolName = 'mcp-echo') {
  server.tool(
    toolName,
    "Echo Tool",
    { echoText: z.string() },
    async (_args, _extra) => {
      const pong = {
        message: "echo-reply",
        data: {
          text: _args.echoText
        }
      };
      return buildResponse(pong);
    }
  );
}
