import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const subExamCategoryId = 'cmnv745os000nuxikxx9ygd79';

async function main() {
  await prisma.routine.createMany({
    // ✅ ৫১তম বিসিএস প্রিলিমিনারি পরীক্ষা — সিলেবাস-বিশ্লেষণ ভিত্তিক সম্পূর্ণ প্রস্তুতি রুটিন
    // 📋 পরীক্ষার মানবণ্টন অনুযায়ী সর্বাধিক গুরুত্বপূর্ণ টপিক (High-Yield Topics) প্রথমে রাখা হয়েছে।
    // 📅 শুরু: ২৫ এপ্রিল ২০২৬ | ছোট সিলেবাস ও অধিক সেটে বিভক্ত।

    data: [
      // ════════════════════════════════════════════════
      // PHASE 1: THE MOST IMPORTANT / HIGH-YIELD TOPICS
      // ════════════════════════════════════════════════

      {
        subExamCategoryId,
        date: new Date('2026-04-25'),
        title: '৫১তম বিসিএস প্রিলি প্রস্তুতি — সেট ০১ (English Grammar)',
        totalMarks: 20,
        duration: 20,
        subject: 'English Language',
        topics: 'Parts of Speech: Noun & Pronoun',
        sourceMaterial: 'Wren & Martin English Grammar ও বিগত BCS প্রশ্নব্যাংক',
        description:
          'BCS প্রিলিমিনারিতে English Language থেকে আসা প্রশ্নের মধ্যে Parts of Speech এর আধিক্য সবচেয়ে বেশি। এই সেটে শুধুমাত্র Noun ও Pronoun এর Classification এবং Identification ফোকাস করা হয়েছে।',
      },
      {
        subExamCategoryId,
        date: new Date('2026-04-26'),
        title: '৫১তম বিসিএস প্রিলি প্রস্তুতি — সেট ০২ (বাংলা সাহিত্য)',
        totalMarks: 20,
        duration: 20,
        subject: 'বাংলা সাহিত্য',
        topics: 'রবীন্দ্রনাথ ঠাকুর — কাব্য, উপন্যাস, নাটক ও ছোটগল্প',
        sourceMaterial: 'বাংলা সাহিত্যের ইতিহাস ও বিগত BCS প্রশ্নব্যাংক',
        description:
          'বিসিএস প্রিলিতে বাংলা সাহিত্যে রবীন্দ্রনাথ ঠাকুর থেকে সর্বাধিক প্রশ্ন আসে (বিগত বিসিএসগুলোতে প্রায় ৫২টি প্রশ্ন এসেছে)। গীতাঞ্জলি, গোরা, রক্তকরবী সহ মূল রচনাগুলো ভালোভাবে আয়ত্ত করুন।',
      },
      {
        subExamCategoryId,
        date: new Date('2026-04-27'),
        title: '৫১তম বিসিএস প্রিলি প্রস্তুতি — সেট ০৩ (বাংলাদেশ বিষয়াবলি)',
        totalMarks: 20,
        duration: 20,
        subject: 'বাংলাদেশ বিষয়াবলি',
        topics: 'ভাষা আন্দোলন থেকে মুক্তিযুদ্ধ (১৯৪৭ - ১৯৭১)',
        sourceMaterial: 'নবম-দশম শ্রেণির বাংলাদেশ ও বিশ্বপরিচয় এবং BCS গাইড',
        description:
          'বাংলাদেশ বিষয়াবলিতে সবচেয়ে বেশি প্রশ্ন আসে স্বাধীনতা যুদ্ধের ইতিহাস থেকে। বায়ান্নর ভাষা আন্দোলন, ৬ দফা, ৬৯-এর গণঅভ্যুত্থান এবং ৭১ এর মুক্তিযুদ্ধ অত্যন্ত গুরুত্বপূর্ণ।',
      },
      {
        subExamCategoryId,
        date: new Date('2026-04-28'),
        title: '৫১তম বিসিএস প্রিলি প্রস্তুতি — সেট ০৪ (গাণিতিক যুক্তি)',
        totalMarks: 20,
        duration: 20,
        subject: 'গাণিতিক যুক্তি',
        topics: 'বীজগাণিতিক সূত্রাবলী, বহুপদী উৎপাদক ও সমীকরণ',
        sourceMaterial: '৭ম থেকে ১০ম শ্রেণির সাধারণ গণিত (বীজগণিত অংশ)',
        description:
          'গণিতে ভীতি দূর করতে বীজগণিতের বেসিক সূত্র ও সমীকরণ আগে শেষ করা বুদ্ধিমানের কাজ। প্রতিটি বিসিএস-এ বীজগণিত থেকে নিশ্চিত প্রশ্ন থাকে।',
      },
      {
        subExamCategoryId,
        date: new Date('2026-04-29'),
        title: '৫১তম বিসিএস প্রিলি প্রস্তুতি — সেট ০৫ (বাংলা সাহিত্য)',
        totalMarks: 20,
        duration: 20,
        subject: 'বাংলা সাহিত্য',
        topics: 'কাজী নজরুল ইসলাম ও মাইকেল মধুসূদন দত্ত',
        sourceMaterial: 'বাংলা সাহিত্যের ইতিহাস ও বিগত BCS প্রশ্নব্যাংক',
        description:
          'রবীন্দ্রনাথের পরেই নজরুলের অবস্থান (বিগত বিসিএস-এ প্রায় ৩২টি প্রশ্ন)। বিদ্রোহী, অগ্নিবীণা এবং মাইকেল মধুসূদনের মেঘনাদবধ কাব্য থেকে নিয়মিত প্রশ্ন আসে।',
      },
      {
        subExamCategoryId,
        date: new Date('2026-04-30'),
        title: '৫১তম বিসিএস প্রিলি প্রস্তুতি — সেট ০৬ (English Grammar)',
        totalMarks: 20,
        duration: 20,
        subject: 'English Language',
        topics: 'Parts of Speech: Verb (Finite/Non-finite) & Adverb',
        sourceMaterial: 'Wren & Martin ও বিগত BCS প্রশ্নব্যাংক',
        description:
          'Verb এর ব্যবহার (Gerund, Participle, Infinitive) থেকে প্রায় প্রতি বছরই ট্রিকি প্রশ্ন আসে। এই সেটে শুধুমাত্র Verb ও Adverb রাখা হয়েছে।',
      },
      {
        subExamCategoryId,
        date: new Date('2026-05-01'),
        title: '৫১তম বিসিএস প্রিলি প্রস্তুতি — সেট ০৭ (বাংলাদেশ বিষয়াবলি)',
        totalMarks: 20,
        duration: 20,
        subject: 'বাংলাদেশ বিষয়াবলি',
        topics: 'বাংলাদেশের সংবিধান ও শাসন বিভাগ',
        sourceMaterial: 'বাংলাদেশের সংবিধান (মূল বই) ও BCS ডাইজেস্ট',
        description:
          'সংবিধানের গুরুত্বপূর্ণ অনুচ্ছেদ, ভাগ এবং সংশোধনীসমূহ থেকে প্রতি বছর অন্তত ৩-৪টি প্রশ্ন নিশ্চিত থাকে।',
      },
      {
        subExamCategoryId,
        date: new Date('2026-05-02'),
        title: '৫১তম বিসিএস প্রিলি প্রস্তুতি — সেট ০৮ (বাংলা ভাষা)',
        totalMarks: 20,
        duration: 20,
        subject: 'বাংলা ভাষা',
        topics: 'শুদ্ধ বানান, বাক্যশুদ্ধি ও প্রয়োগ-অপপ্রয়োগ',
        sourceMaterial: 'নবম-দশম শ্রেণির বাংলা ব্যাকরণ (NCTB)',
        description:
          'বাংলা ব্যাকরণে শুদ্ধ বানান থেকে প্রতিটি BCS-এ ৩-৪টি প্রশ্ন আসে। এটি ব্যাকরণ অংশের সবচেয়ে গুরুত্বপূর্ণ এবং কনফিউজিং টপিক।',
      },

      // ════════════════════════════════════════════════
      // PHASE 2: SECONDARY IMPORTANT TOPICS (CORE FOUNDATION)
      // ════════════════════════════════════════════════

      {
        subExamCategoryId,
        date: new Date('2026-05-03'),
        title: '৫১তম বিসিএস প্রিলি প্রস্তুতি — সেট ০৯ (English Vocabulary)',
        totalMarks: 20,
        duration: 20,
        subject: 'English Language',
        topics: 'Idioms & Phrases এবং Prepositions',
        sourceMaterial: 'যেকোনো স্ট্যান্ডার্ড BCS Vocabulary গাইড',
        description:
          'Idioms & Phrases এবং Appropriate Prepositions থেকে বিগত বিসিএস পরীক্ষাগুলোতে প্রচুর প্রশ্ন এসেছে। এগুলো মুখস্থ করার চেয়ে বাক্যে প্রয়োগ বোঝা বেশি জরুরি।',
      },
      {
        subExamCategoryId,
        date: new Date('2026-05-04'),
        title: '৫১তম বিসিএস প্রিলি প্রস্তুতি — সেট ১০ (আন্তর্জাতিক বিষয়াবলি)',
        totalMarks: 20,
        duration: 20,
        subject: 'আন্তর্জাতিক বিষয়াবলি',
        topics: 'আন্তর্জাতিক সংগঠন ও বৈশ্বিক অর্থনৈতিক প্রতিষ্ঠানাদি',
        sourceMaterial: 'বিসিএস আন্তর্জাতিক বিষয়াবলি গাইড ও কারেন্ট অ্যাফেয়ার্স',
        description:
          'জাতিসংঘ, বিশ্বব্যাংক, IMF এবং অন্যান্য আঞ্চলিক সংস্থা (SAARC, ASEAN) থেকে আন্তর্জাতিক অংশে সবচেয়ে বেশি প্রশ্ন আসে।',
      },
      {
        subExamCategoryId,
        date: new Date('2026-05-05'),
        title: '৫১তম বিসিএস প্রিলি প্রস্তুতি — সেট ১১ (সাধারণ বিজ্ঞান)',
        totalMarks: 20,
        duration: 20,
        subject: 'সাধারণ বিজ্ঞান',
        topics: 'ভৌত বিজ্ঞান: আলো, শব্দ, চৌম্বকত্ব ও বিদ্যুৎ',
        sourceMaterial: 'নবম-দশম শ্রেণির সাধারণ বিজ্ঞান বই',
        description:
          'বিজ্ঞান বিভাগের নন-সায়েন্স ব্যাকগ্রাউন্ডের জন্য ভৌত বিজ্ঞান অংশটি একটু কঠিন মনে হলেও, বেসিক কনসেপ্ট থেকে এখানে সরাসরি প্রশ্ন আসে।',
      },
      {
        subExamCategoryId,
        date: new Date('2026-05-06'),
        title: '৫১তম বিসিএস প্রিলি প্রস্তুতি — সেট ১২ (কম্পিউটার ও আইসিটি)',
        totalMarks: 20,
        duration: 20,
        subject: 'কম্পিউটার ও তথ্য প্রযুক্তি',
        topics: 'কম্পিউটার আর্কিটেকচার, মেমোরি ও ইনপুট-আউটপুট ডিভাইস',
        sourceMaterial: 'উচ্চ মাধ্যমিক আইসিটি বই ও বিসিএস গাইড',
        description:
          'কম্পিউটারের বেসিক হার্ডওয়্যার এবং মেমোরি (RAM, ROM) অংশ থেকে ১৫ নম্বরের আইসিটি অংশে ভালো মার্কস তোলা তুলনামূলক সহজ।',
      },
      {
        subExamCategoryId,
        date: new Date('2026-05-07'),
        title: '৫১তম বিসিএস প্রিলি প্রস্তুতি — সেট ১৩ (বাংলা ভাষা)',
        totalMarks: 20,
        duration: 20,
        subject: 'বাংলা ভাষা',
        topics: 'সন্ধি ও সমাস নির্ণয়',
        sourceMaterial: 'নবম-দশম শ্রেণির বাংলা ব্যাকরণ (NCTB)',
        description:
          'সন্ধি ও সমাস বাংলা ব্যাকরণের বড় দুটি চ্যাপ্টার। বিগত বিসিএস পরীক্ষার প্রশ্নগুলো বারবার চর্চা করা এই সেটের মূল লক্ষ্য।',
      },
      {
        subExamCategoryId,
        date: new Date('2026-05-08'),
        title: '৫১তম বিসিএস প্রিলি প্রস্তুতি — সেট ১৪ (English Literature)',
        totalMarks: 20,
        duration: 20,
        subject: 'English Literature',
        topics: 'Renaissance Period: William Shakespeare & Christopher Marlowe',
        sourceMaterial: 'BCS English Literature Guide',
        description:
          'English Literature-এ ১৫ নম্বরের মধ্যে Renaissance Period এবং বিশেষ করে Shakespeare এর নাটক ও উক্তি (Quotations) থেকে সর্বাধিক প্রশ্ন আসে।',
      },
      {
        subExamCategoryId,
        date: new Date('2026-05-09'),
        title: '৫১তম বিসিএস প্রিলি প্রস্তুতি — সেট ১৫ (গাণিতিক যুক্তি)',
        totalMarks: 20,
        duration: 20,
        subject: 'গাণিতিক যুক্তি',
        topics: 'পাটিগণিত: শতকরা, লাভ-ক্ষতি ও সুদকষা',
        sourceMaterial: '৭ম ও ৮ম শ্রেণির গণিত বই',
        description:
          'পাটিগণিতের এই তিনটি টপিক একে অপরের সাথে সম্পর্কিত। বিসিএস এবং অন্যান্য সরকারি চাকরির পরীক্ষায় এই অংশগুলো থেকে নিয়মিত প্রশ্ন আসে।',
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
