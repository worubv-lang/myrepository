import createClient from '@azure-rest/ai-vision-image-analysis';
import { AzureKeyCredential } from '@azure/core-auth';
import { cfg } from './config.mjs';

const client = createClient(cfg.visionEndpoint, new AzureKeyCredential(cfg.visionKey));

const avg = (a) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0);

// 이미지 1장 → [{ text, confidence }]
export async function readImage(buffer) {
  const res = await client.path('/imageanalysis:analyze').post({
    body: buffer,
    queryParameters: { features: ['Read'] },
    contentType: 'application/octet-stream',
  });
  if (res.status !== '200') {
    throw new Error(`Vision ${res.status}: ${JSON.stringify(res.body)}`);
  }
  const lines = res.body.readResult?.blocks?.flatMap((b) => b.lines) ?? [];
  return lines.map((l) => ({ text: l.text, confidence: avg(l.words.map((w) => w.confidence)) }));
}

// 동시 실행 수 제한 (무료 티어 429 방지)
export async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (true) {
        const i = next++;
        if (i >= items.length) return;
        out[i] = await fn(items[i], i);
      }
    }),
  );
  return out;
}
