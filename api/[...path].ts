import type { IncomingMessage, ServerResponse } from 'node:http';
import { app } from '../server/src/app';

export const config = {
  api: {
    bodyParser: false,
  },
  maxDuration: 30,
};

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return app(req, res);
}
