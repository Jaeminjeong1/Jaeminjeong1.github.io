# 정재민의 블로그

Next.js + SQLite + Prisma 기반의 개인 블로그. 글 CRUD는 로컬에서, 공개 사이트는 GitHub Pages 정적 호스팅.

## 빠른 시작

```bash
# 1. 의존성 + DB 초기화
npm install
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts   # (선택) 초기 글 시드

# 2. 어드민 비밀번호 설정
cp .env.local.example .env.local
# → .env.local의 ADMIN_PASSWORD 값 변경

# 3. 개발 서버
npm run dev
# → http://localhost:3000
# → http://localhost:3000/admin 에서 로그인 후 글 작성/편집/삭제

# 4. 정적 빌드 미리보기
npm run build:static
npx serve out
```

## 구조

| 경로                | 설명                                       |
| ------------------- | ------------------------------------------ |
| `/`                 | 프로필 + 최근 글 + 태그 클라우드           |
| `/posts`            | 전체 글 목록                               |
| `/posts/[slug]`     | 글 상세 (Markdown + `[[wiki-link]]` 지원)  |
| `/tags`, `/tags/X`  | 태그 목록 / 태그별 글                      |
| `/concepts/X`       | 본문에서 `[[X]]`로 언급된 글 모음          |
| `/graph`            | 옵시디언 스타일 그래프뷰 (Me-Tag-Post-Concept) |
| `/admin`            | (로컬 전용) 글 작성/편집/삭제              |

## 배포

### 최초 1회 수동 설정 (필수)

GitHub Actions 워크플로가 코드만으로는 켤 수 없는 두 가지가 있습니다:

1. **Repo가 public** 이어야 함 — GitHub Pages는 무료 플랜에서 public repo만 호스팅합니다.
   (Pro 플랜이면 private도 가능)
2. **Pages source를 GitHub Actions로 설정** — repo 페이지에서:
   `Settings` → `Pages` → `Build and deployment` → `Source` = **GitHub Actions** 선택.

### 배포 URL

repo 이름이 `<owner>.github.io` 형식이면 **User Pages** (`https://<owner>.github.io/`),
그 외 모든 이름은 **Project Pages** (`https://<owner>.github.io/<repo>/`).

[next.config.mjs](next.config.mjs)가 `GITHUB_REPOSITORY` 환경변수에서 자동으로 감지해
필요한 경우 `basePath`를 설정하므로 별도 설정 불필요.

> 현재 repo는 `Jaeminjeong1/Jaemin.github.io`이므로 Project Pages로 배포되어
> URL은 **https://jaeminjeong1.github.io/Jaemin.github.io/** 가 됩니다.
> User Pages 형식 (`https://jaeminjeong1.github.io/`)으로 옮기려면 repo 이름을
> `Jaeminjeong1.github.io`로 바꾸면 됩니다.

### 배포 흐름

- `main` push → [.github/workflows/deploy.yml](.github/workflows/deploy.yml)이 자동 실행.
- 워크플로는 `prisma/data.db`가 커밋되어 있는지 검사하고, 없으면 명시적 에러로 실패.
- 정적 빌드 시 `/admin/*`, `/api/*`는 트리에서 제외됨 ([scripts/build-static.mjs](scripts/build-static.mjs)).
- `prisma/data.db`는 의도적으로 git에 커밋 (글 = 콘텐츠). 글 추가/수정 후:

  ```bash
  git add prisma/data.db
  git commit -m "post: 새 글 제목"
  git push
  ```

### 배포 트러블슈팅

- **404 in browser** — 위의 "최초 1회 수동 설정" 두 가지 다 했는지 확인.
- **자산 경로 깨짐 (CSS/JS 404)** — `basePath` 자동 감지가 안 된 것. Actions 로그에서
  `GITHUB_REPOSITORY` 값 확인. 수동 override는 `BASE_PATH` env로 가능.
- **Workflow가 "data.db 가 커밋되어 있지 않습니다" 로 실패** — 로컬에서
  `npm run db:seed` (또는 직접 `/admin`에서 글 작성) 후 `git add prisma/data.db && git push`.

## 데이터 모델

- `Post (id, slug, title, content, excerpt, published, tags[])`
- `Tag (id, name, posts[])`
- `Concept`은 별도 테이블 없이 본문의 `[[xxx]]` 패턴을 빌드 타임에 동적 추출.
