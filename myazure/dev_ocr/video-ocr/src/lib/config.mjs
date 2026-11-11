export const cfg = {
  storageConn: process.env.AzureWebJobsStorage, // Flex가 자동 설정하는 값과 동일한 이름
  visionEndpoint: process.env.VISION_ENDPOINT,
  visionKey: process.env.VISION_KEY,
  fps: Number(process.env.FRAME_FPS ?? 1),
  concurrency: Number(process.env.OCR_CONCURRENCY ?? 3),
};

// 시작 시점에 누락된 설정을 바로 알려주기 (실행 중 모호한 에러 방지)
for (const [k, v] of Object.entries({
  AzureWebJobsStorage: cfg.storageConn,
  VISION_ENDPOINT: cfg.visionEndpoint,
  VISION_KEY: cfg.visionKey,
})) {
  if (!v) throw new Error(`환경 변수 ${k} 가 설정되지 않았습니다.`);
}

export const ALLOWED_EXT = ['mp4', 'mov', 'webm'];
export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
