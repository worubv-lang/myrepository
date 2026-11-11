const norm = (s) => s.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();

function bigrams(s) {
  const m = new Map();
  for (let i = 0; i < s.length - 1; i++) {
    const g = s.slice(i, i + 2);
    m.set(g, (m.get(g) ?? 0) + 1);
  }
  return m;
}

// Dice 계수 (0~1). 1글자 오인식 정도는 같은 텍스트로 취급
export function similarity(a, b) {
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;
  const A = bigrams(a), B = bigrams(b);
  let inter = 0;
  for (const [g, c] of A) inter += Math.min(c, B.get(g) ?? 0);
  return (2 * inter) / (a.length - 1 + b.length - 1);
}

/**
 * @param frames  프레임별 OCR 결과 배열 [[{text,confidence}], ...]
 * @returns       [{ text, start, end, confidence, seen }]
 */
export function mergeFrames(frames, { fps = 1, minConf = 0.6, sim = 0.85, gapSec = 3, minSeen = 1 } = {}) {
  const entries = [];
  frames.forEach((lines, idx) => {
    const t = idx / fps;
    for (const { text, confidence } of lines) {
      if (confidence < minConf) continue;
      const n = norm(text);
      if (n.length < 2) continue;

      const hit = entries.findLast((e) => t - e.end <= gapSec && similarity(e.norm, n) >= sim);
      if (hit) {
        hit.end = t;
        hit.seen++;
        if (confidence > hit.confidence) Object.assign(hit, { text, norm: n, confidence }); // 더 신뢰도 높은 버전 채택
      } else {
        entries.push({ text, norm: n, start: t, end: t, confidence, seen: 1 });
      }
    }
  });

  return entries
    .filter((e) => e.seen >= minSeen)
    .map(({ norm, ...e }) => ({
      ...e,
      start: +e.start.toFixed(2),
      end: +(e.end + 1 / fps).toFixed(2),
      confidence: +e.confidence.toFixed(3),
    }));
}
