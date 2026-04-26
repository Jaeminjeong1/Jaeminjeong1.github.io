// 정적 빌드 스크립트:
//   - 어드민/API 디렉토리를 임시 폴더(_skip)로 옮겨두고 next build 실행
//   - 끝나면 원위치로 복원 (실패해도 finally에서 복구)
//   - GitHub Pages 배포용 .nojekyll 생성

import { execSync } from 'node:child_process';
import { existsSync, renameSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const SKIP = join(ROOT, '.next-skip');
const TARGETS = [
  ['src/app/admin', '_admin'],
  ['src/app/api', '_api'],
];

function move(from, to) {
  if (existsSync(from)) renameSync(from, to);
}

mkdirSync(SKIP, { recursive: true });

const moves = TARGETS.map(([rel, name]) => ({
  src: join(ROOT, rel),
  dst: join(SKIP, name),
}));

try {
  for (const m of moves) move(m.src, m.dst);
  execSync('next build', {
    stdio: 'inherit',
    env: { ...process.env, BUILD_TARGET: 'static' },
  });
  // GitHub Pages: 폴더명에 _ 접두사가 있어도 그대로 서빙되도록
  writeFileSync(join(ROOT, 'out', '.nojekyll'), '');
  console.log('\n✓ 정적 빌드 완료 → out/');
} finally {
  for (const m of moves) move(m.dst, m.src);
}
