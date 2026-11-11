import { app } from '@azure/functions';
import { loadResult } from '../lib/storage.mjs';
import { UUID_RE } from '../lib/config.mjs';

app.http('getJob', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'jobs/{jobId}',
  handler: async (req) => {
    const { jobId } = req.params;
    if (!UUID_RE.test(jobId)) return { status: 400, jsonBody: { error: 'bad id' } };
    const result = await loadResult(jobId);
    return result ? { jsonBody: result } : { status: 404, jsonBody: { status: 'unknown' } };
  },
});
