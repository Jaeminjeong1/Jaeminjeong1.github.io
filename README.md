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

- `main` 브랜치 push → GitHub Actions가 정적 빌드 → Pages에 배포.
- 정적 빌드 시 `/admin/*`, `/api/*`는 빌드 트리에서 제외됨 ([scripts/build-static.mjs](scripts/build-static.mjs)).
- `prisma/data.db`는 의도적으로 git에 커밋 (글 = 콘텐츠). 글 추가 후 커밋 + push.

## 데이터 모델

- `Post (id, slug, title, content, excerpt, published, tags[])`
- `Tag (id, name, posts[])`
- `Concept`은 별도 테이블 없이 본문의 `[[xxx]]` 패턴을 빌드 타임에 동적 추출.
