// GitHub Pages 배포 시 자동으로 basePath/assetPrefix 설정.
//   - User Pages (repo 이름이 `<owner>.github.io`): basePath 없음
//   - Project Pages (그 외 모든 repo): basePath = `/<repo>`
// 로컬 dev/일반 build에서는 basePath 없음.

const isStatic = process.env.BUILD_TARGET === 'static';

function deriveBasePath() {
  // GitHub Actions 빌드 시점에 자동 주입되는 GITHUB_REPOSITORY ("owner/repo")
  // 또는 사용자가 명시적으로 BASE_PATH를 지정한 경우 우선 사용.
  if (process.env.BASE_PATH !== undefined) return process.env.BASE_PATH || undefined;
  const repo = process.env.GITHUB_REPOSITORY;
  if (!repo) return undefined;
  const [owner, name] = repo.split('/');
  if (!name) return undefined;
  if (name.toLowerCase() === `${owner.toLowerCase()}.github.io`) return undefined;
  return `/${name}`;
}

const basePath = isStatic ? deriveBasePath() : undefined;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: isStatic ? 'export' : undefined,
  images: { unoptimized: true },
  trailingSlash: isStatic,
  basePath,
  assetPrefix: basePath,
  env: {
    BUILD_TARGET: process.env.BUILD_TARGET ?? '',
    NEXT_PUBLIC_BASE_PATH: basePath ?? '',
  },
};

export default nextConfig;
