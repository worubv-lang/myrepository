import { app, output } from '@azure/functions';
import { videos, saveResult } from '../lib/storage.mjs';
import { ALLOWED_EXT, UUID_RE } from '../lib/config.mjs';

//const queueOut = output.storageQueue({ queueName: 'ocr-jobs', connection: 'STORAGE_CONNECTION' });
const queueOut = output.storageQueue({ queueName: 'ocr-jobs'})

app.http('startJob', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'jobs/{jobId}/start',
  extraOutputs: [queueOut],
  handler: async (req, ctx) => {
    const { jobId } = req.params;
    const ext = (req.query.get('ext') ?? 'mp4').toLowerCase();
    if (!UUID_RE.test(jobId) || !ALLOWED_EXT.includes(ext)) {
      return { status: 400, jsonBody: { error: 'bad request' } };
    }

    const blobName = `${jobId}.${ext}`;
    if (!(await videos.getBlockBlobClient(blobName).exists())) {
      return { status: 404, jsonBody: { error: 'video not uploaded' } };
    }

    await saveResult(jobId, { status: 'processing' });
    ctx.extraOutputs.set(queueOut, { jobId, blobName });
    return { status: 202, jsonBody: { jobId, status: 'processing' } };
  },
});
