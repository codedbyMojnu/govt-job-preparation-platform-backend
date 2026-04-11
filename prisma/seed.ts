import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding exam categories...');

  const categories = [
    { name: 'জব সল্যুশন', slug: 'job-solution', icon: '💼', sortOrder: 1 },
    { name: 'শিক্ষক নিয়োগ ও নিবন্ধন', slug: 'teacher-recruitment', icon: '📚', sortOrder: 2 },
    { name: 'বিসিএস প্রস্তুতি', slug: 'bcs-preparation', icon: '🏛️', sortOrder: 3 },
    { name: 'ব্যাংক নিয়োগ প্রস্তুতি', slug: 'bank-recruitment', icon: '🏦', sortOrder: 4 },
  ];

  for (const cat of categories) {
    await prisma.examCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, icon: cat.icon, sortOrder: cat.sortOrder },
      create: cat,
    });
  }
  console.log(`  ✓ ${categories.length} exam categories seeded`);

  // Seed sub-exam categories
  console.log('Seeding sub-exam categories...');

  const subCategoryData: Record<string, { name: string; slug: string; sortOrder: number }[]> = {
    'job-solution': [
      {
        name: 'প্রাইমারি জব সল্যুশন - রিভিশন',
        slug: 'primary-job-solution-revision',
        sortOrder: 1,
      },
      { name: 'NTRCA জব সল্যুশন - রিভিশন', slug: 'ntrca-job-solution-revision', sortOrder: 2 },
      { name: 'জব সল্যুশন [৯ম - ১৩তম গ্রেড]', slug: 'job-solution-9th-13th-grade', sortOrder: 3 },
      {
        name: 'জব সল্যুশন [১৪তম - ২০তম গ্রেড]',
        slug: 'job-solution-14th-20th-grade',
        sortOrder: 4,
      },
    ],
    'teacher-recruitment': [
      { name: 'প্রাইমারি ফুল মডেল টেস্ট', slug: 'primary-full-model-test', sortOrder: 1 },
      {
        name: 'প্রাইমারি শিক্ষক নিয়োগ প্রস্তুতি [লং কোর্স]',
        slug: 'primary-teacher-long-course',
        sortOrder: 2,
      },
      { name: 'NTRCA প্রিলিমিনারি প্রস্তুতি', slug: 'ntrca-preliminary-preparation', sortOrder: 3 },
      { name: 'NTRCA লিখিত প্রস্তুতি', slug: 'ntrca-written-preparation', sortOrder: 4 },
    ],
    'bcs-preparation': [
      { name: 'বিসিএস প্রিলিমিনারি মডেল টেস্ট', slug: 'bcs-preliminary-model-test', sortOrder: 1 },
      { name: 'বিসিএস বিষয়ভিত্তিক প্র্যাক্টিস', slug: 'bcs-subject-wise-practice', sortOrder: 2 },
      { name: 'বিসিএস পূর্ববর্তী বছরের প্রশ্ন', slug: 'bcs-previous-year-questions', sortOrder: 3 },
    ],
    'bank-recruitment': [
      { name: 'ব্যাংক প্রিলিমিনারি প্রস্তুতি', slug: 'bank-preliminary-preparation', sortOrder: 1 },
      { name: 'ব্যাংক লিখিত প্রস্তুতি', slug: 'bank-written-preparation', sortOrder: 2 },
      { name: 'বাংলাদেশ ব্যাংক প্রস্তুতি', slug: 'bangladesh-bank-preparation', sortOrder: 3 },
    ],
  };

  for (const [categorySlug, subs] of Object.entries(subCategoryData)) {
    const category = await prisma.examCategory.findUnique({
      where: { slug: categorySlug },
      select: { id: true },
    });
    if (!category) continue;

    for (const sub of subs) {
      await prisma.subExamCategory.upsert({
        where: { slug: sub.slug },
        update: { name: sub.name, sortOrder: sub.sortOrder },
        create: {
          examCategoryId: category.id,
          name: sub.name,
          slug: sub.slug,
          sortOrder: sub.sortOrder,
        },
      });
    }
  }

  const totalSubs = Object.values(subCategoryData).reduce((sum, arr) => sum + arr.length, 0);
  console.log(`  ✓ ${totalSubs} sub-exam categories seeded`);

  // Seed admin user
  console.log('Seeding admin user...');
  const adminMobile = '01700000000';
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { mobile: adminMobile },
    update: { role: 'ADMIN' },
    create: {
      mobile: adminMobile,
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  });
  console.log('  ✓ Admin user seeded (mobile: 01700000000, password: admin123)');

  // Seed regular member user
  console.log('Seeding member user...');
  const memberMobile = '01700000001';
  const memberPassword = await bcrypt.hash('user123', 10);

  await prisma.user.upsert({
    where: { mobile: memberMobile },
    update: {},
    create: {
      mobile: memberMobile,
      password: memberPassword,
      name: 'Test User',
      role: 'USER',
    },
  });
  console.log('  ✓ Member user seeded (mobile: 01700000001, password: user123)');

  // Seed sample notifications
  console.log('Seeding notifications...');
  await prisma.notification.createMany({
    data: [
      {
        title: 'প্ল্যাটফর্মে স্বাগতম! 🎉',
        content: 'MCQ প্ল্যাটফর্মে আপনাকে স্বাগতম। পরীক্ষা দিতে শুরু করুন।',
        type: 'PUBLIC',
      },
      {
        title: 'নতুন প্রশ্নসেট যোগ হয়েছে',
        content: 'প্রাইমারি শিক্ষক নিয়োগ পরীক্ষার নতুন মডেল টেস্ট যোগ হয়েছে।',
        type: 'PUBLIC',
      },
      {
        title: 'আপডেট: বিসিএস প্রস্তুতি কোর্স',
        content: '৪৬তম বিসিএস প্রস্তুতির জন্য নতুন প্রশ্ন ব্যাংক আপলোড করা হয়েছে।',
        type: 'PUBLIC',
      },
    ],
    skipDuplicates: true,
  });
  console.log('  ✓ Sample notifications seeded');

  // Seed sample routines
  console.log('Seeding routines...');
  const primarySub = await prisma.subExamCategory.findUnique({
    where: { slug: 'primary-job-solution-revision' },
  });
  const ntrcaSub = await prisma.subExamCategory.findUnique({
    where: { slug: 'ntrca-job-solution-revision' },
  });

  if (primarySub) {
    await prisma.routine.createMany({
      data: [
        {
          subExamCategoryId: primarySub.id,
          date: new Date('2026-04-10'),
          title: 'প্রাইমারি জব সল্যুশন - সাপ্তাহিক পরীক্ষা ০১',
          totalMarks: 50,
          duration: 30,
          subject: 'বাংলা',
          topics: 'ব্যাকরণ, সাহিত্য, রচনা',
          sourceMaterial: 'NCTB বোর্ড বই',
          description: 'প্রাইমারি শিক্ষক নিয়োগ পরীক্ষার বাংলা বিষয়ের সাপ্তাহিক মডেল টেস্ট।',
        },
        {
          subExamCategoryId: primarySub.id,
          date: new Date('2026-04-17'),
          title: 'প্রাইমারি জব সল্যুশন - সাপ্তাহিক পরীক্ষা ০২',
          totalMarks: 50,
          duration: 30,
          subject: 'ইংরেজি',
          topics: 'Grammar, Vocabulary, Comprehension',
          sourceMaterial: 'NCTB বোর্ড বই',
          description: 'প্রাইমারি শিক্ষক নিয়োগ পরীক্ষার ইংরেজি বিষয়ের সাপ্তাহিক মডেল টেস্ট।',
        },
        {
          subExamCategoryId: primarySub.id,
          date: new Date('2026-04-24'),
          title: 'প্রাইমারি জব সল্যুশন - সাপ্তাহিক পরীক্ষা ০৩',
          totalMarks: 100,
          duration: 60,
          subject: 'সাধারণ জ্ঞান',
          topics: 'বাংলাদেশ বিষয়াবলী, আন্তর্জাতিক বিষয়াবলী',
          sourceMaterial: 'সাম্প্রতিক বই',
        },
      ],
      skipDuplicates: true,
    });
  }

  if (ntrcaSub) {
    await prisma.routine.createMany({
      data: [
        {
          subExamCategoryId: ntrcaSub.id,
          date: new Date('2026-04-12'),
          title: 'NTRCA প্রিলিমিনারি - মডেল টেস্ট ০১',
          totalMarks: 100,
          duration: 60,
          subject: 'সাধারণ জ্ঞান ও বাংলা',
          topics: 'বাংলা ব্যাকরণ, বাংলাদেশ ও আন্তর্জাতিক বিষয়াবলী',
          sourceMaterial: 'NCTB বোর্ড বই',
        },
      ],
      skipDuplicates: true,
    });
  }
  console.log('  ✓ Sample routines seeded');

  // Seed sample syllabuses
  console.log('Seeding syllabuses...');
  if (primarySub) {
    await prisma.syllabus.createMany({
      data: [
        {
          subExamCategoryId: primarySub.id,
          title: 'প্রাইমারি শিক্ষক নিয়োগ সিলেবাস',
          slug: 'primary-shikkok-niyog',
          sortOrder: 1,
          content: `# প্রাইমারি শিক্ষক নিয়োগ পরীক্ষার সিলেবাস

## বাংলা (২০ নম্বর)
- বাংলা সাহিত্য
- বাংলা ব্যাকরণ
  - সন্ধি বিচ্ছেদ
  - সমাস
  - প্রত্যয়
  - বিপরীত শব্দ
  - সমার্থক শব্দ
  - এককথায় প্রকাশ
  - বাগধারা ও প্রবাদ

## ইংরেজি (২০ নম্বর)
- **Parts of Speech**
- **Tense**
- **Voice & Narration**
- **Preposition**
- **Spelling & Vocabulary**
- Idioms and Phrases
- Sentence Correction

## গণিত (২০ নম্বর)
1. পাটিগণিত (ভগ্নাংশ, দশমিক, শতকরা, লাভ-ক্ষতি, সুদকষা)
2. বীজগণিত (সূত্রাবলী, সমীকরণ)
3. জ্যামিতি (ত্রিভুজ, চতুর্ভুজ, বৃত্ত, ক্ষেত্রফল)

## সাধারণ জ্ঞান (২০ নম্বর)
- বাংলাদেশ বিষয়াবলী
- আন্তর্জাতিক বিষয়াবলী
- সাম্প্রতিক ঘটনাবলী
- বিজ্ঞান ও প্রযুক্তি

> **মোট নম্বর:** ৮০ | **সময়:** ১ ঘণ্টা ২০ মিনিট

---

### প্রস্তুতির জন্য সহায়ক বই
- NCTB বোর্ড বই (প্রথম থেকে পঞ্চম শ্রেণি)
- প্রাইমারি শিক্ষক নিয়োগ গাইড

https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
        },
        {
          subExamCategoryId: primarySub.id,
          title: 'প্রাইমারি পরীক্ষা প্রস্তুতি গাইড',
          slug: 'primary-preparation-guide',
          sortOrder: 2,
          content: `# প্রাইমারি পরীক্ষা প্রস্তুতি গাইড

## পরীক্ষার ধরন
প্রাইমারি শিক্ষক নিয়োগ পরীক্ষা MCQ পদ্ধতিতে অনুষ্ঠিত হয়।

## প্রস্তুতির পরামর্শ
- প্রতিদিন নিয়মিত পড়ুন
- পূর্ববর্তী বছরের প্রশ্ন সমাধান করুন
- মডেল টেস্ট দিন`,
        },
      ],
      skipDuplicates: true,
    });
  }

  if (ntrcaSub) {
    await prisma.syllabus.createMany({
      data: [
        {
          subExamCategoryId: ntrcaSub.id,
          title: 'NTRCA প্রিলিমিনারি সিলেবাস',
          slug: 'ntrca-preliminary-syllabus',
          sortOrder: 1,
          content: `# NTRCA প্রিলিমিনারি পরীক্ষার সিলেবাস

## বাংলা (২৫ নম্বর)
- বাংলা সাহিত্য ও ব্যাকরণ

## ইংরেজি (২৫ নম্বর)
- English Grammar and Comprehension

## গণিত (২৫ নম্বর)
- পাটিগণিত, বীজগণিত, জ্যামিতি

## সাধারণ জ্ঞান (২৫ নম্বর)
- বাংলাদেশ ও আন্তর্জাতিক বিষয়াবলী`,
        },
      ],
      skipDuplicates: true,
    });
  }
  console.log('  ✓ Sample syllabuses seeded');

  // Seed sample question sets with questions
  console.log('Seeding question sets...');
  if (primarySub) {
    const liveSet = await prisma.questionSet.upsert({
      where: { id: 'qs-primary-live-01' },
      update: {},
      create: {
        id: 'qs-primary-live-01',
        subExamCategoryId: primarySub.id,
        title: 'প্রাইমারি জব সল্যুশন - লাইভ মডেল টেস্ট ০১',
        date: new Date('2026-05-01'),
        totalMarks: 80,
        duration: 60,
        subject: 'সকল বিষয়',
        topics: 'বাংলা, ইংরেজি, গণিত, সাধারণ জ্ঞান',
        sourceMaterial: 'NCTB বোর্ড বই',
        markPerQuestion: 1,
        negativeMark: 0.25,
        isLive: true,
      },
    });

    // Add questions for live set
    await prisma.question.createMany({
      data: [
        {
          questionSetId: liveSet.id,
          questionText: '"সন্ধি" শব্দের অর্থ কী?',
          optionA: 'বিচ্ছেদ',
          optionB: 'মিলন',
          optionC: 'বিভাজন',
          optionD: 'সমন্বয়',
          correctAnswer: 'B',
          explanation: 'সন্ধি শব্দের অর্থ মিলন। দুটি ধ্বনির মিলনকে সন্ধি বলে।',
          subject: 'বাংলা',
          sortOrder: 1,
        },
        {
          questionSetId: liveSet.id,
          questionText: '"কাক চেষ্টা" বাগধারার অর্থ কী?',
          optionA: 'কঠোর পরিশ্রম',
          optionB: 'অসম্ভব চেষ্টা',
          optionC: 'বৃথা চেষ্টা',
          optionD: 'অল্প চেষ্টা',
          correctAnswer: 'A',
          explanation: 'কাক চেষ্টা অর্থ কঠোর পরিশ্রম বা নিরলস চেষ্টা।',
          subject: 'বাংলা',
          sortOrder: 2,
        },
        {
          questionSetId: liveSet.id,
          questionText: 'Choose the correct spelling:',
          optionA: 'Accomodation',
          optionB: 'Accommodation',
          optionC: 'Acomodation',
          optionD: 'Acommodation',
          correctAnswer: 'B',
          explanation: 'The correct spelling is "Accommodation" with double c and double m.',
          subject: 'ইংরেজি',
          sortOrder: 3,
        },
        {
          questionSetId: liveSet.id,
          questionText: 'He ___ to school every day.',
          optionA: 'go',
          optionB: 'goes',
          optionC: 'going',
          optionD: 'gone',
          correctAnswer: 'B',
          explanation: 'Third person singular (He) takes "goes" in present simple tense.',
          subject: 'ইংরেজি',
          sortOrder: 4,
        },
        {
          questionSetId: liveSet.id,
          questionText: '১৫ এর ৪০% কত?',
          optionA: '৪',
          optionB: '৫',
          optionC: '৬',
          optionD: '৭',
          correctAnswer: 'C',
          explanation: '১৫ × ৪০/১০০ = ৬',
          subject: 'গণিত',
          sortOrder: 5,
        },
        {
          questionSetId: liveSet.id,
          questionText: 'একটি ত্রিভুজের তিন কোণের সমষ্টি কত?',
          optionA: '৯০°',
          optionB: '১৮০°',
          optionC: '২৭০°',
          optionD: '৩৬০°',
          correctAnswer: 'B',
          explanation: 'যেকোনো ত্রিভুজের তিন কোণের সমষ্টি সর্বদা ১৮০°।',
          subject: 'গণিত',
          sortOrder: 6,
        },
        {
          questionSetId: liveSet.id,
          questionText: 'বাংলাদেশের স্বাধীনতা দিবস কত তারিখে?',
          optionA: '১৬ ডিসেম্বর',
          optionB: '২৬ মার্চ',
          optionC: '২১ ফেব্রুয়ারি',
          optionD: '১৭ মার্চ',
          correctAnswer: 'B',
          explanation: '১৯৭১ সালের ২৬ মার্চ বাংলাদেশের স্বাধীনতা ঘোষণা করা হয়।',
          subject: 'সাধারণ জ্ঞান',
          sortOrder: 7,
        },
        {
          questionSetId: liveSet.id,
          questionText: 'বাংলাদেশের জাতীয় ফুল কোনটি?',
          optionA: 'গোলাপ',
          optionB: 'শাপলা',
          optionC: 'বেলি',
          optionD: 'জুঁই',
          correctAnswer: 'B',
          explanation: 'বাংলাদেশের জাতীয় ফুল শাপলা (Nymphaea nouchali)।',
          subject: 'সাধারণ জ্ঞান',
          sortOrder: 8,
        },
      ],
      skipDuplicates: true,
    });

    // Archive sets
    await prisma.questionSet.createMany({
      data: [
        {
          id: 'qs-primary-archive-01',
          subExamCategoryId: primarySub.id,
          title: 'প্রাইমারি জব সল্যুশন - মডেল টেস্ট ০১ (আর্কাইভ)',
          date: new Date('2026-03-15'),
          totalMarks: 80,
          duration: 60,
          subject: 'সকল বিষয়',
          topics: 'বাংলা, ইংরেজি, গণিত',
          markPerQuestion: 1,
          negativeMark: 0.25,
          isLive: false,
        },
        {
          id: 'qs-primary-archive-02',
          subExamCategoryId: primarySub.id,
          title: 'প্রাইমারি জব সল্যুশন - মডেল টেস্ট ০২ (আর্কাইভ)',
          date: new Date('2026-03-22'),
          totalMarks: 100,
          duration: 60,
          subject: 'সকল বিষয়',
          topics: 'বাংলা, ইংরেজি, গণিত, সাধারণ জ্ঞান',
          markPerQuestion: 1,
          negativeMark: 0.25,
          isLive: false,
        },
        {
          id: 'qs-primary-archive-03',
          subExamCategoryId: primarySub.id,
          title: 'প্রাইমারি জব সল্যুশন - মডেল টেস্ট ০৩ (আর্কাইভ)',
          date: new Date('2026-04-01'),
          totalMarks: 80,
          duration: 45,
          subject: 'বাংলা ও ইংরেজি',
          markPerQuestion: 1,
          negativeMark: 0.25,
          isLive: false,
        },
      ],
      skipDuplicates: true,
    });

    // Add questions for archive set 01
    await prisma.question.createMany({
      data: [
        {
          questionSetId: 'qs-primary-archive-01',
          questionText: '"অমিত্রাক্ষর ছন্দ" কে প্রবর্তন করেন?',
          optionA: 'রবীন্দ্রনাথ ঠাকুর',
          optionB: 'মাইকেল মধুসূদন দত্ত',
          optionC: 'কাজী নজরুল ইসলাম',
          optionD: 'জসীমউদ্দীন',
          correctAnswer: 'B',
          explanation: 'মাইকেল মধুসূদন দত্ত বাংলা সাহিত্যে অমিত্রাক্ষর ছন্দের প্রবর্তক।',
          subject: 'বাংলা',
          sortOrder: 1,
        },
        {
          questionSetId: 'qs-primary-archive-01',
          questionText: '"পথের পাঁচালী" কার রচনা?',
          optionA: 'শরৎচন্দ্র চট্টোপাধ্যায়',
          optionB: 'বিভূতিভূষণ বন্দ্যোপাধ্যায়',
          optionC: 'বঙ্কিমচন্দ্র চট্টোপাধ্যায়',
          optionD: 'মানিক বন্দ্যোপাধ্যায়',
          correctAnswer: 'B',
          explanation: '"পথের পাঁচালী" বিভূতিভূষণ বন্দ্যোপাধ্যায়ের বিখ্যাত উপন্যাস।',
          subject: 'বাংলা',
          sortOrder: 2,
        },
        {
          questionSetId: 'qs-primary-archive-01',
          questionText: 'The synonym of "Abundant" is:',
          optionA: 'Scarce',
          optionB: 'Plentiful',
          optionC: 'Rare',
          optionD: 'Limited',
          correctAnswer: 'B',
          explanation: 'Abundant means plentiful or existing in large quantities.',
          subject: 'ইংরেজি',
          sortOrder: 3,
        },
        {
          questionSetId: 'qs-primary-archive-01',
          questionText: 'Which is correct?',
          optionA: 'He do not like it',
          optionB: 'He does not likes it',
          optionC: 'He does not like it',
          optionD: 'He not like it',
          correctAnswer: 'C',
          explanation: 'With third person singular, we use "does not" + base form of verb.',
          subject: 'ইংরেজি',
          sortOrder: 4,
        },
        {
          questionSetId: 'qs-primary-archive-01',
          questionText: '৩, ৫, ৭, ১১, ১৩ — এগুলো কী ধরনের সংখ্যা?',
          optionA: 'জোড় সংখ্যা',
          optionB: 'মৌলিক সংখ্যা',
          optionC: 'যৌগিক সংখ্যা',
          optionD: 'পূর্ণ সংখ্যা',
          correctAnswer: 'B',
          explanation:
            'যে সংখ্যা ১ এবং সেই সংখ্যা ছাড়া অন্য কোনো সংখ্যা দ্বারা নিঃশেষে বিভাজ্য নয়, তাকে মৌলিক সংখ্যা বলে।',
          subject: 'গণিত',
          sortOrder: 5,
        },
        {
          questionSetId: 'qs-primary-archive-01',
          questionText: 'একটি বৃত্তের ব্যাস ১৪ সেমি হলে, পরিধি কত?',
          optionA: '৪৪ সেমি',
          optionB: '২২ সেমি',
          optionC: '৩৩ সেমি',
          optionD: '৫৫ সেমি',
          correctAnswer: 'A',
          explanation: 'পরিধি = πd = ২২/৭ × ১৪ = ৪৪ সেমি',
          subject: 'গণিত',
          sortOrder: 6,
        },
      ],
      skipDuplicates: true,
    });

    // Add questions for archive set 02
    await prisma.question.createMany({
      data: [
        {
          questionSetId: 'qs-primary-archive-02',
          questionText: '"চর্যাপদ" কোন যুগের নিদর্শন?',
          optionA: 'মধ্যযুগ',
          optionB: 'আধুনিক যুগ',
          optionC: 'প্রাচীন যুগ',
          optionD: 'উত্তর-আধুনিক যুগ',
          correctAnswer: 'C',
          explanation: 'চর্যাপদ বাংলা সাহিত্যের প্রাচীন যুগের নিদর্শন।',
          subject: 'বাংলা',
          sortOrder: 1,
        },
        {
          questionSetId: 'qs-primary-archive-02',
          questionText: '"To cry over spilt milk" means:',
          optionA: 'To be angry',
          optionB: 'To cry loudly',
          optionC: 'To regret uselessly',
          optionD: 'To waste milk',
          correctAnswer: 'C',
          explanation: '"To cry over spilt milk" means to regret something that cannot be undone.',
          subject: 'ইংরেজি',
          sortOrder: 2,
        },
        {
          questionSetId: 'qs-primary-archive-02',
          questionText: '২x + ৩ = ১১ হলে x = ?',
          optionA: '৩',
          optionB: '৪',
          optionC: '৫',
          optionD: '৬',
          correctAnswer: 'B',
          explanation: '২x = ১১ - ৩ = ৮, তাই x = ৪',
          subject: 'গণিত',
          sortOrder: 3,
        },
        {
          questionSetId: 'qs-primary-archive-02',
          questionText: 'বাংলাদেশের প্রথম রাষ্ট্রপতি কে?',
          optionA: 'তাজউদ্দীন আহমদ',
          optionB: 'সৈয়দ নজরুল ইসলাম',
          optionC: 'বঙ্গবন্ধু শেখ মুজিবুর রহমান',
          optionD: 'জিয়াউর রহমান',
          correctAnswer: 'C',
          explanation: 'বঙ্গবন্ধু শেখ মুজিবুর রহমান বাংলাদেশের প্রথম রাষ্ট্রপতি ছিলেন।',
          subject: 'সাধারণ জ্ঞান',
          sortOrder: 4,
        },
        {
          questionSetId: 'qs-primary-archive-02',
          questionText: '"নদী" শব্দের সমার্থক শব্দ কোনটি?',
          optionA: 'সাগর',
          optionB: 'তটিনী',
          optionC: 'সমুদ্র',
          optionD: 'হ্রদ',
          correctAnswer: 'B',
          explanation: '"তটিনী" নদীর সমার্থক শব্দ।',
          subject: 'বাংলা',
          sortOrder: 5,
        },
      ],
      skipDuplicates: true,
    });
  }

  if (ntrcaSub) {
    await prisma.questionSet.createMany({
      data: [
        {
          id: 'qs-ntrca-live-01',
          subExamCategoryId: ntrcaSub.id,
          title: 'NTRCA প্রিলিমিনারি - লাইভ মডেল টেস্ট',
          date: new Date('2026-05-05'),
          totalMarks: 100,
          duration: 60,
          subject: 'সকল বিষয়',
          markPerQuestion: 1,
          negativeMark: 0.25,
          isLive: true,
        },
        {
          id: 'qs-ntrca-archive-01',
          subExamCategoryId: ntrcaSub.id,
          title: 'NTRCA - আর্কাইভ মডেল টেস্ট ০১',
          date: new Date('2026-03-10'),
          totalMarks: 100,
          duration: 60,
          subject: 'সকল বিষয়',
          markPerQuestion: 1,
          negativeMark: 0.25,
          isLive: false,
        },
      ],
      skipDuplicates: true,
    });
  }
  console.log('  ✓ Sample question sets and questions seeded');

  console.log('Seeding complete!');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
