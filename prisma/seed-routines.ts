import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const subExamCategoryId = 'cmnv745290005uxikq56hsyxc';

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const startDate = new Date('2026-06-15');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BCS প্রিলিমিনারি পরীক্ষার মানবণ্টন ইতিহাস:
//   ১০ম – ৩৪তম বিসিএস  → ১০০ নম্বর | ১ ঘণ্টা (৬০ মিনিট)
//   ৩৫তম – ৫০তম বিসিএস → ২০০ নম্বর | ২ ঘণ্টা (১২০ মিনিট)
//
// Source: BCS Examination Rules-2014 (Daily Star, Dhaka Tribune, BPSC)
//   "MCQ marks doubled under new BCS exam rules"
//   "the hour-long 100-mark test... duration from one hour to two"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface BcsConfig {
  totalMarks: number;
  duration: number; // minutes
  era: string;
}

function getBcsConfig(bcsNumber: number): BcsConfig {
  if (bcsNumber <= 34) {
    return {
      totalMarks: 100,
      duration: 60,
      era: '১০০ নম্বর (পুরনো নিয়ম)',
    };
  } else {
    return {
      totalMarks: 200,
      duration: 120,
      era: '২০০ নম্বর (বিসিএস বিধিমালা-২০১৪)',
    };
  }
}

function getDescription(bcsNumber: number): string {
  const config = getBcsConfig(bcsNumber);

  if (bcsNumber <= 20) {
    return `${bcsNumber}তম বিসিএস প্রিলিমিনারি প্রশ্নপত্র অনুশীলন করুন। পুরনো নিয়মে এটি ছিল ${config.totalMarks} নম্বরের ${config.duration} মিনিটের পরীক্ষা। প্রাথমিক পর্যায়ের এই প্রশ্নগুলো বিষয়ভিত্তিক বেসিক ধারণা যাচাইয়ের জন্য অত্যন্ত কার্যকর।`;
  } else if (bcsNumber <= 34) {
    return `${bcsNumber}তম বিসিএস প্রিলিমিনারি প্রশ্নপত্র অনুশীলন করুন। এটি ছিল ১০০ নম্বরের ১ ঘণ্টার পরীক্ষা (পুরনো নিয়ম)। বাংলা, ইংরেজি ও সাধারণ জ্ঞানের প্যাটার্ন বিশ্লেষণ করুন এবং নিজের দুর্বল দিক চিহ্নিত করুন।`;
  } else if (bcsNumber <= 42) {
    return `${bcsNumber}তম বিসিএস প্রিলিমিনারি প্রশ্নপত্র অনুশীলন করুন। ৩৫তম থেকে চালু হওয়া ২০০ নম্বর ও ২ ঘণ্টার নতুন নিয়মে এই পরীক্ষা হয়েছে। টাইমার চালু রেখে সম্পূর্ণ পরীক্ষা দিন এবং নেগেটিভ মার্কিং মাথায় রেখে উত্তর করুন।`;
  } else {
    return `${bcsNumber}তম বিসিএস প্রিলিমিনারি প্রশ্নপত্র অনুশীলন করুন। সাম্প্রতিক এই পরীক্ষায় ২০০ নম্বরের ২০০টি MCQ, সময় ২ ঘণ্টা। ৫১তম বিসিএসের প্রস্তুতির জন্য সবচেয়ে প্রাসঙ্গিক প্রশ্নপত্র — প্রশ্নের ধরন ও কঠিনতার মাত্রা ভালোভাবে লক্ষ্য করুন।`;
  }
}

async function main() {
  // ✅ ফ্রি পরীক্ষা রুটিন — ১০ম থেকে ৫০তম বিসিএস প্রিলিমিনারি প্রশ্নপত্র অনুশীলন
  // 📅 শুরু: ১৫ জুন ২০২৬ | মোট ৪১ দিন | প্রথম ৫,০০০ জনের জন্য বিনামূল্যে
  // 📊 নম্বর:
  //    ১০ম–৩৪তম বিসিএস → ১০০ নম্বর, ৬০ মিনিট
  //    ৩৫তম–৫০তম বিসিএস → ২০০ নম্বর, ১২০ মিনিট

  const routines = [];

  for (let i = 0; i < 41; i++) {
    const bcsNumber = 10 + i;
    const dayNumber = i + 1;
    const dayStr = String(dayNumber).padStart(2, '0');
    const config = getBcsConfig(bcsNumber);

    routines.push({
      subExamCategoryId,
      date: addDays(startDate, i),
      title: `ফ্রি পরীক্ষা রুটিন — DAY-${dayStr} (${bcsNumber}তম বিসিএস প্রিলিমিনারি)`,
      totalMarks: config.totalMarks,
      duration: config.duration,
      subject: 'বিসিএস প্রিলিমিনারি',
      topics: `${bcsNumber}তম বিসিএস প্রিলিমিনারি — সম্পূর্ণ প্রশ্নপত্র (${config.era})`,
      sourceMaterial: `${bcsNumber}তম বিসিএস প্রিলিমিনারি অফিশিয়াল প্রশ্নপত্র ও সমাধান`,
      description: getDescription(bcsNumber),
    });
  }

  await prisma.routine.createMany({ data: routines });

  const summary = routines.reduce(
    (acc, r) => {
      const key = `${r.totalMarks} নম্বর`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  console.log(`✅ ${routines.length}টি রুটিন সফলভাবে তৈরি হয়েছে`);
  console.log('📊 মানবণ্টন সারসংক্ষেপ:');
  Object.entries(summary).forEach(([k, v]) => console.log(`   ${k}: ${v}টি পরীক্ষা`));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
