import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const questionSetId = 'cmoe2v7rw0005uxysg5u432nb';

async function main() {
  // Seed mock questions
  await prisma.question.createMany({
    data: [
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // পর্ব ১: NOUN (প্রশ্ন ১–১০)
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      {
        questionSetId,
        questionText: "1. What kind of noun is the word 'river'?",
        optionA: 'Proper Noun',
        optionB: 'Common Noun',
        optionC: 'Collective Noun',
        optionD: 'Abstract Noun',
        correctAnswer: 'B',
        explanation:
          "সঠিক উত্তর: (b) Common Noun।\n\nসংজ্ঞা: যে Noun দ্বারা একই শ্রেণির ব্যক্তি, বস্তু বা প্রাণীর সাধারণ নাম বোঝায়, তাকে Common Noun বলে।\n\nবিশ্লেষণ: 'river' শব্দটি কোনো নির্দিষ্ট নদীর নাম (যেমন: Padma, Amazon) না বুঝিয়ে সাধারণ একটি জলভাগকে বোঝায়।\n\nচারটি অপশনের পার্থক্য:\n— Proper Noun: Padma, Nile, Amazon (নির্দিষ্ট নাম)\n— Common Noun: river, mountain, city (সাধারণ নাম) ✓\n— Collective Noun: fleet, army, crowd (সমষ্টি)\n— Abstract Noun: love, beauty, courage (গুণ বা অবস্থা)\n\nউৎস: Wren & Martin — High School English Grammar & Composition।",
        subject: 'English',
        sortOrder: 1,
      },
      {
        questionSetId,
        questionText: "2. 'Come on, it's time to go home.' Here 'home' is a/an—",
        optionA: 'Adjective',
        optionB: 'Adverb',
        optionC: 'Noun',
        optionD: 'Preposition',
        correctAnswer: 'C',
        explanation:
          "সঠিক উত্তর: (c) Noun।\n\nবিশ্লেষণ: 'It's time to go home' বাক্যে 'home' শব্দটি Noun হিসেবে ব্যবহৃত হয়েছে। এটি মূলত গন্তব্যস্থল — উহ্য Preposition এর Object (go to home → go home)।\n\nমূল পার্থক্য জানুন:\n— 'He went home' — এখানে 'home' একটি Adverb ('went'-কে modify করছে)।\n— 'It's time to go home' — এখানে 'home' হলো Noun (পৌঁছানোর গন্তব্য)।\n\n✗ Adjective নয়: 'home' এখানে কোনো Noun-কে modify করছে না।\n✗ Preposition নয়: 'home' এর পরে কোনো Noun বা Pronoun নেই।\n\nউৎস: Oxford Advanced Learner's Dictionary।",
        subject: 'English',
        sortOrder: 2,
      },
      {
        questionSetId,
        questionText: '3. Which of the following is an example of an Abstract Noun?',
        optionA: 'Flock',
        optionB: 'Child',
        optionC: 'Kindness',
        optionD: 'London',
        correctAnswer: 'C',
        explanation:
          "সঠিক উত্তর: (c) Kindness।\n\nসংজ্ঞা: যে Noun দ্বারা কোনো গুণ, অবস্থা, কাজ বা ধারণার নাম বোঝায় এবং যা পঞ্চ ইন্দ্রিয় দ্বারা দেখা বা ছোঁয়া যায় না, তাকে Abstract Noun বলে।\n\nঅপশন বিশ্লেষণ:\n— Kindness (দয়া): একটি গুণের নাম, দেখা বা ছোঁয়া যায়বিধা → Abstract Noun ✓\n— Flock (পাল): সমষ্টি বোঝায় → Collective Noun ✗\n— Child (শিশু): সাধারণ নাম → Common Noun ✗\n— London: নির্দিষ্ট শহরের নাম → Proper Noun ✗\n\nমনে রাখার ট্রিক: 'অনুভব করা যায় কিন্তু ছোঁয়া যায় না' — সেটিই Abstract Noun।\nঅন্যান্য উদাহরণ: Courage, Honesty, Freedom, Love, Wisdom, Childhood।\n\nউৎস: Wren & Martin — High School English Grammar & Composition।",
        subject: 'English',
        sortOrder: 3,
      },
      {
        questionSetId,
        questionText: '4. Which one of the following is a Collective Noun?',
        optionA: 'Happiness',
        optionB: 'Jury',
        optionC: 'Teacher',
        optionD: 'Dhaka',
        correctAnswer: 'B',
        explanation:
          'সঠিক উত্তর: (b) Jury।\n\nসংজ্ঞা: যে Noun দ্বারা কোনো ব্যক্তি, বস্তু বা প্রাণীর সমষ্টিকে একত্রে একটি হিসেবে বোঝায়, তাকে Collective Noun বলে।\n\nঅপশন বিশ্লেষণ:\n— Jury (বিচারকমণ্ডলী): একদল বিচারকের সমষ্টি → Collective Noun ✓\n— Happiness (সুখ): অবস্থা বা গুণ → Abstract Noun ✗\n— Teacher (শিক্ষক): সাধারণ নাম → Common Noun ✗\n— Dhaka: নির্দিষ্ট নাম → Proper Noun ✗\n\nগুরুত্বপূর্ণ Collective Nouns:\n— মানুষ: army, crew, team, committee, audience, cabinet, jury\n— প্রাণী: flock (ভেড়া/পাখি), herd (গবাদি পশু), pack (নেকড়ে), pride (সিংহ)\n— বস্তু: bunch (চাবি/ফুল), fleet (জাহাজ), bundle (কাঠি)\n\nউৎস: Wren & Martin — High School English Grammar & Composition।',
        subject: 'English',
        sortOrder: 4,
      },
      {
        questionSetId,
        questionText: '5. Which one of the following is a Common Gender noun?',
        optionA: 'King',
        optionB: 'Queen',
        optionC: 'Monarch',
        optionD: 'Drake',
        correctAnswer: 'C',
        explanation:
          'সঠিক উত্তর: (c) Monarch।\n\nসংজ্ঞা: যে Noun দ্বারা পুরুষ ও স্ত্রী উভয়কেই বোঝানো যায়, তাকে Common Gender বলে।\n\nঅপশন বিশ্লেষণ:\n— Monarch (রাজা বা রানি): পুরুষ (King) বা নারী (Queen) যেকোনো সম্রাটকে বোঝাতে পারে → Common Gender ✓\n— King (রাজা): শুধুমাত্র পুরুষ → Masculine Gender ✗\n— Queen (রানি): শুধুমাত্র নারী → Feminine Gender ✗\n— Drake (মদ্দা হাঁস): পুরুষ হাঁস → Masculine Gender ✗\n\nCheat Sheet — চার ধরনের Gender:\n1. Masculine: king, actor, hero, lion\n2. Feminine: queen, actress, heroine, lioness\n3. Common: teacher, student, doctor, monarch, parent, sovereign ✓\n4. Neuter: table, book, stone, water (জড়বস্তু)\n\nউৎস: Wren & Martin — High School English Grammar & Composition।',
        subject: 'English',
        sortOrder: 5,
      },
      {
        questionSetId,
        questionText: "6. The plural form of 'phenomenon' is—",
        optionA: 'Phenomenons',
        optionB: 'Phenomenas',
        optionC: 'Phenomena',
        optionD: 'Phenomenes',
        correctAnswer: 'C',
        explanation:
          "সঠিক উত্তর: (c) Phenomena।\n\nবিশ্লেষণ: 'Phenomenon' একটি গ্রিক উৎসের শব্দ। গ্রিক শব্দে '-on' দিয়ে শেষ হলে বহুবচনে তা '-a' হয়।\n\nPhenomenon (একবচন) → Phenomena (বহুবচন)\n\n✗ 'Phenomenons' — অশুদ্ধ; গ্রিক শব্দে সরাসরি 's' যোগ করা যায় না।\n✗ 'Phenomenas' — doubly wrong; ইতিমধ্যে plural রূপে আবার 's' যোগ।\n\nগুরুত্বপূর্ণ Irregular Plurals (Greek/Latin উৎস):\n— Criterion → Criteria\n— Medium → Media\n— Datum → Data\n— Curriculum → Curricula\n— Bacterium → Bacteria\n— Alumnus → Alumni\n— Analysis → Analyses\n— Crisis → Crises\n— Thesis → Theses\n\nউৎস: Oxford English Dictionary; Wren & Martin।",
        subject: 'English',
        sortOrder: 6,
      },
      {
        questionSetId,
        questionText: '7. Which sentence uses a Noun correctly as an Adjective?',
        optionA: 'The gold ring shines brightly.',
        optionB: 'She bought golden ring.',
        optionC: 'The ring is gold.',
        optionD: 'Gold was shining.',
        correctAnswer: 'A',
        explanation:
          "সঠিক উত্তর: (a) The gold ring shines brightly।\n\nধারণা (Noun Adjunct): যখন একটি Noun অন্য একটি Noun-এর ঠিক পূর্বে বসে তাকে modify করে, তখন তাকে Noun Adjunct বা Attributive Noun বলে।\n\nবিশ্লেষণ: 'The gold ring' — এখানে 'gold' জন্মগতভাবে Noun, কিন্তু এটি 'ring'-এর পূর্বে বসে বলে দিচ্ছে আংটিটি কীসের তৈরি → Noun used as Adjective ✓\n\n✗ Option (b): 'golden' হলো Adjective (Noun 'gold' থেকে তৈরি), এটি Noun Adjunct নয়।\n✗ Option (c): 'The ring is gold' — এখানে 'gold' Predicate Noun (Subject Complement), Adjunct নয়।\n✗ Option (d): 'Gold was shining' — 'gold' এখানে Subject (Noun), Adjective নয়।\n\nঅন্যান্য Noun Adjunct উদাহরণ: stone wall, school bus, glass door, paper bag।\n\nউৎস: A University Grammar of English – Quirk & Greenbaum।",
        subject: 'English',
        sortOrder: 7,
      },
      {
        questionSetId,
        questionText: "8. Identify the correct plural of 'mother-in-law'.",
        optionA: 'mother-in-laws',
        optionB: 'mothers-in-law',
        optionC: 'mothers-in-laws',
        optionD: 'mother-ins-law',
        correctAnswer: 'B',
        explanation:
          "সঠিক উত্তর: (b) mothers-in-law।\n\nনিয়ম: Compound Noun-এর বহুবচন করার সময় এর মূল বা প্রধান শব্দটির (Head Word) সাথে plural suffix যোগ হয়, পুরো শব্দের শেষে নয়।\n\nবিশ্লেষণ: 'mother-in-law' শব্দটিতে প্রধান শব্দ হলো 'mother'। তাই plural → 'mothers-in-law'।\n\n✗ 'mother-in-laws' — 'law'-এর সাথে 's' যোগ হয়েছে, যা ভুল।\n✗ 'mother-ins-law' — কোনো নিয়ম নেই এভাবে plural করার।\n\nঅন্যান্য গুরুত্বপূর্ণ Compound Noun Plurals:\n— father-in-law → fathers-in-law\n— brother-in-law → brothers-in-law\n— son-in-law → sons-in-law\n— commander-in-chief → commanders-in-chief\n— passer-by → passers-by\n— looker-on → lookers-on\n— man-of-war → men-of-war\n\nউৎস: Wren & Martin; A Practical English Grammar – Thomson & Martinet।",
        subject: 'English',
        sortOrder: 8,
      },
      {
        questionSetId,
        questionText: '9. Which of the following nouns has an identical singular and plural form?',
        optionA: 'Leaf',
        optionB: 'Deer',
        optionC: 'Hero',
        optionD: 'Ox',
        correctAnswer: 'B',
        explanation:
          "সঠিক উত্তর: (b) Deer।\n\nধারণা (Zero Plural): কিছু Noun-এর Singular (একবচন) ও Plural (বহুবচন) রূপ সম্পূর্ণ একই থাকে — এদেরকে Zero Plural বা Invariable Noun বলে।\n\nDeer (হরিণ): একবচন ও বহুবচন উভয়ই 'Deer'।\nউদাহরণ: One deer was grazing. / Many deer were grazing.\n\nঅন্যান্য গুরুত্বপূর্ণ Zero Plural Nouns:\n— Sheep → Sheep\n— Fish → Fish\n— Species → Species\n— Series → Series\n— Aircraft → Aircraft\n— Offspring → Offspring\n— Means → Means\n\nভুল অপশনের সঠিক বহুবচন:\n— Leaf → Leaves (-f/-fe → -ves)\n— Hero → Heroes (-o → -es)\n— Ox → Oxen (সম্পূর্ণ অনিয়মিত)\n\nউৎস: Oxford Advanced Learner's Dictionary; Wren & Martin।",
        subject: 'English',
        sortOrder: 9,
      },
      {
        questionSetId,
        questionText: '10. Which of the following is an Uncountable Noun?',
        optionA: 'Chair',
        optionB: 'Advice',
        optionC: 'Book',
        optionD: 'Pen',
        correctAnswer: 'B',
        explanation:
          "সঠিক উত্তর: (b) Advice।\n\nসংজ্ঞা: যেসব Noun গণনা করা যায় না বরং শুধুমাত্র পরিমাপ বা অনুভব করা যায়, তাদের Uncountable Noun বলে। এদের সাথে 's/es' যোগ করে Plural করা যায় না এবং এদের পূর্বে 'a/an' বসে না।\n\nবিশ্লেষণ:\n— Advice (উপদেশ): একটি ধারণা, যা গোনা যায় না → Uncountable ✓\n— Chair, Book, Pen: একটি, দুটি করে গোনা যায় → Countable ✗\n\n✗ 'an advice' বা 'advices' — দুটিই ভুল।\n✓ 'a piece of advice' — এভাবেই গণনাযোগ্য করে বলতে হয়।\n\nগুরুত্বপূর্ণ Uncountable Nouns (সবচেয়ে বেশি ভুল হওয়া):\nInformation, Furniture, Machinery, Scenery, Poetry, Hair, Baggage, Luggage, Equipment, Knowledge, News, Progress, Homework.\n\nউৎস: Wren & Martin; Raymond Murphy — English Grammar in Use।",
        subject: 'English',
        sortOrder: 10,
      },

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // পর্ব ২: PRONOUN (প্রশ্ন ১১–২০)
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      {
        questionSetId,
        questionText: "11. 'Who's that?' In this sentence 'that' is a/an—",
        optionA: 'Adjective',
        optionB: 'Relative Pronoun',
        optionC: 'Demonstrative Pronoun',
        optionD: 'Interrogative Pronoun',
        correctAnswer: 'C',
        explanation:
          "সঠিক উত্তর: (c) Demonstrative Pronoun।\n\nসংজ্ঞা: যে Pronoun কোনো ব্যক্তি বা বস্তুকে নির্দিষ্ট করে নির্দেশ করে, তাকে Demonstrative Pronoun বলে। (this, that, these, those)\n\nমূল পার্থক্য — এটি BCS-এর সবচেয়ে Tricky পার্থক্যগুলোর একটি:\n\n✓ Demonstrative Pronoun: 'That' একাকী বসে, পরে কোনো Noun নেই।\n   উদাহরণ: 'Who's that?' — 'that' নিজেই Subject-এর স্থানে বসেছে।\n\n✗ Demonstrative Adjective: 'That'-এর পরে Noun থাকে।\n   উদাহরণ: 'That book is mine.' — 'that' এখানে 'book'-কে modify করছে।\n\nবিশ্লেষণ: 'Who's that?' বাক্যে 'that' একাকী বসে একটি অজ্ঞাত ব্যক্তিকে নির্দেশ করছে → Demonstrative Pronoun ✓\n\nউৎস: Wren & Martin; Oxford English Grammar – Sidney Greenbaum।",
        subject: 'English',
        sortOrder: 11,
      },
      {
        questionSetId,
        questionText: '12. Choose the correct sentence using a Reflexive Pronoun.',
        optionA: 'He hurt him while playing.',
        optionB: 'He hurt himself while playing.',
        optionC: 'He hurt his while playing.',
        optionD: 'He hurt oneself while playing.',
        correctAnswer: 'B',
        explanation:
          "সঠিক উত্তর: (b) He hurt himself while playing।\n\nসংজ্ঞা: বাক্যের Subject এবং Object যখন একই ব্যক্তি বা বস্তু হয়, তখন Object হিসেবে Reflexive Pronoun ব্যবহৃত হয় (myself, yourself, himself, herself, itself, ourselves, yourselves, themselves)।\n\nঅপশন বিশ্লেষণ:\n— (b) 'He hurt himself' — Subject (He) ও Object (himself) একই ব্যক্তি ✓\n— (a) 'He hurt him' — 'him' মানে ভিন্ন একজন ব্যক্তি, একই ব্যক্তি নয় ✗\n— (c) 'He hurt his' — 'his' হলো Possessive Adjective, Object হিসেবে ব্যবহারযোগ্য নয় ✗\n— (d) 'He hurt oneself' — Pronoun agreement ভুল। 'He' (3rd person singular) হলে 'himself' বসবে, 'oneself' নয় ✗\n\nReflexive Pronoun-এর দুটি ব্যবহার:\n1. Reflexive: I cut myself. (কাজটি নিজের উপরে)\n2. Emphatic: I myself wrote it. (জোর দেওয়ার জন্য)\n\nউৎস: A Practical English Grammar – Thomson & Martinet।",
        subject: 'English',
        sortOrder: 12,
      },
      {
        questionSetId,
        questionText: '13. Which sentence contains an Interrogative Pronoun?',
        optionA: 'The man who called was my uncle.',
        optionB: 'Who called you last night?',
        optionC: 'I know who you are.',
        optionD: 'That is the person who won.',
        correctAnswer: 'B',
        explanation:
          "সঠিক উত্তর: (b) Who called you last night?\n\nসংজ্ঞা: যে Pronoun দ্বারা সরাসরি প্রশ্ন করা হয়, তাকে Interrogative Pronoun বলে। (who, whom, whose, which, what)\n\nএকই শব্দ (who, which, what) ভিন্ন প্রসঙ্গে ভিন্ন ধরনের Pronoun হতে পারে:\n\n— (b) 'Who called you last night?' — সরাসরি প্রশ্ন → Interrogative Pronoun ✓\n— (a) 'The man who called was my uncle.' — দুটি clause যুক্ত করছে → Relative Pronoun ✗\n— (c) 'I know who you are.' — Noun clause তৈরি করছে, সরাসরি প্রশ্ন নয় → Relative Pronoun ✗\n— (d) 'That is the person who won.' — Relative Pronoun ✗\n\nInterrogative Pronouns:\n— Who: Subject প্রশ্নে (Who did this?)\n— Whom: Object প্রশ্নে (Whom did you see?)\n— Whose: অধিকার প্রশ্নে (Whose is this?)\n— Which: সীমিত বিকল্পে (Which do you want?)\n— What: উন্মুক্ত প্রশ্নে (What happened?)\n\nউৎস: Oxford English Grammar – Sidney Greenbaum।",
        subject: 'English',
        sortOrder: 13,
      },
      {
        questionSetId,
        questionText:
          "14. Choose the correct pronoun: 'Each of the students must bring __ own notebook.'",
        optionA: 'their',
        optionB: 'his or her',
        optionC: 'its',
        optionD: 'our',
        correctAnswer: 'B',
        explanation:
          "সঠিক উত্তর: (b) his or her।\n\nনিয়ম: Indefinite Pronoun যেমন— each, every, anyone, everyone, someone, nobody, either, neither — এগুলো সবসময় Singular (একবচন) হিসেবে গণ্য হয়। তাই এদের সাথে ব্যবহৃত Pronoun বা Verb-ও Singular হতে হবে।\n\nবিশ্লেষণ: 'Each of the students' — Subject হলো 'Each' (Singular)। তাই সঠিক Pronoun হবে Singular: 'his or her'।\n\nFormal Grammar-এ গ্রহণযোগ্য: 'his or her' ✓\nInformal English-এ প্রচলিত: 'their' (কিন্তু BCS পরীক্ষায় Formal rule প্রযোজ্য)\n\n✗ 'its' — জড়বস্তু বা প্রাণীর জন্য; মানুষের জন্য নয়।\n✗ 'our' — 1st person plural, প্রসঙ্গ অনুযায়ী ভুল।\n\nঅন্য Singular Indefinite Pronouns: everybody, somebody, anybody, nobody, either, neither।\n\nউৎস: Advanced English Grammar – Martin Hewings (Cambridge University Press)।",
        subject: 'English',
        sortOrder: 14,
      },
      {
        questionSetId,
        questionText:
          "15. Identify the Relative Pronoun in: 'The book that she recommended turned out to be very helpful.'",
        optionA: 'she',
        optionB: 'that',
        optionC: 'very',
        optionD: 'The',
        correctAnswer: 'B',
        explanation:
          "সঠিক উত্তর: (b) that।\n\nসংজ্ঞা: যে Pronoun পূর্ববর্তী কোনো Noun বা Pronoun (Antecedent)-এর সাথে সম্পর্ক স্থাপন করে এবং দুটি Clause-কে যুক্ত করে, তাকে Relative Pronoun বলে।\n\nবিশ্লেষণ: 'The book [that she recommended]...' বাক্যাংশে:\n— Antecedent: 'book'\n— Relative Pronoun: 'that' — 'book'-কে নির্দেশ করে এবং Relative Clause 'that she recommended'-কে মূল বাক্যের সাথে যুক্ত করেছে।\n\nRelative Pronouns ও তাদের ব্যবহার:\n— who: ব্যক্তির ক্ষেত্রে Subject হিসেবে (The man who called)\n— whom: ব্যক্তির ক্ষেত্রে Object হিসেবে (The man whom I met)\n— whose: অধিকার বোঝাতে (The girl whose bag was stolen)\n— which: বস্তু বা প্রাণীর ক্ষেত্রে (The book which I read)\n— that: ব্যক্তি ও বস্তু উভয়ের ক্ষেত্রে (The book that I read)\n\nউৎস: Raymond Murphy — English Grammar in Use (Cambridge)।",
        subject: 'English',
        sortOrder: 15,
      },
      {
        questionSetId,
        questionText: '16. Which of the following is the correct use of a Possessive Pronoun?',
        optionA: "This is my book — I can't lend my to you.",
        optionB: "This book is my — I won't give it.",
        optionC: "This book is mine — I won't lend it to you.",
        optionD: 'This is mine book — please return it.',
        correctAnswer: 'C',
        explanation:
          "সঠিক উত্তর: (c) This book is mine — I won't lend it to you।\n\nমূল পার্থক্য — Possessive Adjective বনাম Possessive Pronoun:\n\nPossessive Adjective: সর্বদা Noun-এর পূর্বে বসে।\n→ my, your, his, her, its, our, their + NOUN\n→ উদাহরণ: 'my book', 'her bag'\n\nPossessive Pronoun: একাকী বসে, পরে কোনো Noun থাকে না।\n→ mine, yours, his, hers, its, ours, theirs (Standalone)\n→ উদাহরণ: 'This book is mine.'\n\nঅপশন বিশ্লেষণ:\n— (c) 'book is mine' — 'mine' একাকী বসেছে → সঠিক Possessive Pronoun ✓\n— (a) 'lend my to you' — 'my' একাকী ব্যবহার অশুদ্ধ ✗\n— (b) 'book is my' — 'my' একাকী ব্যবহার অশুদ্ধ ✗\n— (d) 'mine book' — 'mine'-এর পরে Noun বসানো যায় না ✗\n\nComplete Chart:\nmy → mine | your → yours | his → his\nher → hers | our → ours | their → theirs\n\nউৎস: Raymond Murphy — English Grammar in Use (Cambridge)।",
        subject: 'English',
        sortOrder: 16,
      },
      {
        questionSetId,
        questionText: "17. Identify the correct verb for the blank: 'It is I who ___ to blame.'",
        optionA: 'am',
        optionB: 'is',
        optionC: 'are',
        optionD: 'was',
        correctAnswer: 'A',
        explanation:
          "সঠিক উত্তর: (a) am।\n\nনিয়ম: Relative Pronoun (who, which, that)-এর পরের Verb সর্বদা সেই Relative Pronoun-এর Antecedent-এর Number ও Person অনুযায়ী হয়।\n\nবিশ্লেষণ: প্রদত্ত বাক্যে 'who'-এর Antecedent হলো 'I' (1st person singular)। ইংরেজিতে Subject 'I' হলে সর্বদা 'am' বসে।\n\n→ সঠিক বাক্য: 'It is I who am to blame.'\n\n✗ 'is' বা 'are' বা 'was' — এগুলো 'I'-এর সাথে বর্তমানকালে ব্যবহারযোগ্য নয়।\n\nএই Pattern মনে রাখুন:\n— It is I who am...\n— It is he who is...\n— It is they who are...\n— It is we who are...\n\nউৎস: Wren & Martin — High School English Grammar & Composition।",
        subject: 'English',
        sortOrder: 17,
      },
      {
        questionSetId,
        questionText: "18. What is the masculine gender of 'Bee'?",
        optionA: 'Drone',
        optionB: 'Wasp',
        optionC: 'Ant',
        optionD: 'Hornet',
        correctAnswer: 'A',
        explanation:
          "সঠিক উত্তর: (a) Drone।\n\nবিশ্লেষণ: 'Bee' (মৌমাছি) শব্দটি সাধারণত Feminine Gender (স্ত্রী-বাচক) হিসেবে ব্যবহৃত হয় (Worker bee বা Queen bee)। এর Masculine Gender রূপ হলো 'Drone' (পুরুষ মৌমাছি)।\n\n✗ Wasp — ভ্রমর, সম্পূর্ণ আলাদা পতঙ্গ।\n✗ Ant — পিঁপড়া, সম্পূর্ণ আলাদা পতঙ্গ।\n✗ Hornet — বড় মৌমাছিজাতীয় পতঙ্গ, কিন্তু Bee-এর Masculine নয়।\n\nগুরুত্বপূর্ণ Animal Gender Pairs:\n— Lion → Lioness\n— Drake (পুরুষ হাঁস) → Duck (স্ত্রী হাঁস)\n— Gander (পুরুষ রাজহাঁস) → Goose\n— Ram (পুরুষ ভেড়া) → Ewe\n— Bull (পুরুষ গরু) → Cow\n— Drone (পুরুষ মৌমাছি) → Bee ✓\n\nউৎস: Wren & Martin — High School English Grammar & Composition।",
        subject: 'English',
        sortOrder: 18,
      },
      {
        questionSetId,
        questionText: "19. '___ of the two boys got a prize.' — Choose the correct Pronoun.",
        optionA: 'Each',
        optionB: 'Every',
        optionC: 'Any',
        optionD: 'Some',
        correctAnswer: 'A',
        explanation:
          "সঠিক উত্তর: (a) Each।\n\nনিয়ম: 'Each' ও 'Every' উভয়ই Distributive অর্থ প্রকাশ করে, কিন্তু এদের ব্যবহারে পার্থক্য আছে।\n\n'Each' এর বৈশিষ্ট্য:\n— দুই বা তার বেশি ব্যক্তি বা বস্তুর ক্ষেত্রে ব্যবহার করা যায়।\n— Pronoun ও Adjective উভয় হিসেবে কাজ করে।\n— 'Each of...' গঠনে সরাসরি ব্যবহার করা যায়। ✓\n\n'Every' এর বৈশিষ্ট্য:\n— তিন বা তার বেশি ব্যক্তি বা বস্তুর ক্ষেত্রে ব্যবহার করা হয়।\n— সবসময় Adjective হিসেবে কাজ করে — সর্বদা Noun-এর পূর্বে বসে।\n— 'Every of...' গঠনটি ইংরেজিতে অশুদ্ধ। ✗\n\nবিশ্লেষণ: 'two boys' উল্লেখ আছে এবং শূন্যস্থানের পর 'of' আছে → 'Each of' ✓\n\nউৎস: A Practical English Grammar – Thomson & Martinet।",
        subject: 'English',
        sortOrder: 19,
      },
      {
        questionSetId,
        questionText: "20. What is the noun form of the word 'beautiful'?",
        optionA: 'Beautify',
        optionB: 'Beauty',
        optionC: 'Beautifully',
        optionD: 'Beauteous',
        correctAnswer: 'B',
        explanation:
          "সঠিক উত্তর: (b) Beauty।\n\nবিশ্লেষণ: 'beautiful' শব্দটির বিভিন্ন Parts of Speech রূপ:\n— Beauty (সৌন্দর্য) → Noun (Abstract Noun) ✓\n— Beautiful (সুন্দর) → Adjective\n— Beautify (সুন্দর করা) → Verb\n— Beautifully (সুন্দরভাবে) → Adverb\n— Beauteous (সুন্দর) → Adjective (কাব্যিক রূপ)\n\nParts of Speech Interchange — গুরুত্বপূর্ণ উদাহরণ সমূহ:\n— happy (adj) → happiness (noun) → happily (adv)\n— strong (adj) → strength (noun) → strengthen (verb)\n— wide (adj) → width (noun) → widen (verb)\n— wise (adj) → wisdom (noun) → wisely (adv)\n— deep (adj) → depth (noun) → deepen (verb)\n\nএই ধরনের Interchange প্রশ্ন BCS, Bank ও NTRCA পরীক্ষায় প্রায়ই আসে।\n\nউৎস: Oxford Dictionary of English; Wren & Martin।",
        subject: 'English',
        sortOrder: 20,
      },
    ],

    skipDuplicates: true,
  });
  console.log('✓ Mock questions seeded for cmoci32r80003uxxkx4j3uelc');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
