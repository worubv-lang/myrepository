import ffmpegPath from 'ffmpeg-static';
import { spawn } from 'node:child_process';
import path from 'node:path';

// fps=1 → 1초에 1장. 가로 1920px 초과 시 축소(작은 글씨 보존을 위해 너무 줄이지 않음)
export function extractFrames(videoPath, outDir, fps) {
  return new Promise((resolve, reject) => {
    const args = [
      '-hide_banner', '-loglevel', 'error',
      '-i', videoPath,
      '-vf', `fps=${fps},scale='min(1920,iw)':-2`,
      '-q:v', '3',
      path.join(outDir, 'frame_%05d.jpg'),
    ];
    const p = spawn(ffmpegPath, args);
    let err = '';
    p.stderr.on('data', (d) => (err += d));
    p.on('error', reject);
    p.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(`ffmpeg exit ${code}: ${err}`)),
    );
  });
}
