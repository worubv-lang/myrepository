import { app } from '@azure/functions';
import { mkdtemp, mkdir, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { cfg } from '../lib/config.mjs';
import { videos, saveResult } from '../lib/storage.mjs';
import { extractFrames } from '../lib/frames.mjs';
import { readImage, mapLimit } from '../lib/ocr.mjs';
import { mergeFrames } from '../lib/merge.mjs';

app.storageQueue('processVideo', {
  queueName: 'ocr-jobs',
  //connection: 'STORAGE_CONNECTION',
  handler: async (msg, ctx) => {
    const { jobId, blobName } = typeof msg === 'string' ? JSON.parse(msg) : msg;
    const work = await mkdtemp(path.join(tmpdir(), 'ocr-'));

    try {
      // 1) 영상 다운로드
      const videoPath = path.join(work, blobName);
      await videos.getBlockBlobClient(blobName).downloadToFile(videoPath);

      // 2) 프레임 추출
      const framesDir = path.join(work, 'frames');
      await mkdir(framesDir);
      await extractFrames(videoPath, framesDir, cfg.fps);
      const files = (await readdir(framesDir)).sort();
      ctx.log(`[${jobId}] frames: ${files.length}`);

      // 3) 프레임별 OCR (동시 호출 제한)
      const perFrame = await mapLimit(files, cfg.concurrency, async (f) =>
        readImage(await readFile(path.join(framesDir, f))),
      );

      // 4) 중복 병합 후 저장
      const items = mergeFrames(perFrame, { fps: cfg.fps });
      await saveResult(jobId, {
        status: 'done',
        frameCount: files.length,
        items,
        fullText: items.map((i) => i.text).join('\n'),
      });
    } catch (err) {
      ctx.error(`[${jobId}]`, err);
      await saveResult(jobId, { status: 'failed', error: err.message });
    } finally {
      await rm(work, { recursive: true, force: true }); // 임시 파일 정리
    }
  },
});
