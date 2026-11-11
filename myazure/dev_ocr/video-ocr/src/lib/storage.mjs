import { BlobServiceClient } from '@azure/storage-blob';
import { cfg } from './config.mjs';

const service = BlobServiceClient.fromConnectionString(cfg.storageConn);
export const videos = service.getContainerClient('videos');
export const results = service.getContainerClient('results');

export async function saveResult(jobId, data) {
  const body = JSON.stringify(data);
  await results.getBlockBlobClient(`${jobId}.json`).upload(body, Buffer.byteLength(body), {
    blobHTTPHeaders: { blobContentType: 'application/json; charset=utf-8' },
  });
}

export async function loadResult(jobId) {
  const blob = results.getBlockBlobClient(`${jobId}.json`);
  if (!(await blob.exists())) return null;
  return JSON.parse((await blob.downloadToBuffer()).toString('utf-8'));
}
