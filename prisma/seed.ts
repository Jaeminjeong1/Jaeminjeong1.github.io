import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.post.count();
  if (existing > 0) {
    console.log(`이미 ${existing}개 글이 있어 시드를 건너뜁니다.`);
    return;
  }

  await prisma.post.create({
    data: {
      slug: 'hello-world',
      title: '블로그를 시작하며',
      excerpt: '예측 가능한 시스템에 대한 생각을 기록합니다.',
      content: [
        '## 환영합니다',
        '',
        '이 블로그는 [[Predictability]]를 키워드로, 운영 환경에서 안정적으로 동작하는 시스템 설계에 대한 기록을 남기는 공간입니다.',
        '',
        '관심 키워드: [[SafeOn]], [[옵저버빌리티]], [[백엔드 안정성]].',
        '',
        '천천히, 그러나 꾸준히 채워가겠습니다.',
      ].join('\n'),
      tags: {
        connectOrCreate: [
          { where: { name: '일상' }, create: { name: '일상' } },
          { where: { name: '백엔드' }, create: { name: '백엔드' } },
        ],
      },
    },
  });

  console.log('초기 시드 완료');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
