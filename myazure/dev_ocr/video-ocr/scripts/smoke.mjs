// 사용법: node scripts/smoke.mjs ./sample.mp4 [최대프레임수]
import { readFileSync } from 'node:fs';
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

// local.settings.json 값을 환경변수로 주입 (config.mjs 로드 전에 해야 함)
Object.assign(process.env, JSON.parse(readFileSync('local.settings.json', 'utf-8')).Values);

const { cfg } = await import('../src/lib/config.mjs');
const { extractFrames } = await import('../src/lib/frames.mjs');
const { readImage, mapLimit } = await import('../src/lib/ocr.mjs');
const { mergeFrames } = await import('../src/lib/merge.mjs');

const [video, maxArg] = process.argv.slice(2);
if (!video) { console.error('사용법: node scripts/smoke.mjs <영상> [최대프레임수]'); process.exit(1); }
const MAX = Number(maxArg ?? 30); // 비용 보호용 상한

const work = await mkdtemp(path.join(tmpdir(), 'smoke-'));
try {
  console.time('ffmpeg');
  await extractFrames(path.resolve(video), work, cfg.fps);
  console.timeEnd('ffmpeg');

  const files = (await readdir(work)).filter((f) => f.endsWith('.jpg')).sort().slice(0, MAX);
  console.log(`✅ 프레임 ${files.length}장 사용`);

  console.time('ocr');
  const perFrame = await mapLimit(files, cfg.concurrency, async (f) =>
    readImage(await readFile(path.join(work, f))),
  );
  console.timeEnd('ocr');

  perFrame.forEach((lines, i) =>
    console.log(`frame ${i}: ${lines.map((l) => `${l.text}(${l.confidence.toFixed(2)})`).join(' | ') || '(없음)'}`),
  );

  const items = mergeFrames(perFrame, { fps: cfg.fps });
  console.table(items.map(({ text, start, end, confidence, seen }) => ({ text, start, end, confidence, seen })));
} finally {
  await rm(work, { recursive: true, force: true });
}
