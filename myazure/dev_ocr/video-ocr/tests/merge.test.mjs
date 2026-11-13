import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeFrames } from '../src/lib/merge.mjs';

const L = (text, confidence = 0.95) => ({ text, confidence });

test('연속 프레임의 같은 글자는 하나로 합쳐진다', () => {
  const items = mergeFrames([[L('Welcome to Seoul')], [L('Welcome to Seoul')], [L('Welcome to Seoul')]], { fps: 1 });
  assert.equal(items.length, 1);
  assert.equal(items[0].start, 0);
  assert.equal(items[0].end, 3);
  assert.equal(items[0].seen, 3);
});

test('1글자 오인식은 같은 텍스트로 합치고, 신뢰도 높은 쪽을 남긴다', () => {
  const items = mergeFrames([[L('Welcome to Seoul', 0.95)], [L('Welcome to Seou1', 0.7)]], { fps: 1 });
  assert.equal(items.length, 1);
  assert.equal(items[0].text, 'Welcome to Seoul');
});

test('신뢰도가 낮은 결과는 버린다', () => {
  assert.equal(mergeFrames([[L('noise text', 0.3)]], { fps: 1 }).length, 0);
});

test('서로 다른 글자는 따로 둔다', () => {
  const items = mergeFrames([[L('Americano 4500')], [L('Latte 5000')]], { fps: 1 });
  assert.equal(items.length, 2);
});

test('gapSec(3초) 넘게 사라졌다 다시 나오면 별개 항목이다', () => {
  const x = L('Welcome to Seoul');
  const items = mergeFrames([[x], [], [], [], [], [], [x]], { fps: 1 });
  assert.equal(items.length, 2);
});

test('minSeen: 1프레임짜리 노이즈를 제거한다', () => {
  const items = mergeFrames([[L('Stable text'), L('random junk')], [L('Stable text')]], { fps: 1, minSeen: 2 });
  assert.deepEqual(items.map((i) => i.text), ['Stable text']);
});
