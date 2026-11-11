import { app } from '@azure/functions';
import { BlobSASPermissions } from '@azure/storage-blob';
import { randomUUID } from 'node:crypto';
import { videos } from '../lib/storage.mjs';
import { ALLOWED_EXT } from '../lib/config.mjs';

app.http('createJob', {
  methods: ['POST'],
  authLevel: 'anonymous', // 운영에서는 인증/Rate limit 필수
  route: 'jobs',
  handler: async (req) => {
    const ext = (req.query.get('ext') ?? 'mp4').toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) return { status: 400, jsonBody: { error: 'unsupported ext' } };

    const jobId = randomUUID();
    const blob = videos.getBlockBlobClient(`${jobId}.${ext}`);
    const uploadUrl = await blob.generateSasUrl({
      permissions: BlobSASPermissions.parse('cw'), // create + write 만 허용
      expiresOn: new Date(Date.now() + 15 * 60 * 1000),
    });
    return { jsonBody: { jobId, ext, uploadUrl } };
  },
});
