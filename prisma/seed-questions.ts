import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const questionSetId = 'cmos0mux200139r01rtb3olz9';

async function main() {
  // Seed mock questions
  await prisma.question.createMany({
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ৫১তম বিসিএস প্রিলি প্রস্তুতি — সেট ০২ (বাংলা সাহিত্য)
    // বিষয়: রবীন্দ্রনাথ ঠাকুর — কাব্য, উপন্যাস, নাটক ও ছোটগল্প
    // মোট প্রশ্ন: ২০টি (প্রশ্ন ০১–২০)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    data: [
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // বিষয়: তথ্য ও যোগাযোগ প্রযুক্তি (ICT) — প্রশ্ন ০১–৩০
      // Topic: Digital Devices — Adder, Counter, Flip Flop, Register
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      // ─── Half Adder ───
      {
        questionSetId,
        slug: 'half-adder-ki-ebong-ki-ki-gate-diye-toiri-hoy',
        questionText: '০১. হাফ অ্যাডার (Half Adder) কোন দুটি লজিক গেট দিয়ে তৈরি?',
        optionA: 'AND ও OR',
        optionB: 'XOR ও AND',
        optionC: 'OR ও NOT',
        optionD: 'NAND ও NOR',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) XOR ও AND

হাফ অ্যাডার (Half Adder) হলো ডিজিটাল ইলেকট্রনিক্সের সবচেয়ে মৌলিক সংযোজন বর্তনী।

হাফ অ্যাডারের বিশদ বিবরণ:
— ইনপুট: দুটি (A ও B)
— আউটপুট: দুটি — Sum (S) এবং Carry (C)
— Sum নির্ণয়: S = A XOR B (বিজোড় সংখ্যক ১ হলে আউটপুট ১)
— Carry নির্ণয়: C = A AND B (উভয় ইনপুট ১ হলে Carry ১)

হাফ অ্যাডার সত্যতা সারণী:
 A=0, B=0 → S=0, C=0
 A=0, B=1 → S=1, C=0
 A=1, B=0 → S=1, C=0
 A=1, B=1 → S=0, C=1

সীমাবদ্ধতা:
— পূর্ববর্তী ধাপ থেকে আসা Carry-in গ্রহণ করতে পারে না
— তাই বহু-বিট যোগের জন্য ফুল অ্যাডার ব্যবহার করা হয়

উৎস: NCTB ICT বই (একাদশ-দ্বাদশ শ্রেণি), অধ্যায়: ডিজিটাল ডিভাইস; বিগত NTRCA প্রশ্নব্যাংক।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Half Adder',
        sortOrder: 1,
      },

      {
        questionSetId,
        slug: 'half-adder-er-output-gulo-ki-ki',
        questionText: '০২. হাফ অ্যাডারের আউটপুট কোন দুটি?',
        optionA: 'Sum ও Difference',
        optionB: 'Sum ও Carry',
        optionC: 'Product ও Sum',
        optionD: 'Carry ও Borrow',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) Sum ও Carry

হাফ অ্যাডারের দুটি আউটপুট হলো Sum (S) ও Carry (C) — এটি NTRCA-তে বারবার আসা প্রশ্ন।

Sum (S) নির্ণয়:
— S = A XOR B
— 0+0=0 (S=0, C=0)
— 0+1=1 (S=1, C=0)
— 1+0=1 (S=1, C=0)
— 1+1=10 বাইনারিতে (S=0, C=1)

Carry (C) নির্ণয়:
— C = A AND B
— কেবল 1+1 হলেই Carry=1 হয়
— বাইনারিতে 1+1=10, যেখানে 0 হলো Sum ও 1 হলো Carry

বাস্তব যোগের উদাহরণ:
— দশমিকে 7+8=15 → এখানে 5 হলো Sum, 1 হলো Carry (দশকের ঘর)
— বাইনারিতেও একইভাবে Carry পরবর্তী বিটে যায়

পার্থক্য মনে রাখুন:
— Subtractor-এর আউটপুট: Difference ও Borrow
— Adder-এর আউটপুট: Sum ও Carry

উৎস: NCTB ICT বই; বিগত NTRCA ১২তম-১৮তম প্রশ্নব্যাংক।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Half Adder',
        sortOrder: 2,
      },

      {
        questionSetId,
        slug: 'half-adder-e-carry-in-input-ace-ki',
        questionText: '০৩. হাফ অ্যাডারে পূর্বের ধাপ থেকে আসা Carry-in ইনপুট গ্রহণ করা যায় কি?',
        optionA: 'হ্যাঁ, সবসময়',
        optionB: 'না, হাফ অ্যাডার Carry-in গ্রহণ করে না',
        optionC: 'শুধুমাত্র প্রথম বিটে',
        optionD: 'শুধুমাত্র শেষ বিটে',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) না, হাফ অ্যাডার Carry-in গ্রহণ করে না

এটি হাফ অ্যাডারের সবচেয়ে বড় সীমাবদ্ধতা — এটি কেবল দুটি ইনপুট বিট যোগ করতে পারে, পূর্ববর্তী Carry গ্রহণ করার ক্ষমতা নেই।

হাফ অ্যাডারের সীমাবদ্ধতা:
— মাত্র ২টি ইনপুট: A ও B
— Carry-in (Cin) নেই
— তাই বহু-বিট সংযোজনে প্রথম বিট ছাড়া ব্যবহার করা যায় না

ফুল অ্যাডারের সমাধান:
— ৩টি ইনপুট: A, B, এবং Carry-in (Cin)
— পূর্ববর্তী ধাপ থেকে আসা Carry গ্রহণ করতে পারে
— তাই মাল্টি-বিট যোগে ব্যবহারযোগ্য

বাস্তব প্রয়োগ:
— 4-বিট সংযোজন: প্রথম বিটে হাফ অ্যাডার, বাকি তিনটিতে ফুল অ্যাডার
— অথবা সবগুলোতে ফুল অ্যাডার (Cin=0 দিয়ে প্রথমটি চালু)

উৎস: NCTB ICT পাঠ্যবই; Digital Electronics — Morris Mano।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Half Adder',
        sortOrder: 3,
      },

      // ─── Full Adder ───
      {
        questionSetId,
        slug: 'full-adder-er-input-sankhya-koto',
        questionText: '০৪. ফুল অ্যাডারের (Full Adder) ইনপুট সংখ্যা কতটি?',
        optionA: '২টি',
        optionB: '৩টি',
        optionC: '৪টি',
        optionD: '১টি',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) ৩টি

ফুল অ্যাডার (Full Adder) হাফ অ্যাডারের উন্নত সংস্করণ — এটি তিনটি ইনপুট গ্রহণ করে।

ফুল অ্যাডারের ইনপুট সমূহ:
— A: প্রথম বিটের ইনপুট
— B: দ্বিতীয় বিটের ইনপুট
— Cin (Carry-in): পূর্ববর্তী ধাপ থেকে আসা ক্যারি বিট

আউটপুট সমূহ:
— Sum (S) = A XOR B XOR Cin
— Cout (Carry-out) = (A AND B) OR (B AND Cin) OR (A AND Cin)

ফুল অ্যাডার তৈরির পদ্ধতি:
— দুটি হাফ অ্যাডার + একটি OR গেট দিয়ে ফুল অ্যাডার তৈরি করা যায়
— ফুল অ্যাডার বহু-বিট বাইনারি যোগের জন্য সিরিজে সংযুক্ত করা হয়
— n-বিট Ripple Carry Adder তৈরিতে n টি ফুল অ্যাডার লাগে

ব্যবহার: CPU-এর ALU (Arithmetic Logic Unit)-এ বাইনারি যোগের কাজে সরাসরি ব্যবহৃত হয়

উৎস: Digital Electronics — Morris Mano; NCTB ICT পাঠ্যবই।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Full Adder',
        sortOrder: 4,
      },

      {
        questionSetId,
        slug: 'full-adder-duti-half-adder-diye-toiri-hote-pare',
        questionText: '০৫. একটি ফুল অ্যাডার তৈরিতে কতটি হাফ অ্যাডার প্রয়োজন?',
        optionA: '১টি',
        optionB: '২টি',
        optionC: '৩টি',
        optionD: '৪টি',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) ২টি

একটি ফুল অ্যাডার তৈরি করতে ২টি হাফ অ্যাডার ও ১টি OR গেট দরকার।

ফুল অ্যাডার তৈরির পদ্ধতি:
— ধাপ ১: প্রথম হাফ অ্যাডার → A ও B যোগ করে S₁ ও C₁ পায়
— ধাপ ২: দ্বিতীয় হাফ অ্যাডার → S₁ ও Cin যোগ করে S ও C₂ পায়
— ধাপ ৩: OR গেট → C₁ OR C₂ = Cout

একটি সূত্রে:
— Full Adder = HA₁ + HA₂ + OR Gate
— HA₁ (A,B) → S₁, C₁
— HA₂ (S₁, Cin) → Sum, C₂
— Cout = C₁ OR C₂

গেট হিসাব:
— প্রতি হাফ অ্যাডারে: 1 XOR + 1 AND = 2 গেট
— 2 HA + 1 OR = মোট 5টি গেট
— NAND/NOR গেট দিয়ে তৈরি হলে 9টি NAND গেট দরকার

উৎস: Digital Logic Design — Mano & Ciletti; NCTB ICT পাঠ্যবই।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Full Adder',
        sortOrder: 5,
      },

      {
        questionSetId,
        slug: 'full-adder-er-sum-output-er-boolean-expression-ki',
        questionText: '০৬. ফুল অ্যাডারের Sum (S) আউটপুটের Boolean Expression কোনটি?',
        optionA: 'S = A AND B AND Cin',
        optionB: 'S = A OR B OR Cin',
        optionC: 'S = A XOR B XOR Cin',
        optionD: 'S = A XNOR B XNOR Cin',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) S = A XOR B XOR Cin

ফুল অ্যাডারের Sum আউটপুট তিনটি বিটের XOR অপারেশনের ফলাফল। এটি একটি গুরুত্বপূর্ণ Boolean Expression।

ফুল অ্যাডারের Boolean Expression:
— Sum: S = A ⊕ B ⊕ Cin (XOR)
— Carry-out: Cout = (A·B) + (B·Cin) + (A·Cin)

XOR সত্যতা (বিজোড় সংখ্যক 1 হলে আউটপুট 1):
 A=0,B=0,Cin=0 → S=0, Cout=0
 A=0,B=0,Cin=1 → S=1, Cout=0
 A=0,B=1,Cin=0 → S=1, Cout=0
 A=0,B=1,Cin=1 → S=0, Cout=1
 A=1,B=0,Cin=0 → S=1, Cout=0
 A=1,B=0,Cin=1 → S=0, Cout=1
 A=1,B=1,Cin=0 → S=0, Cout=1
 A=1,B=1,Cin=1 → S=1, Cout=1

কেন XOR কাজ করে:
— বাইনারি যোগে বিজোড় সংখ্যক 1 যোগ করলে Sum বিট 1 হয়
— XOR ঠিক এই কাজটি করে — বিজোড় ইনপুট → আউটপুট 1

উৎস: Digital Design — Morris Mano; NCTB ICT পাঠ্যবই; বিগত NTRCA প্রশ্নব্যাংক।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Full Adder',
        sortOrder: 6,
      },

      // ─── Flip Flop ───
      {
        questionSetId,
        slug: 'flip-flop-ki-dhorer-circuit',
        questionText: '০৭. ফ্লিপ-ফ্লপ (Flip-Flop) কোন ধরনের সার্কিট?',
        optionA: 'কম্বিনেশনাল সার্কিট',
        optionB: 'সিকোয়েনশিয়াল সার্কিট',
        optionC: 'অ্যানালগ সার্কিট',
        optionD: 'লিনিয়ার সার্কিট',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) সিকোয়েনশিয়াল সার্কিট

ডিজিটাল সার্কিট দুই ধরনের — কম্বিনেশনাল ও সিকোয়েনশিয়াল। ফ্লিপ-ফ্লপ সিকোয়েনশিয়াল বর্তনীর মূলভিত্তি।

সিকোয়েনশিয়াল সার্কিটের বৈশিষ্ট্য:
— আউটপুট শুধু বর্তমান ইনপুটের উপর নয়, পূর্ববর্তী অবস্থার উপরও নির্ভর করে
— মেমোরি বা স্মৃতিশক্তি আছে — অর্থাৎ অবস্থান সংরক্ষণ করতে পারে
— Clock সিগন্যাল দ্বারা নিয়ন্ত্রিত হয়

কম্বিনেশনাল সার্কিটের পার্থক্য:
— আউটপুট শুধুমাত্র বর্তমান ইনপুটের উপর নির্ভর করে
— কোনো মেমোরি নেই
— উদাহরণ: Adder, Multiplexer, Decoder

ফ্লিপ-ফ্লপের ভূমিকা:
— ১ বিট ডেটা সংরক্ষণ করে (0 বা 1)
— Register ও Counter তৈরির মৌলিক উপাদান
— SRAM (Static RAM)-এর মেমোরি সেল ফ্লিপ-ফ্লপ দিয়ে তৈরি

উৎস: NCTB ICT পাঠ্যবই (একাদশ-দ্বাদশ); Digital Design — Morris Mano।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Flip Flop',
        sortOrder: 7,
      },

      {
        questionSetId,
        slug: 'sr-flip-flop-er-forbiden-state-konta',
        questionText: '০৮. SR ফ্লিপ-ফ্লপে নিষিদ্ধ অবস্থা (Forbidden/Invalid State) কোনটি?',
        optionA: 'S=0, R=0',
        optionB: 'S=1, R=0',
        optionC: 'S=0, R=1',
        optionD: 'S=1, R=1',
        correctAnswer: 'D',
        explanation: `সঠিক উত্তর: (ঘ) S=1, R=1

SR ফ্লিপ-ফ্লপে S=1, R=1 দিলে আউটপুট অনির্ধারিত বা অবৈধ হয়ে পড়ে — এটিই নিষিদ্ধ অবস্থা।

SR ফ্লিপ-ফ্লপের সত্যতা সারণী:
 S=0, R=0 → Q = অপরিবর্তিত (মেমোরি অবস্থা)
 S=1, R=0 → Q = 1 (Set হয়)
 S=0, R=1 → Q = 0 (Reset হয়)
 S=1, R=1 → Q = অনির্ধারিত (নিষিদ্ধ!)

কেন S=1, R=1 নিষিদ্ধ:
— S=1 মানে আউটপুট 1 করতে বলছে
— R=1 মানে একই সাথে আউটপুট 0 করতে বলছে
— দুটি বিপরীত নির্দেশ একসাথে দিলে Q ও Q' উভয়ই 1 হয়ে পড়ে
— Clock শেষ হওয়ার পর সার্কিট অনির্ধারিত অবস্থায় চলে যায়

এই সমস্যার সমাধান:
— JK ফ্লিপ-ফ্লপে J=1, K=1 দিলে আউটপুট Toggle করে (নিষিদ্ধ নয়)
— JK ফ্লিপ-ফ্লপ SR-এর উন্নত সংস্করণ

উৎস: Digital Electronics — Floyd; বিগত ১৩তম ও ১৫তম NTRCA প্রশ্নব্যাংক।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Flip Flop',
        sortOrder: 8,
      },

      {
        questionSetId,
        slug: 'jk-flip-flop-er-toggle-condition-ki',
        questionText: '০৯. JK ফ্লিপ-ফ্লপে Toggle অবস্থা কখন ঘটে?',
        optionA: 'J=0, K=0',
        optionB: 'J=1, K=0',
        optionC: 'J=0, K=1',
        optionD: 'J=1, K=1',
        correctAnswer: 'D',
        explanation: `সঠিক উত্তর: (ঘ) J=1, K=1

JK ফ্লিপ-ফ্লপ SR ফ্লিপ-ফ্লপের নিষিদ্ধ অবস্থার সমস্যা সমাধান করে। J=1, K=1 দিলে আউটপুট টগল হয় — অর্থাৎ বিপরীত হয়।

JK ফ্লিপ-ফ্লপের সত্যতা সারণী:
 J=0, K=0 → Q = অপরিবর্তিত (No change)
 J=1, K=0 → Q = 1 (Set)
 J=0, K=1 → Q = 0 (Reset)
 J=1, K=1 → Q = Q' (Toggle — পূর্বের বিপরীত)

Toggle বলতে কী বোঝায়:
— পূর্বে Q=0 ছিলে → এখন Q=1 হবে
— পূর্বে Q=1 ছিলে → এখন Q=0 হবে
— প্রতিটি Clock pulse-এ আউটপুট পরিবর্তিত হয়

ব্যবহারিক গুরুত্ব:
— Binary Counter তৈরিতে JK ফ্লিপ-ফ্লপ Toggle mode-এ ব্যবহৃত হয়
— ফ্রিকোয়েন্সি ডিভাইডার হিসেবেও কাজ করে (প্রতিবার clock-এ আউটপুট অর্ধেক)

উৎস: NCTB ICT বই (একাদশ-দ্বাদশ); বিগত NTRCA ১৪তম ও ১৬তম নিবন্ধন প্রশ্নব্যাংক।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Flip Flop',
        sortOrder: 9,
      },

      {
        questionSetId,
        slug: 'd-flip-flop-ke-ki-bole',
        questionText: '১০. D ফ্লিপ-ফ্লপকে কী বলা হয়?',
        optionA: 'Delay ফ্লিপ-ফ্লপ',
        optionB: 'Dynamic ফ্লিপ-ফ্লপ',
        optionC: 'Dual ফ্লিপ-ফ্লপ',
        optionD: 'Divide ফ্লিপ-ফ্লপ',
        correctAnswer: 'A',
        explanation: `সঠিক উত্তর: (ক) Delay ফ্লিপ-ফ্লপ

D ফ্লিপ-ফ্লপকে Delay ফ্লিপ-ফ্লপ বলা হয় কারণ এটি ইনপুটকে এক ক্লক পালস বিলম্বিত (delay) করে আউটপুটে পাঠায়।

D ফ্লিপ-ফ্লপের বৈশিষ্ট্য:
— শুধুমাত্র একটি ইনপুট D (Data)
— Clock pulse আসলে D-এর মান Q-তে স্থানান্তরিত হয়
— সত্যতা সারণী: D=0 → Q=0; D=1 → Q=1
— SR ফ্লিপ-ফ্লপের নিষিদ্ধ অবস্থা থাকে না

কেন 'Delay' নামকরণ:
— Clock-এর Rising Edge পর্যন্ত ইনপুট আউটপুটে আসে না
— এটি একটি Clock cycle বিলম্ব সৃষ্টি করে
— তাই Data Latch বা Delay ফ্লিপ-ফ্লপ নামে পরিচিত

ব্যবহার:
— Shift Register তৈরিতে সবচেয়ে বেশি ব্যবহৃত হয়
— ডেটা সংরক্ষণ ও স্থানান্তরে কাজে আসে
— কম্পিউটারের CPU Pipeline-এ ব্যবহৃত হয়

উৎস: Digital Electronics — Tokheim; NTRCA বিগত প্রশ্নব্যাংক।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Flip Flop',
        sortOrder: 10,
      },

      {
        questionSetId,
        slug: 't-flip-flop-er-bisesh-nam-ki',
        questionText: '১১. T ফ্লিপ-ফ্লপকে বিশেষভাবে কী নামে ডাকা হয়?',
        optionA: 'Trigger ফ্লিপ-ফ্লপ',
        optionB: 'Toggle ফ্লিপ-ফ্লপ',
        optionC: 'Transfer ফ্লিপ-ফ্লপ',
        optionD: 'Timing ফ্লিপ-ফ্লপ',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) Toggle ফ্লিপ-ফ্লপ

T ফ্লিপ-ফ্লপকে Toggle ফ্লিপ-ফ্লপ বলা হয় কারণ T=1 থাকলে প্রতিটি ক্লক পালসে আউটপুট Toggle বা পরিবর্তিত হয়।

T ফ্লিপ-ফ্লপের সত্যতা সারণী:
 T=0 → Q = অপরিবর্তিত (No change)
 T=1 → Q = Q' (Toggle — প্রতিটি clock-এ বিপরীত হয়)

T ফ্লিপ-ফ্লপ তৈরির পদ্ধতি:
— JK ফ্লিপ-ফ্লপের J ও K ইনপুট একসাথে সংযুক্ত করলে T ফ্লিপ-ফ্লপ পাওয়া যায়
— অর্থাৎ T = J = K

ব্যবহারিক প্রয়োগ:
— Binary Counter তৈরিতে সর্বাধিক ব্যবহৃত হয়
— Ripple Counter-এ প্রতিটি ফ্লিপ-ফ্লপ T mode-এ (T=1) কাজ করে
— ফ্রিকোয়েন্সি বিভাজন (Frequency Division): প্রতিটি T FF clock ফ্রিকোয়েন্সি অর্ধেক করে

উৎস: NCTB ICT বই; Digital Logic Design — Mano & Ciletti।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Flip Flop',
        sortOrder: 11,
      },

      {
        questionSetId,
        slug: 'flip-flop-1-bit-dharOn-kore',
        questionText: '১২. একটি ফ্লিপ-ফ্লপ কত বিট ডেটা ধারণ করতে পারে?',
        optionA: '২ বিট',
        optionB: '৪ বিট',
        optionC: '১ বিট',
        optionD: '৮ বিট',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) ১ বিট

একটি ফ্লিপ-ফ্লপ শুধুমাত্র ১ বিট ডেটা ধারণ করতে পারে — এটি ডিজিটাল মেমোরির মৌলিক একক।

ফ্লিপ-ফ্লপের ১ বিট ধারণের বিশদ ব্যাখ্যা:
— আউটপুট Q = 0 অথবা 1 — শুধুমাত্র এই দুটি অবস্থা
— এটি একটি বাইনারি মেমোরি সেল
— Q ও Q' (Q-bar) দুটি পরিপূরক আউটপুট থাকে

রেজিস্টার ও মেমোরির সাথে সম্পর্ক:
— 1 FF → 1 বিট
— 8 FF → 8 বিট (1 বাইট)
— 16 FF → 16 বিট

সামগ্রিক মেমোরি তৈরি:
— RAM-এর প্রতিটি বিট সেল একটি ফ্লিপ-ফ্লপ (SRAM-এ)
— 1 MB SRAM = 8 × 1024 × 1024 = 8,388,608 টি ফ্লিপ-ফ্লপ

DRAM-এর পার্থক্য:
— DRAM-এ ফ্লিপ-ফ্লপের বদলে Capacitor ও Transistor ব্যবহৃত হয়
— তাই DRAM সস্তা কিন্তু SRAM দ্রুত

উৎস: Computer Architecture — Patterson & Hennessy; NCTB ICT বই।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Flip Flop',
        sortOrder: 12,
      },

      {
        questionSetId,
        slug: 'sr-latch-ebong-sr-flip-flop-er-parthokko',
        questionText: '১৩. SR Latch ও SR Flip-Flop-এর মধ্যে মূল পার্থক্য কোথায়?',
        optionA: 'ইনপুট সংখ্যায়',
        optionB: 'Clock সংকেতের উপস্থিতিতে',
        optionC: 'আউটপুট সংখ্যায়',
        optionD: 'গেটের ধরনে',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) Clock সংকেতের উপস্থিতিতে

SR Latch ও SR Flip-Flop উভয়েরই ইনপুট S ও R — কিন্তু পার্থক্য হলো Flip-Flop-এ Clock সংকেত নিয়ন্ত্রণ করে কখন অবস্থা পরিবর্তন হবে।

SR Latch-এর বৈশিষ্ট্য:
— Clock নেই
— S বা R পরিবর্তন হলে সাথে সাথে আউটপুট পরিবর্তন হয়
— Level-sensitive (ইনপুট active থাকা পর্যন্ত প্রভাব থাকে)
— অ্যাসিনক্রোনাস ডিভাইস

SR Flip-Flop-এর বৈশিষ্ট্য:
— Clock সংকেত আছে
— Clock-এর নির্দিষ্ট Edge-এ অবস্থা পরিবর্তন হয়
— Edge-triggered বা Level-triggered হতে পারে
— সিনক্রোনাস ডিভাইস

গুরুত্ব:
— ডিজিটাল সিস্টেমে Clock-ভিত্তিক নিয়ন্ত্রণ অপরিহার্য
— তাই Latch-এর চেয়ে Flip-Flop বেশি ব্যবহৃত হয়

উৎস: Digital Design — Wakerly; NCTB ICT পাঠ্যবই।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Flip Flop',
        sortOrder: 13,
      },

      {
        questionSetId,
        slug: 'nand-gate-diye-sr-flip-flop-toiri-hoy',
        questionText: '১৪. SR ফ্লিপ-ফ্লপ কোন গেট দিয়ে তৈরি করা যায়?',
        optionA: 'শুধু AND গেট',
        optionB: 'NAND বা NOR গেট',
        optionC: 'শুধু OR গেট',
        optionD: 'XOR গেট',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) NAND বা NOR গেট

SR ফ্লিপ-ফ্লপ NAND গেট বা NOR গেট ব্যবহার করে তৈরি করা যায় — উভয় ধরনের বর্তনী বাস্তবে ব্যবহৃত হয়।

NAND গেট দিয়ে SR ফ্লিপ-ফ্লপ:
— দুটি NAND গেটের আউটপুট পরস্পরের ইনপুটে যায় (Cross-coupled)
— ইনপুট: S̄ (S-bar) ও R̄ (R-bar) — Active Low
— নিষিদ্ধ অবস্থা: S̄=0, R̄=0 (উভয় LOW)

NOR গেট দিয়ে SR ফ্লিপ-ফ্লপ:
— দুটি NOR গেট Cross-coupled
— ইনপুট: S ও R — Active High
— নিষিদ্ধ অবস্থা: S=1, R=1 (উভয় HIGH)

কোনটি বেশি ব্যবহৃত:
— NAND গেট দিয়ে তৈরি SR ফ্লিপ-ফ্লপ বেশি প্রচলিত
— কারণ NAND গেট সবচেয়ে সহজলভ্য Universal Gate

Universal Gate মনে রাখুন:
— NAND ও NOR দুটিই Universal Gate
— এদের দিয়ে যেকোনো লজিক সার্কিট তৈরি সম্ভব

উৎস: Digital Electronics — Tokheim; NCTB ICT পাঠ্যবই।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Flip Flop',
        sortOrder: 14,
      },

      {
        questionSetId,
        slug: 'flip-flop-er-clock-triggering-dui-dhoron-ki',
        questionText: '১৫. ক্লক ট্রিগারিং-এর ভিত্তিতে ফ্লিপ-ফ্লপ কত প্রকার?',
        optionA: '২ প্রকার — Level ও Edge triggered',
        optionB: '৩ প্রকার — Rising, Falling ও Level',
        optionC: '৪ প্রকার',
        optionD: 'মাত্র ১ প্রকার',
        correctAnswer: 'A',
        explanation: `সঠিক উত্তর: (ক) ২ প্রকার — Level ও Edge triggered

Clock Triggering-এর ভিত্তিতে ফ্লিপ-ফ্লপ দুই প্রকার: Level-triggered ও Edge-triggered।

Level-triggered ফ্লিপ-ফ্লপ:
— Clock HIGH (বা LOW) থাকা পর্যন্ত ইনপুট গ্রহণ করে
— Latch-এর মতো আচরণ করে
— Clock pulse চলাকালীন ইনপুট পরিবর্তন হলে আউটপুটও পরিবর্তিত হয়

Edge-triggered ফ্লিপ-ফ্লপ:
— Clock-এর নির্দিষ্ট Edge-এ (মুহূর্তে) অবস্থা পরিবর্তন হয়
— Rising Edge (0→1 পরিবর্তন): Positive edge triggered
— Falling Edge (1→0 পরিবর্তন): Negative edge triggered
— বেশি নির্ভরযোগ্য ও আধুনিক সার্কিটে বহুল ব্যবহৃত

কোনটি বেশি ব্যবহৃত:
— Edge-triggered ফ্লিপ-ফ্লপ বর্তমানে সবচেয়ে বেশি ব্যবহৃত
— কারণ এটি ভুল ট্রিগারিং থেকে সুরক্ষিত
— Master-Slave FF একটি জনপ্রিয় Edge-triggered ডিজাইন

উৎস: Digital Electronics — Morris Mano; NCTB ICT পাঠ্যবই।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Flip Flop',
        sortOrder: 15,
      },

      // ─── Register ───
      {
        questionSetId,
        slug: 'register-ki-diye-toiri-hoy',
        questionText: '১৬. রেজিস্টার (Register) কী দিয়ে তৈরি হয়?',
        optionA: 'Logic Gate',
        optionB: 'Flip-Flop',
        optionC: 'Transistor',
        optionD: 'Multiplexer',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) Flip-Flop

রেজিস্টার মূলত একাধিক ফ্লিপ-ফ্লপ সংযুক্ত করে তৈরি করা হয় — প্রতিটি ফ্লিপ-ফ্লপ ১ বিট ডেটা ধারণ করে।

রেজিস্টারের বিস্তারিত:
— n-বিট রেজিস্টার = n টি ফ্লিপ-ফ্লপের সমষ্টি
— উদাহরণ: 8-বিট রেজিস্টার তৈরিতে 8টি ফ্লিপ-ফ্লপ লাগে
— সব ফ্লিপ-ফ্লপ একই Clock signal দ্বারা নিয়ন্ত্রিত

রেজিস্টারের প্রকারভেদ:
— Parallel Register: সব বিট একসাথে Load/Read হয়
— Shift Register: বিটগুলো ক্রমানুসারে Left বা Right শিফট হয়
— Universal Shift Register: উভয় দিকে শিফট করতে পারে

কম্পিউটারে রেজিস্টারের ভূমিকা:
— CPU-এর ভেতরে থাকা ক্ষুদ্রতম ও দ্রুততম মেমোরি
— Accumulator, Program Counter, Instruction Register সবই রেজিস্টার
— ডেটা প্রসেসিংয়ের সময় অস্থায়ী ডেটা রাখে

উৎস: Computer Organization — Carl Hamacher; NCTB ICT পাঠ্যবই।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Register',
        sortOrder: 16,
      },

      {
        questionSetId,
        slug: '4-bit-register-e-kota-flip-flop-lagbe',
        questionText: '১৭. একটি 4-বিট রেজিস্টার তৈরি করতে কতটি ফ্লিপ-ফ্লপ প্রয়োজন?',
        optionA: '২টি',
        optionB: '৩টি',
        optionC: '৪টি',
        optionD: '৮টি',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) ৪টি

এটি একটি সরাসরি নিয়ম — n-বিট রেজিস্টার তৈরিতে n টি ফ্লিপ-ফ্লপ দরকার। প্রতিটি ফ্লিপ-ফ্লপ ঠিক ১ বিট ধারণ করে।

বিট ও ফ্লিপ-ফ্লপের সম্পর্ক:
— 1-বিট → 1টি ফ্লিপ-ফ্লপ
— 4-বিট → 4টি ফ্লিপ-ফ্লপ
— 8-বিট → 8টি ফ্লিপ-ফ্লপ
— 16-বিট → 16টি ফ্লিপ-ফ্লপ

বাস্তব উদাহরণ:
— 8086 প্রসেসরের রেজিস্টার 16 বিট → 16টি ফ্লিপ-ফ্লপ
— আধুনিক 64-বিট প্রসেসরে রেজিস্টারে 64টি ফ্লিপ-ফ্লপ

4-বিট রেজিস্টারে সংরক্ষণ:
— সর্বোচ্চ মান: 1111 (বাইনারি) = 15 (দশমিক)
— মোট অবস্থা: 2⁴ = 16 টি (0 থেকে 15)

উৎস: Digital Design — Morris Mano; NTRCA বিগত প্রশ্নব্যাংক বিশ্লেষণ।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Register',
        sortOrder: 17,
      },

      {
        questionSetId,
        slug: 'shift-register-e-data-kivabe-sthanantorito-hoy',
        questionText: '১৮. শিফট রেজিস্টারে (Shift Register) ডেটা কীভাবে স্থানান্তরিত হয়?',
        optionA: 'একসাথে সব বিট',
        optionB: 'ক্রমানুসারে এক বিট করে',
        optionC: 'র্যান্ডমলি যেকোনো বিট',
        optionD: 'দুটি বিট একসাথে',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) ক্রমানুসারে এক বিট করে

শিফট রেজিস্টারে প্রতিটি Clock pulse-এ ডেটা বিট একটি করে পরবর্তী ফ্লিপ-ফ্লপে স্থানান্তরিত হয়।

শিফট রেজিস্টারের প্রকারভেদ:
— SISO (Serial In Serial Out): ক্রমানুসারে ঢোকে, ক্রমানুসারে বের হয়
— SIPO (Serial In Parallel Out): ক্রমানুসারে ঢোকে, একসাথে বের হয়
— PISO (Parallel In Serial Out): একসাথে ঢোকে, ক্রমানুসারে বের হয়
— PIPO (Parallel In Parallel Out): একসাথে ঢোকে, একসাথে বের হয়

শিফট রেজিস্টারের ব্যবহার:
— Serial ↔ Parallel ডেটা রূপান্তরে (UART, SPI যোগাযোগে)
— ডেটা বিলম্ব সৃষ্টিতে (Time delay)
— Ring Counter তৈরিতে

উৎস: NCTB ICT বই; Digital Electronics — Morris Mano।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Register',
        sortOrder: 18,
      },

      {
        questionSetId,
        slug: 'shift-register-serial-to-parallel-conversion-e-kaje-lage',
        questionText: '১৯. Serial থেকে Parallel ডেটা রূপান্তরে কোন রেজিস্টার ব্যবহার করা হয়?',
        optionA: 'PIPO রেজিস্টার',
        optionB: 'SIPO রেজিস্টার',
        optionC: 'PISO রেজিস্টার',
        optionD: 'SISO রেজিস্টার',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) SIPO রেজিস্টার

SIPO (Serial In Parallel Out) রেজিস্টার Serial ডেটা গ্রহণ করে এবং Parallel আউটপুট দেয় — অর্থাৎ Serial-to-Parallel রূপান্তর করে।

চারটি শিফট রেজিস্টার মোড:
— SISO (Serial In, Serial Out): ডেটা ক্রমানুসারে আসে ও যায় — শুধু বিলম্ব সৃষ্টি
— SIPO (Serial In, Parallel Out): ক্রমানুসারে ঢোকে, একসাথে বের হয় → Serial→Parallel
— PISO (Parallel In, Serial Out): একসাথে ঢোকে, ক্রমানুসারে বের হয় → Parallel→Serial
— PIPO (Parallel In, Parallel Out): একসাথে ঢোকে, একসাথে বের হয় → প্যারালাল রেজিস্টার

ব্যবহারিক উদাহরণ:
— SIPO: UART রিসিভার (Serial ডেটা পেয়ে Parallel দেয়)
— PISO: UART ট্রান্সমিটার (Parallel ডেটা নিয়ে Serial পাঠায়)
— SPI, I2C প্রোটোকলে ব্যাপকভাবে ব্যবহৃত

উৎস: Digital Electronics — Floyd; NCTB ICT পাঠ্যবই; NTRCA প্রশ্নব্যাংক।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Register',
        sortOrder: 19,
      },

      {
        questionSetId,
        slug: 'parallel-register-e-data-koto-ta-ek-sathe-load-hoy',
        questionText: '২০. প্যারালাল রেজিস্টারে (Parallel Register) ডেটা কীভাবে লোড হয়?',
        optionA: 'এক বিট করে ক্রমানুসারে',
        optionB: 'সব বিট একসাথে',
        optionC: 'দুই বিট করে',
        optionD: 'র্যান্ডমলি',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) সব বিট একসাথে

প্যারালাল রেজিস্টারে সব বিট একসাথে লোড ও পড়া যায় — এটি শিফট রেজিস্টারের বিপরীত।

প্যারালাল রেজিস্টারের বৈশিষ্ট্য:
— সকল ফ্লিপ-ফ্লপের ইনপুট আলাদাভাবে সংযুক্ত
— Clock pulse আসলে সব বিট একসাথে পরিবর্তন হয়
— PIPO: Parallel In, Parallel Out
— দ্রুত ডেটা ট্রান্সফারের জন্য উপযুক্ত

ব্যবহারিক প্রয়োগ:
— CPU-এর General Purpose Register (AX, BX, CX, DX)
— Bus Interface-এ ডেটা প্যারালালে পাঠানো
— ALU-তে ইনপুট প্যারালালে দেওয়া

শিফট রেজিস্টারের সাথে তুলনা:
 Parallel: সব বিট একসাথে → দ্রুত কিন্তু বেশি তার
 Serial (Shift): এক বিট করে → ধীর কিন্তু কম তার

উৎস: Digital Logic Design — Mano; NCTB ICT পাঠ্যবই।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Register',
        sortOrder: 20,
      },

      {
        questionSetId,
        slug: 'cpu-te-register-er-kaj-ki',
        questionText: '২১. কম্পিউটারের CPU-তে রেজিস্টারের কাজ কী?',
        optionA: 'স্থায়ীভাবে ডেটা সংরক্ষণ',
        optionB: 'প্রসেসিংয়ের সময় অস্থায়ী ডেটা ধারণ',
        optionC: 'ডেটা ডিসপ্লে করা',
        optionD: 'নেটওয়ার্কে ডেটা পাঠানো',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) প্রসেসিংয়ের সময় অস্থায়ী ডেটা ধারণ

রেজিস্টার হলো CPU-এর ভেতরের সবচেয়ে ক্ষুদ্র কিন্তু দ্রুততম মেমোরি যা প্রসেসিং চলার সময় ডেটা অস্থায়ীভাবে ধারণ করে।

রেজিস্টারের ভূমিকা:
— গণনার মধ্যবর্তী ফলাফল সংরক্ষণ
— Instruction ও Address ধারণ
— RAM-এর চেয়ে অনেকগুণ দ্রুত (nanosecond)

CPU-এর গুরুত্বপূর্ণ রেজিস্টার:
— Accumulator (ACC): মূল গণনার ফলাফল রাখে
— Program Counter (PC): পরবর্তী Instruction-এর ঠিকানা রাখে
— Instruction Register (IR): বর্তমান Instruction রাখে
— Memory Address Register (MAR): মেমোরি ঠিকানা রাখে
— Memory Buffer Register (MBR): মেমোরি থেকে আসা ডেটা রাখে

মেমোরি হায়ারার্কি (দ্রুততম থেকে ধীর):
 Register > Cache > RAM > ROM > HDD/SSD

উৎস: Computer Organization — Tanenbaum; NCTB ICT পাঠ্যবই।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Register',
        sortOrder: 21,
      },

      // ─── Counter ───
      {
        questionSetId,
        slug: 'counter-er-kaj-ki',
        questionText: '২২. কাউন্টারের (Counter) মূল কাজ কী?',
        optionA: 'ডেটা যোগ করা',
        optionB: 'ক্লক পালস গণনা করা',
        optionC: 'ডেটা সংরক্ষণ করা',
        optionD: 'ডেটা এনকোড করা',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) ক্লক পালস গণনা করা

কাউন্টার ডিজিটাল সার্কিটে আসা Clock Pulse-এর সংখ্যা গণনা করে বাইনারি সংখ্যায় প্রকাশ করে।

কাউন্টারের বিস্তারিত কাজ:
— প্রতিটি Clock pulse আসলে কাউন্টারের আউটপুট ১ বৃদ্ধি পায় (Up Counter)
— বা ১ হ্রাস পায় (Down Counter)
— নির্দিষ্ট সংখ্যায় পৌঁছালে পুনরায় শুরু থেকে শুরু হয়

কাউন্টারের প্রকারভেদ:
— Ripple Counter (Asynchronous): প্রথম FF-এর আউটপুট পরবর্তীর Clock হিসেবে কাজ করে
— Synchronous Counter: সব FF একই Clock দ্বারা নিয়ন্ত্রিত
— Up Counter: গণনা বাড়ে (0,1,2,3...)
— Down Counter: গণনা কমে (...3,2,1,0)
— Ring Counter: বিট সার্কুলার করে ঘোরে

ব্যবহার:
— ডিজিটাল ঘড়িতে সময় গণনায়
— ফ্রিকোয়েন্সি ডিভাইডার হিসেবে
— কম্পিউটারে Program Counter হিসেবে

উৎস: NCTB ICT পাঠ্যবই; বিগত NTRCA প্রশ্নব্যাংক।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Counter',
        sortOrder: 22,
      },

      {
        questionSetId,
        slug: 'ripple-counter-ke-ki-bole',
        questionText: '২৩. রিপল কাউন্টারকে (Ripple Counter) অন্যভাবে কী বলা হয়?',
        optionA: 'Synchronous Counter',
        optionB: 'Asynchronous Counter',
        optionC: 'Ring Counter',
        optionD: 'Johnson Counter',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) Asynchronous Counter

রিপল কাউন্টারকে Asynchronous Counter বলা হয় কারণ সব ফ্লিপ-ফ্লপ একই সময়ে Clock পালস গ্রহণ করে না।

Ripple (Asynchronous) Counter-এর কার্যপদ্ধতি:
— প্রথম ফ্লিপ-ফ্লপ সরাসরি বাইরের Clock গ্রহণ করে
— প্রথম FF-এর আউটপুট দ্বিতীয় FF-এর Clock হিসেবে কাজ করে
— এভাবে প্রতিটি FF পূর্ববর্তীটির আউটপুট থেকে Clock নেয়
— Clock পরিবর্তন ঢেউয়ের মতো (Ripple) ছড়িয়ে পড়ে — তাই Ripple Counter

Synchronous Counter-এর পার্থক্য:
— সব ফ্লিপ-ফ্লপ একই সময়ে Clock পায়
— দ্রুততর কিন্তু জটিলতর বর্তনী
— Propagation delay কম

Ripple Counter-এর সুবিধা ও অসুবিধা:
 সুবিধা: সহজ বর্তনী, কম কম্পোনেন্ট
 অসুবিধা: Propagation delay বেশি, উচ্চ গতিতে ত্রুটি হতে পারে

উৎস: Digital Logic Design — Mano; NTRCA বিগত প্রশ্নব্যাংক।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Counter',
        sortOrder: 23,
      },

      {
        questionSetId,
        slug: 'synchronous-counter-e-sob-ff-eki-clock-pay',
        questionText:
          '২৪. সিনক্রোনাস কাউন্টারে (Synchronous Counter) সব ফ্লিপ-ফ্লপ কীভাবে নিয়ন্ত্রিত হয়?',
        optionA: 'ভিন্ন ভিন্ন Clock দ্বারা',
        optionB: 'একই Clock দ্বারা',
        optionC: 'পূর্ববর্তী FF-এর আউটপুট দ্বারা',
        optionD: 'ম্যানুয়ালি',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) একই Clock দ্বারা

সিনক্রোনাস কাউন্টারে সকল ফ্লিপ-ফ্লপ একই সময়ে একই Clock Signal গ্রহণ করে — এজন্য একে Parallel Counter-ও বলা হয়।

Synchronous Counter-এর বৈশিষ্ট্য:
— সব FF একই External Clock পায়
— সব FF একই সময়ে অবস্থা পরিবর্তন করে
— Propagation Delay: শুধুমাত্র একটি FF-এর delay (সবার সমান)
— দ্রুত গতির সার্কিটে ব্যবহার উপযোগী

Ripple Counter-এর সাথে তুলনা:
 Ripple: FF₁-এর আউটপুট → FF₂-এর clock
 Synchronous: সব FF → একই external clock

Synchronous Counter-এর সুবিধা:
— দ্রুততর (কম propagation delay)
— নির্ভরযোগ্য ও সঠিক গণনা
— উচ্চ ফ্রিকোয়েন্সিতে কার্যকর

অসুবিধা:
— বর্তনী জটিল ও ব্যয়বহুল
— বেশি Logic Gate দরকার

উৎস: Digital Electronics — Floyd; NCTB ICT পাঠ্যবই; NTRCA প্রশ্নব্যাংক।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Counter',
        sortOrder: 24,
      },

      {
        questionSetId,
        slug: '3-bit-binary-counter-koto-porjonto-gonona-kore',
        questionText: '২৫. একটি 3-বিট বাইনারি কাউন্টার সর্বোচ্চ কত পর্যন্ত গণনা করতে পারে?',
        optionA: '৩',
        optionB: '৬',
        optionC: '৭',
        optionD: '৮',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) ৭

n-বিট কাউন্টারের সর্বোচ্চ মান = 2ⁿ - 1। 3-বিটের জন্য = 2³ - 1 = 8 - 1 = 7।

3-বিট বাইনারি কাউন্টারের গণনাক্রম:
 000 = 0
 001 = 1
 010 = 2
 011 = 3
 100 = 4
 101 = 5
 110 = 6
 111 = 7
→ পুনরায় 000 = 0

মোট অবস্থা: 2³ = 8 টি (0 থেকে 7)
সর্বোচ্চ মান: 2³ - 1 = 7

গুরুত্বপূর্ণ সূত্র মনে রাখুন:
— n-বিট কাউন্টারের মোট অবস্থা = 2ⁿ
— সর্বোচ্চ মান = 2ⁿ - 1
— MOD number = 2ⁿ (3-বিট → MOD-8)

বিভিন্ন বিটের জন্য:
— 2-বিট: 0-3 (MOD-4)
— 3-বিট: 0-7 (MOD-8)
— 4-বিট: 0-15 (MOD-16)

উৎস: NCTB ICT পাঠ্যবই; বিগত NTRCA ও BCS প্রশ্নব্যাংক।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Counter',
        sortOrder: 25,
      },

      {
        questionSetId,
        slug: '4-bit-counter-koto-porzonto-gonona-kore',
        questionText: '২৬. একটি 4-বিট বাইনারি কাউন্টারের Modulus সংখ্যা কত?',
        optionA: '৮',
        optionB: '১২',
        optionC: '১৬',
        optionD: '৩২',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) ১৬

n-বিট কাউন্টারের Modulus = 2ⁿ। 4-বিটের জন্য = 2⁴ = 16।

Modulus মানে কী:
— কাউন্টারটি মোট কতটি ভিন্ন অবস্থায় থাকতে পারে
— 4-বিট: 0000 থেকে 1111 → 0 থেকে 15 পর্যন্ত → মোট 16 অবস্থা

বিভিন্ন বিটের Modulus:
— 2-বিট: MOD-4 (0-3)
— 3-বিট: MOD-8 (0-7)
— 4-বিট: MOD-16 (0-15)
— 8-বিট: MOD-256 (0-255)

ফ্লিপ-ফ্লপ সংখ্যা বের করার সূত্র:
— প্রয়োজনীয় FF সংখ্যা n = ⌈log₂(N)⌉
— N = কাঙ্ক্ষিত Modulus
— MOD-10 → log₂(10) ≈ 3.32 → ⌈3.32⌉ = 4টি FF

গুরুত্বপূর্ণ: 4-বিট কাউন্টার সর্বোচ্চ 15 পর্যন্ত গণনা করে, MOD-16 অর্থে 16টি অবস্থা।

উৎস: Digital Logic — Tocci; NTRCA বিগত প্রশ্নব্যাংক।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Counter',
        sortOrder: 26,
      },

      {
        questionSetId,
        slug: 'mod-10-counter-kota-porzonto-gon-kore',
        questionText: '২৭. MOD-10 কাউন্টার কত পর্যন্ত গণনা করে পুনরায় শুরু করে?',
        optionA: '০ থেকে ১০',
        optionB: '০ থেকে ৯',
        optionC: '১ থেকে ১০',
        optionD: '০ থেকে ১৬',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) ০ থেকে ৯

MOD-10 কাউন্টার 0 থেকে 9 পর্যন্ত গণনা করে — অর্থাৎ মোট 10টি অবস্থা। 10-এ পৌঁছানোর আগেই আবার 0-তে ফিরে যায়।

MOD সংখ্যা বোঝার নিয়ম:
— MOD-N কাউন্টার = N টি অবস্থা থাকে (0 থেকে N-1)
— MOD-2 → 0,1 (2 অবস্থা)
— MOD-8 → 0 থেকে 7 (8 অবস্থা)
— MOD-10 → 0 থেকে 9 (10 অবস্থা)
— MOD-16 → 0 থেকে 15 (16 অবস্থা)

MOD-10 কাউন্টারের বিশেষ নাম:
— Decade Counter বলা হয় (দশমিক গণনার জন্য)
— BCD Counter বলেও পরিচিত (Binary Coded Decimal)
— ডিজিটাল ঘড়িতে সেকেন্ড, মিনিট গণনায় ব্যবহৃত হয়

ফ্লিপ-ফ্লপ সংখ্যা নির্ণয়:
— MOD-10 এর জন্য 4টি FF লাগে (কারণ 2³=8 < 10 ≤ 2⁴=16)

উৎস: Digital Electronics — Floyd; বিগত NTRCA ১৫তম-১৭তম প্রশ্নব্যাংক।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Counter',
        sortOrder: 27,
      },

      {
        questionSetId,
        slug: 'decade-counter-er-onyo-naam-ki',
        questionText: '২৮. Decade Counter-এর অন্য নাম কী?',
        optionA: 'MOD-8 Counter',
        optionB: 'BCD Counter',
        optionC: 'Ring Counter',
        optionD: 'Binary Counter',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) BCD Counter

Decade Counter-কে BCD Counter (Binary Coded Decimal Counter) বলা হয় কারণ এটি 0 থেকে 9 পর্যন্ত গণনা করে — যা BCD-এর পরিসর।

Decade Counter = BCD Counter = MOD-10 Counter:
— MOD-10 অর্থাৎ 10টি অবস্থা (0 থেকে 9)
— BCD কারণ প্রতিটি সংখ্যা 4-বিট বাইনারিতে প্রকাশিত
— 10 পৌঁছানোর আগেই 0-তে Reset হয়

BCD কোড সংখ্যা:
 0000=0, 0001=1, 0010=2, 0011=3, 0100=4
 0101=5, 0110=6, 0111=7, 1000=8, 1001=9
 (1010 থেকে 1111 → অবৈধ BCD কোড)

ডিজিটাল ঘড়িতে ব্যবহার:
— সেকেন্ডের একক অঙ্ক: MOD-10 (0-9)
— সেকেন্ডের দশক অঙ্ক: MOD-6 (0-5)
— মিনিট: MOD-10 × MOD-6

উৎস: Digital Electronics — Floyd; বিগত NTRCA ১৬তম-১৮তম প্রশ্নব্যাংক।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Counter',
        sortOrder: 28,
      },

      {
        questionSetId,
        slug: 'ring-counter-e-kita-bit-ek-samaye-high-thake',
        questionText: '২৯. রিং কাউন্টারে (Ring Counter) কতটি বিট সবসময় HIGH (1) থাকে?',
        optionA: 'সবগুলো',
        optionB: 'অর্ধেক',
        optionC: 'মাত্র একটি',
        optionD: 'কোনোটি নয়',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) মাত্র একটি

রিং কাউন্টারে যেকোনো সময়ে শুধুমাত্র একটি ফ্লিপ-ফ্লপের আউটপুট HIGH (1) থাকে এবং বাকিগুলো LOW (0)।

রিং কাউন্টারের কার্যনীতি:
— n টি ফ্লিপ-ফ্লপ সার্কুলার (বৃত্তাকার) লুপে সংযুক্ত
— শেষ FF-এর আউটপুট প্রথম FF-এর ইনপুটে ফিরে আসে
— প্রতিটি Clock pulse-এ HIGH বিটটি পরবর্তী FF-এ শিফট হয়

4-বিট রিং কাউন্টারের গণনা:
 1000 → 0100 → 0010 → 0001 → 1000 → ...

রিং কাউন্টারের বৈশিষ্ট্য:
— n টি FF থাকলে MOD-n কাউন্টার হয়
— শুধু একটি 1 বিট সার্কুলার ঘোরে
— Johnson Counter থেকে আলাদা (Johnson-এ অর্ধেক HIGH থাকে)

Johnson কাউন্টার পার্থক্য:
— Johnson Counter-এ শেষ FF-এর Q' (বিপরীত) প্রথমে ঢোকে
— 4-বিট Johnson Counter → MOD-8 (রিং-এর দ্বিগুণ)

উৎস: Digital Electronics — Malvino; NCTB ICT বই।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Counter',
        sortOrder: 29,
      },

      {
        questionSetId,
        slug: 'johnson-counter-er-modulus-ki',
        questionText: '৩০. n টি ফ্লিপ-ফ্লপ দিয়ে তৈরি Johnson Counter-এর Modulus কত?',
        optionA: 'n',
        optionB: '2n',
        optionC: '2ⁿ',
        optionD: 'n²',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) 2n

Johnson Counter-এর Modulus = 2n — অর্থাৎ একই সংখ্যক ফ্লিপ-ফ্লপ দিয়ে Ring Counter-এর দ্বিগুণ অবস্থা তৈরি করা যায়।

Johnson Counter ও Ring Counter তুলনা:
 n টি FF দিয়ে Ring Counter → MOD-n
 n টি FF দিয়ে Johnson Counter → MOD-2n

Johnson Counter-এর কার্যনীতি:
— শেষ ফ্লিপ-ফ্লপের Q' (বিপরীত আউটপুট) প্রথম FF-এর ইনপুটে ফিরে আসে
— Ring Counter-এ Q (সরাসরি) ফিরে আসত

4-বিট Johnson Counter উদাহরণ (MOD-8):
 0000→1000→1100→1110→1111→0111→0011→0001→0000

Johnson Counter-এর বৈশিষ্ট্য:
— Glitch-free ডিকোডিং সম্ভব
— বর্তনী সনাক্ত করতে কম AND গেট লাগে
— ডিজিটাল ঘড়ি ও ফেজ জেনারেটরে ব্যবহৃত

উৎস: Digital Electronics — Malvino & Bates; NTRCA বিগত প্রশ্নব্যাংক।`,
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        topic: 'Digital Devices',
        subTopic: 'Counter',
        sortOrder: 30,
      },
    ],

    /*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
সারসংক্ষেপ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
মোট প্রশ্ন: ৬১টি (প্রদত্ত সকল প্রশ্নের সমাধান)

বিষয় অনুযায়ী বিভাজন:
  বাংলা ভাষা ও সাহিত্য: ২০টি (প্রশ্ন ০১-২০)
  ইংরেজি: ২১টি (প্রশ্ন ২১-৪১)
  বাংলাদেশ বিষয়াবলি: ২০টি (প্রশ্ন ৪২-৬১)

পরীক্ষা: ৪৮তম (বিশেষ) বিসিএস
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Source Note:
    // বাংলা সাহিত্যের ইতিহাস ও বিগত BCS প্রশ্নব্যাংক
    // বিসিএস প্রিলিতে বাংলা সাহিত্যে রবীন্দ্রনাথ ঠাকুর থেকে
    // সর্বাধিক প্রশ্ন আসে (বিগত বিসিএসগুলোতে প্রায় ৫২টি
    // প্রশ্ন এসেছে)। গীতাঞ্জলি, গোরা, রক্তকরবী সহ মূল
    // রচনাগুলো ভালোভাবে আয়ত্ত করুন।
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    skipDuplicates: true,
  });
  console.log('✓ Mock questions seeded for cmoci32r80003uxxkx4j3uelc');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
