import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const questionSetId = 'cmohgd4qj00a8bq01yj62zk1g';

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
      // বিষয়: ইংরেজি (প্রশ্ন ০১–২৫)
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      {
        questionSetId,
        questionText: '১. If I had tried again–',
        optionA: 'I could solve the problem.',
        optionB: 'I could have solved the problem.',
        optionC: 'I could solved the problem.',
        optionD: 'I could have solve the problem.',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) I could have solved the problem.

ব্যাখ্যা: এটি Third Conditional-এর নিয়ম। If যুক্ত clause-টি Past Perfect Tense (had + V3) হলে, অপর (Principal) clause-টিতে subject-এর পর would have/could have/might have + verb-এর past participle (V3) ফর্ম বসে।
এখানে 'If I had tried again' অংশে had + tried (V3) রয়েছে, তাই পরবর্তী অংশে 'could have solved' সঠিক হবে।

উৎস: English Grammar (Conditional Sentences).`,
        subject: 'ইংরেজি',
        topic: 'Grammar',
        subTopic: 'Conditional Sentences',
        sortOrder: 1,
      },
      {
        questionSetId,
        questionText: '২. আজকাল নারীরা জীবনের সর্বক্ষেত্রে গুরুত্বপূর্ণ ভূমিকা পালন করছে।',
        optionA: 'Women are playing important role in all sphere of life.',
        optionB: 'Nowadays women are playing important role everywhere.',
        optionC: 'Women are playing most important roles in all sphere of life.',
        optionD: 'Nowadays women are playing important role in all spheres of life.',
        correctAnswer: 'D',
        explanation: `সঠিক উত্তর: (ঘ) Nowadays women are playing important role in all spheres of life.

ব্যাখ্যা: অনুবাদটির প্রতিটি অংশের বিশ্লেষণ:
- আজকাল = Nowadays
- নারীরা = women
- গুরুত্বপূর্ণ ভূমিকা পালন করছে = are playing important role (Present Continuous Tense)
- জীবনের সর্বক্ষেত্রে = in all spheres of life. (sphere-এর বহুবচন spheres হবে কারণ 'all' এর পর plural countable noun বসে)।
সুতরাং সঠিক অনুবাদ হলো অপশন (ঘ)।`,
        subject: 'ইংরেজি',
        topic: 'Translation',
        subTopic: 'Bengali to English',
        sortOrder: 2,
      },
      {
        questionSetId,
        questionText: '৩. I fancy I (turn) a trifle pale.',
        optionA: 'turned',
        optionB: 'tuns',
        optionC: 'am turning',
        optionD: 'had turned',
        correctAnswer: 'A',
        explanation: `সঠিক উত্তর: (ক) turned

ব্যাখ্যা: বাক্যে fancy, wish, it is time, it is high time ইত্যাদি থাকলে এর পরবর্তী clause-টির verb সর্বদা Past Indefinite Tense-এ হয়। 
যেহেতু এখানে 'I fancy' আছে, তাই পরবর্তী verb 'turn' এর past form 'turned' হবে।`,
        subject: 'ইংরেজি',
        topic: 'Grammar',
        subTopic: 'Right Form of Verbs',
        sortOrder: 3,
      },
      {
        questionSetId,
        questionText: '৪. He fell ––– a trap.',
        optionA: 'of',
        optionB: 'off',
        optionC: 'into',
        optionD: 'out',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) into

ব্যাখ্যা: 'Fall into a trap' একটি Phrase যার অর্থ ফাঁদে পড়া বা বিপদে পতিত হওয়া। 
তাছাড়া বাইরে থেকে ভেতরের দিকে গতিশীলতা বোঝাতে preposition হিসেবে 'into' ব্যবহৃত হয়। এখানে ফাঁদের ভেতরে পড়ার গতিশীলতা বোঝানো হয়েছে।`,
        subject: 'ইংরেজি',
        topic: 'Grammar',
        subTopic: 'Appropriate Prepositions',
        sortOrder: 4,
      },
      {
        questionSetId,
        questionText: '৫. I would rather die–',
        optionA: 'then beg',
        optionB: 'than beg',
        optionC: 'but I would not beg',
        optionD: 'to beg',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) than beg

ব্যাখ্যা: 'Would rather ... than' একটি correlative conjunction যা দুটি কাজের মধ্যে একটিকে বেশি পছন্দ করা বোঝাতে ব্যবহৃত হয়। এর অর্থ 'বরং... তবুও'।
গঠন: Subject + would rather + Verb (base form) + than + Verb (base form)।
তাই বাক্যটি হবে: I would rather die than beg (আমি বরং মরব, তবুও ভিক্ষা করব না)।`,
        subject: 'ইংরেজি',
        topic: 'Grammar',
        subTopic: 'Conjunctions',
        sortOrder: 5,
      },
      {
        questionSetId,
        questionText: '৬. The prince has no ambition ––– the throne.',
        optionA: 'to',
        optionB: 'with',
        optionC: 'of',
        optionD: 'for',
        correctAnswer: 'D',
        explanation: `সঠিক উত্তর: (ঘ) for

ব্যাখ্যা: 'Ambition for' একটি appropriate preposition যার অর্থ 'কোনো কিছুর জন্য উচ্চাকাঙ্ক্ষা'। 
সিংহাসনের প্রতি রাজকুমারের কোনো লোভ বা আকাঙ্ক্ষা নেই বোঝাতে ambition-এর পর 'for' বসবে।`,
        subject: 'ইংরেজি',
        topic: 'Grammar',
        subTopic: 'Appropriate Prepositions',
        sortOrder: 6,
      },
      {
        questionSetId,
        questionText: '৭. Which is the noun of the word wise?',
        optionA: 'Wise',
        optionB: 'Wisdom',
        optionC: 'Wisely',
        optionD: 'Wish',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) Wisdom

ব্যাখ্যা: 'Wise' শব্দটি Adjective, যার অর্থ জ্ঞানী বা প্রজ্ঞাবান।
এর Noun ফর্ম হলো 'Wisdom', যার অর্থ জ্ঞান বা প্রজ্ঞা।
অন্যান্য অপশন:
- Wisely (Adverb) = জ্ঞানীর মতো।
- Wish (Verb/Noun) = ইচ্ছা।`,
        subject: 'ইংরেজি',
        topic: 'Vocabulary',
        subTopic: 'Parts of Speech Interchange',
        sortOrder: 7,
      },
      {
        questionSetId,
        questionText: '৮. Ups and downs means–',
        optionA: 'throughly',
        optionB: 'move upward and downward',
        optionC: 'here and there',
        optionD: 'rise and fall',
        correctAnswer: 'D',
        explanation: `সঠিক উত্তর: (ঘ) rise and fall

ব্যাখ্যা: 'Ups and downs' একটি Idiom যার অর্থ জীবনের উত্থান-পতন বা ভালো-মন্দের পর্যায়।
এর সমার্থক ইংরেজি অর্থ হলো 'rise and fall'।`,
        subject: 'ইংরেজি',
        topic: 'Vocabulary',
        subTopic: 'Idioms and Phrases',
        sortOrder: 8,
      },
      {
        questionSetId,
        questionText: '৯. The verb form of ‘strong’ is–',
        optionA: 'strength',
        optionB: 'strong',
        optionC: 'strengthen',
        optionD: 'stronger',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) strengthen

ব্যাখ্যা: 'Strong' (Adjective) অর্থ শক্তিশালী। 
এর Verb ফর্ম হলো 'Strengthen' (শক্তিশালী করা)। 
এর Noun ফর্ম হলো 'Strength' (শক্তি)।
'Stronger' হলো adjective-এর comparative form।`,
        subject: 'ইংরেজি',
        topic: 'Vocabulary',
        subTopic: 'Parts of Speech Interchange',
        sortOrder: 9,
      },
      {
        questionSetId,
        questionText: '১০. ––– best companions in life.',
        optionA: 'Books are men’s',
        optionB: 'Books are mens',
        optionC: 'Book is mans',
        optionD: 'A book is a man’s',
        correctAnswer: 'A',
        explanation: `সঠিক উত্তর: (ক) Books are men’s

ব্যাখ্যা: প্রবাদ বাক্য "Books are men’s best companions in life" (বই হলো মানুষের জীবনের শ্রেষ্ঠ সঙ্গী)। 
এখানে 'মানুষের' বোঝাতে man-এর বহুবচন men-এর সাথে possessive ('s) যুক্ত হয়ে men's হয়েছে। 'mens' বা 'mans' ব্যাকরণগতভাবে ভুল।`,
        subject: 'ইংরেজি',
        topic: 'Grammar',
        subTopic: 'Proverbs / Syntax',
        sortOrder: 10,
      },
      {
        questionSetId,
        questionText: '১১. তিনি সৎ লোক ছিলেন, তাই না?',
        optionA: 'He was truthful, was he?',
        optionB: 'He was an honest man, did not he?',
        optionC: 'He was really an honest man?',
        optionD: 'He was an honest man, wasn’t he?',
        correctAnswer: 'D',
        explanation: `সঠিক উত্তর: (ঘ) He was an honest man, wasn’t he?

ব্যাখ্যা: বাক্যটি একটি Tag Question। মূল বাক্যটি হলো "তিনি সৎ লোক ছিলেন" যার ইংরেজি "He was an honest man"।
যেহেতু বাক্যটি affirmative এবং auxiliary verb 'was' আছে, তাই এর ট্যাগ হবে negative অর্থাৎ "wasn't he?"।`,
        subject: 'ইংরেজি',
        topic: 'Grammar',
        subTopic: 'Tag Questions & Translation',
        sortOrder: 11,
      },
      {
        questionSetId,
        questionText: '১২. The synonym of ‘incredible’ is–',
        optionA: 'unbelievable',
        optionB: 'unthinkable',
        optionC: 'unlikely',
        optionD: 'un-thinking',
        correctAnswer: 'A',
        explanation: `সঠিক উত্তর: (ক) unbelievable

ব্যাখ্যা: 'Incredible' অর্থ অবিশ্বাস্য (যা বিশ্বাস করা কঠিন)। 
এর সমার্থক শব্দ (Synonym) হলো 'unbelievable'। 
অন্যান্য অপশনের অর্থ: unthinkable (অচিন্তনীয়), unlikely (সম্ভাবনা নেই এমন)।`,
        subject: 'ইংরেজি',
        topic: 'Vocabulary',
        subTopic: 'Synonyms',
        sortOrder: 12,
      },
      {
        questionSetId,
        questionText: '১৩. The antonym of ‘Honorary’ is–',
        optionA: 'official',
        optionB: 'honorable',
        optionC: 'salaried',
        optionD: 'literary',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) salaried

ব্যাখ্যা: 'Honorary' অর্থ অবৈতনিক (বিনা বেতনে সম্মানের সাথে কাজ করা)। 
এর বিপরীত শব্দ (Antonym) হবে 'Salaried' বা 'Paid', যার অর্থ বেতনভুক্ত।`,
        subject: 'ইংরেজি',
        topic: 'Vocabulary',
        subTopic: 'Antonyms',
        sortOrder: 13,
      },
      {
        questionSetId,
        questionText: '১৪. ‘To end in smoke’ means–',
        optionA: 'to create fire',
        optionB: 'to go thorough suffering',
        optionC: 'to come to nothing',
        optionD: 'to see fire',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) to come to nothing

ব্যাখ্যা: 'End in smoke' একটি বহুল প্রচলিত Idiom, যার অর্থ সম্পূর্ণ ব্যর্থ হওয়া বা কোনো ফল না পাওয়া (to produce no positive result)। 
এর সঠিক ইংরেজি অর্থ হলো 'to come to nothing'।`,
        subject: 'ইংরেজি',
        topic: 'Vocabulary',
        subTopic: 'Idioms and Phrases',
        sortOrder: 14,
      },
      {
        questionSetId,
        questionText: '১৫. Kalam is as strong as Salam. (Comparative)',
        optionA: 'Salam is not stronger than Kalam.',
        optionB: 'Salam is stronger than Kalam.',
        optionC: 'Kalam is not stronger than Salam.',
        optionD: 'Kalam is stronger than Salam.',
        correctAnswer: 'A',
        explanation: `সঠিক উত্তর: (ক) Salam is not stronger than Kalam.

ব্যাখ্যা: Positive Degree-তে 'as + adjective + as' যুক্ত Affirmative sentence-কে Comparative Degree করতে হলে:
১. শেষের Subject প্রথমে আসে (Salam)।
২. Verb বসে এবং বাক্যটি Negative হয় (is not)।
৩. Adjective-এর comparative form বসে (stronger)।
৪. than বসে।
৫. প্রথম Subject শেষে বসে (Kalam)।
সুতরাং সঠিক উত্তর: Salam is not stronger than Kalam.`,
        subject: 'ইংরেজি',
        topic: 'Grammar',
        subTopic: 'Degree Transformation',
        sortOrder: 15,
      },
      {
        questionSetId,
        questionText: '১৬. The synonym of ‘Prudent’ is–',
        optionA: 'unwise',
        optionB: 'insightful',
        optionC: 'injudicious',
        optionD: 'impolite',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) insightful

ব্যাখ্যা: 'Prudent' অর্থ বিজ্ঞ, বিচক্ষণ বা দূরদর্শী। 
এর সমার্থক শব্দ হলো 'insightful' (অন্তর্দৃষ্টিসম্পন্ন/বিচক্ষণ), 'wise', 'sagacious'। 
অন্যান্য অপশন: unwise (নির্বোধ), injudicious (অবিবেচক), impolite (অভদ্র) - এগুলো Prudent-এর বিপরীতার্থক।`,
        subject: 'ইংরেজি',
        topic: 'Vocabulary',
        subTopic: 'Synonyms',
        sortOrder: 16,
      },
      {
        questionSetId,
        questionText: '১৭. Without working hard, you can not succeed. (Compound)',
        optionA: 'Word hard and you can not succeed.',
        optionB: 'Work hard or you can not succeed.',
        optionC: 'Work hard and you can succeed.',
        optionD: 'You work hard and you can succeed.',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) Work hard or you can not succeed.

ব্যাখ্যা: Simple Sentence-এ 'Without + V-ing' থাকলে Compound Sentence-এ পরিণত করার সময় Imperative Sentence-এর পর conjunction হিসেবে 'or' বসে এবং পরের clause অপরিবর্তিত থাকে।
অতএব, Without working hard -> Work hard, এরপর or বসে। বাক্য দাঁড়ায়: Work hard or you can not succeed.`,
        subject: 'ইংরেজি',
        topic: 'Grammar',
        subTopic: 'Sentence Transformation',
        sortOrder: 17,
      },
      {
        questionSetId,
        questionText: '১৮. Over-flooding is one of the worst problems in our country. (Positive)',
        optionA: 'Over-flooding is worse than any other problem.',
        optionB: 'No other problem in our country is as bad as over-flooding.',
        optionC: 'Very few problems in our country are as bad as over-flooding.',
        optionD: 'Over-flooding is a very worse problem in our country.',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) Very few problems in our country are as bad as over-flooding.

ব্যাখ্যা: Superlative Degree-তে 'one of the + adjective-এর superlative form' থাকলে Positive Degree করার নিয়ম:
১. Very few দিয়ে শুরু হয়।
২. Superlative-এর পরের অংশের বহুবচন বসে (problems in our country)।
৩. Plural Verb বসে (are)।
৪. as + positive form (bad) + as বসে।
৫. প্রদত্ত subject শেষে বসে (over-flooding)।
worst এর positive form হলো bad.`,
        subject: 'ইংরেজি',
        topic: 'Grammar',
        subTopic: 'Degree Transformation',
        sortOrder: 18,
      },
      {
        questionSetId,
        questionText: '১৯. What can not be cured must be endured. (Active)',
        optionA: 'We must be endured what we can not cure.',
        optionB: 'We can not cure what we must endure.',
        optionC: 'We must endure what we can not cure.',
        optionD: 'Must be endure we care.',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) We must endure what we can not cure.

ব্যাখ্যা: প্রদত্ত বাক্যটি প্যাসিভ ভয়েসে আছে। এর দুটি অংশই প্যাসিভ: 'can not be cured' এবং 'must be endured'। 
এখানে subject উহ্য আছে, যা 'We', 'People' বা 'One' হতে পারে। 
Active করার সময় উভয়াংশের object 'We' কে subject ধরলে:
We + must endure + what + we + can not cure. (যা প্রতিকার করা যায় না তা আমাদের অবশ্যই সহ্য করতে হবে)।`,
        subject: 'ইংরেজি',
        topic: 'Grammar',
        subTopic: 'Voice Change',
        sortOrder: 19,
      },
      {
        questionSetId,
        questionText: '২০. Let us lover our country. (Simple)',
        optionA: 'We should not hate our country.',
        optionB: 'We should love our country.',
        optionC: 'We may not hate our country.',
        optionD: 'Should love our country.',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) We should love our country.

ব্যাখ্যা: 'Let us' যুক্ত Imperative Sentence কে Assertive বা Simple Sentence-এ পরিণত করতে হলে subject হিসেবে 'We' বসে এবং সাহায্যকারী ভাব হিসেবে 'should' বসে।
সুতরাং, Let us love our country -> We should love our country. (আমাদের উচিত আমাদের দেশকে ভালোবাসা)।`,
        subject: 'ইংরেজি',
        topic: 'Grammar',
        subTopic: 'Sentence Transformation',
        sortOrder: 20,
      },
      {
        questionSetId,
        questionText: '২১. Noun form of the word ‘comfortable’ is–',
        optionA: 'comfortably',
        optionB: 'comfort',
        optionC: 'comfortable',
        optionD: 'none',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) comfort

ব্যাখ্যা: 'Comfortable' একটি Adjective যার অর্থ আরামদায়ক।
এর Noun ফর্ম হলো 'Comfort' (আরাম বা স্বস্তি)।
আর 'Comfortably' হলো Adverb।`,
        subject: 'ইংরেজি',
        topic: 'Vocabulary',
        subTopic: 'Parts of Speech Interchange',
        sortOrder: 21,
      },
      {
        questionSetId,
        questionText: '২২. I look forward to (receive) a letter from you.',
        optionA: 'receiving',
        optionB: 'receive',
        optionC: 'received',
        optionD: 'receives',
        correctAnswer: 'A',
        explanation: `সঠিক উত্তর: (ক) receiving

ব্যাখ্যা: সাধারণত 'to' এর পর verb-এর base form বসে। কিন্তু কিছু নির্দিষ্ট Phrase যেমন: look forward to, with a view to, be used to, get used to, addicted to ইত্যাদির পর Verb থাকলে তার সাথে 'ing' যুক্ত হয়। 
তাই look forward to -এর পর receive না হয়ে receiving হবে।`,
        subject: 'ইংরেজি',
        topic: 'Grammar',
        subTopic: 'Right Form of Verbs',
        sortOrder: 22,
      },
      {
        questionSetId,
        questionText: '২৩. He is so dull that–',
        optionA: 'He can understand anything.',
        optionB: 'He could understand anything.',
        optionC: 'He can not understand anything.',
        optionD: 'He could not understand anything.',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) He can not understand anything.

ব্যাখ্যা: 'so...that' এর নিয়মে that-এর পূর্বের clause-টি Present Tense হলে that-এর পরের clause-এ subject-এর পর can not/may not বসে। 
যেহেতু 'He is' (Present Tense), তাই পরের অংশে can not বসবে। 
অর্থ: সে এতই বোকা যে সে কিছুই বুঝতে পারে না।`,
        subject: 'ইংরেজি',
        topic: 'Grammar',
        subTopic: 'Completing Sentences',
        sortOrder: 23,
      },
      {
        questionSetId,
        questionText: '২৪. I have left the room but he (enter) the room.',
        optionA: 'enters',
        optionB: 'entered',
        optionC: 'has entered',
        optionD: 'is entering',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) has entered

ব্যাখ্যা: Compound Sentence-এ 'but' দ্বারা যুক্ত দুটি Clause সাধারণত সমজাতীয় Tense-এর হয়। 
এখানে প্রথম অংশে 'have left' (Present Perfect Tense) রয়েছে, তাই অর্থের সামঞ্জস্য রক্ষার্থে দ্বিতীয় অংশেও Present Perfect Tense 'has entered' হবে। (আমি রুম ত্যাগ করেছি কিন্তু সে রুমে প্রবেশ করেছে)।`,
        subject: 'ইংরেজি',
        topic: 'Grammar',
        subTopic: 'Right Form of Verbs',
        sortOrder: 24,
      },
      {
        questionSetId,
        questionText: '২৫. The man is ––– his son’s fault.',
        optionA: 'blind to',
        optionB: 'blind of',
        optionC: 'blind in',
        optionD: 'blind at',
        correctAnswer: 'A',
        explanation: `সঠিক উত্তর: (ক) blind to

ব্যাখ্যা: 'Blind of/in' অর্থ হলো চোখে অন্ধ (দৃষ্টিশক্তিহীন)। যেমন: He is blind of one eye.
কিন্তু কারও দোষ দেখেও না দেখার ভান করা বা দোষের প্রতি অন্ধ হওয়া বোঝাতে 'Blind to' ব্যবহৃত হয়। 
এখানে লোকটি তার ছেলের দোষের প্রতি অন্ধ, তাই 'blind to' হবে।`,
        subject: 'ইংরেজি',
        topic: 'Grammar',
        subTopic: 'Appropriate Prepositions',
        sortOrder: 25,
      },
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // বিষয়: সাধারণ জ্ঞান (প্রশ্ন ২৬–৫০)
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      {
        questionSetId,
        questionText: '২৬. বাংলাদেশের একমাত্র পাহাড়ি দ্বীপ কোনটি?',
        optionA: 'কুতুবদিয়া',
        optionB: 'ভোলা',
        optionC: 'মহেশখালী',
        optionD: 'সেন্টমার্টিন',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) মহেশখালী

ব্যাখ্যা: বাংলাদেশের একমাত্র পাহাড়ি দ্বীপ হলো কক্সবাজার জেলার অন্তর্গত মহেশখালী। আদিনাথ মন্দির এই দ্বীপেই অবস্থিত। 
অন্যদিকে, সেন্টমার্টিন হলো বাংলাদেশের একমাত্র প্রবাল দ্বীপ এবং ভোলা হলো দেশের বৃহত্তম দ্বীপ।`,
        subject: 'সাধারণ জ্ঞান',
        topic: 'বাংলাদেশ বিষয়াবলি',
        subTopic: 'ভৌগলিক অবস্থান ও দ্বীপসমূহ',
        sortOrder: 26,
      },
      {
        questionSetId,
        questionText: '২৭. বাংলাদেশের যে জেলায় সবচেয়ে বেশি চা বাগান রয়েছে-',
        optionA: 'হবিগঞ্জ',
        optionB: 'মৌলভীবাজার',
        optionC: 'সিলেট',
        optionD: 'কুড়িগ্রাম',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) মৌলভীবাজার

ব্যাখ্যা: বাংলাদেশে সবচেয়ে বেশি চা বাগান রয়েছে মৌলভীবাজার জেলায়। বাংলাদেশের চা বোর্ডের সর্বশেষ তথ্য অনুযায়ী দেশে বর্তমানে ১৬৮টি (মতান্তরে ১৬৭টি) নিবন্ধিত চা বাগান রয়েছে, যার মধ্যে শুধুমাত্র মৌলভীবাজারেই রয়েছে ৯১টি চা বাগান।`,
        subject: 'সাধারণ জ্ঞান',
        topic: 'বাংলাদেশ বিষয়াবলি',
        subTopic: 'কৃষি ও সম্পদ',
        sortOrder: 27,
      },
      {
        questionSetId,
        questionText: '২৮. ভাষা শহিদদের মধ্যে ঢাকা বিশ্ববিদ্যালয়ের ছাত্র ছিলেন-',
        optionA: 'আব্দুস সালাম',
        optionB: 'রফিক উদ্দিন',
        optionC: 'আবুল বরকত',
        optionD: 'সকলেই',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) আবুল বরকত

ব্যাখ্যা: ১৯৫২ সালের ভাষা আন্দোলনে শহিদ আবুল বরকত ঢাকা বিশ্ববিদ্যালয়ের রাষ্ট্রবিজ্ঞান বিভাগের ছাত্র ছিলেন (স্নাতকোত্তর)। 
শহিদ রফিক ছিলেন মানিকগঞ্জের দেবেন্দ্র কলেজের ছাত্র এবং শহিদ সালাম ছিলেন ডিরেক্টরেট অব ইন্ডাস্ট্রিজ বিভাগের পিয়ন।`,
        subject: 'সাধারণ জ্ঞান',
        topic: 'বাংলাদেশ বিষয়াবলি',
        subTopic: 'ভাষা আন্দোলন',
        sortOrder: 28,
      },
      {
        questionSetId,
        questionText: '২৯. বাংলাদেশের প্রথম ডিজিটাল জেলা কোনটি?',
        optionA: 'ঢাকা',
        optionB: 'গাজীপুর',
        optionC: 'যশোর',
        optionD: 'সিলেট',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) যশোর

ব্যাখ্যা: বাংলাদেশের প্রথম ডিজিটাল জেলা হলো যশোর। ২০১২ সালে যশোরকে দেশের প্রথম 'ডিজিটাল জেলা' হিসেবে ঘোষণা করা হয়। এছাড়া দেশের প্রথম ডিজিটাল ইউনিয়ন হলো 'শিকড়িকান্দা' (যশোর)।`,
        subject: 'সাধারণ জ্ঞান',
        topic: 'বাংলাদেশ বিষয়াবলি',
        subTopic: 'তথ্য ও প্রযুক্তি',
        sortOrder: 29,
      },
      {
        questionSetId,
        questionText: '৩০. ‘স্বাধীনতা ও মুক্তিযুদ্ধ’ পুরস্কার- ২০২০ লাভ করেন-',
        optionA: 'আজিজুর রহমান',
        optionB: 'ফেরদৌসী মজুমদার',
        optionC: 'কালীপদ দাস',
        optionD: 'জাফর ওয়াজেদ',
        correctAnswer: 'A',
        explanation: `সঠিক উত্তর: (ক) আজিজুর রহমান

ব্যাখ্যা: ২০২০ সালে স্বাধীনতা ও মুক্তিযুদ্ধ ক্যাটাগরিতে আজিজুর রহমান স্বাধীনতা পুরস্কার লাভ করেন। 
তবে সাম্প্রতিক তথ্য মনে রাখা জরুরি: ২০২৫ সালে মুক্তিযুদ্ধ ও সংস্কৃতির ক্ষেত্রে মরণোত্তর স্বাধীনতা পুরস্কার পেয়েছেন মোহাম্মদ মাহবুবুল হক খান (পপসম্রাট আজম খান)।`,
        subject: 'সাধারণ জ্ঞান',
        topic: 'বাংলাদেশ বিষয়াবলি',
        subTopic: 'জাতীয় পুরস্কার',
        sortOrder: 30,
      },
      {
        questionSetId,
        questionText: '৩১. জাতির জনক শেখ মুজিবুর রহমানকে ‘বঙ্গবন্ধু’ উপাধি দেয়া হয়-',
        optionA: '২৩ মার্চ, ১৯৭১',
        optionB: '২৩ ফেব্রুয়ারি, ১৯৬৯',
        optionC: '২৩ ফেব্রুয়ারি, ১৯৬৭',
        optionD: '২৩ ফেব্রুয়ারি, ১৯৬৬',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) ২৩ ফেব্রুয়ারি, ১৯৬৯

ব্যাখ্যা: আগরতলা ষড়যন্ত্র মামলা থেকে মুক্তি লাভের পর ১৯৬৯ সালের ২৩ ফেব্রুয়ারি ঢাকার রেসকোর্স ময়দানে (বর্তমান সোহরাওয়ার্দী উদ্যান) ছাত্র সংগ্রাম পরিষদ কর্তৃক আয়োজিত এক বিশাল জনসভায় তৎকালীন ডাকসু ভিপি তোফায়েল আহমেদ শেখ মুজিবুর রহমানকে 'বঙ্গবন্ধু' উপাধিতে ভূষিত করেন।`,
        subject: 'সাধারণ জ্ঞান',
        topic: 'বাংলাদেশ বিষয়াবলি',
        subTopic: 'বঙ্গবন্ধু ও মুক্তিযুদ্ধ',
        sortOrder: 31,
      },
      {
        questionSetId,
        questionText: '৩২. ‘সবার জন্য শিক্ষা’ স্লোগানটি বাংলাদেশে প্রচলিত কোন মুদ্রা বহন করে?',
        optionA: '১ টাকা',
        optionB: '২ টাকা',
        optionC: '৫ টাকা',
        optionD: '১০ টাকা',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) ২ টাকা

ব্যাখ্যা: বাংলাদেশে প্রচলিত ২ টাকার ধাতব মুদ্রায় 'সবার জন্য শিক্ষা' স্লোগানটি মুদ্রিত রয়েছে। এর একপাশে বঙ্গবন্ধু শেখ মুজিবুর রহমানের প্রতিকৃতি এবং অপর পাশে সবার জন্য শিক্ষা লোগো ও স্লোগানটি যুক্ত আছে।`,
        subject: 'সাধারণ জ্ঞান',
        topic: 'বাংলাদেশ বিষয়াবলি',
        subTopic: 'অর্থনীতি ও মুদ্রা',
        sortOrder: 32,
      },
      {
        questionSetId,
        questionText: '৩৩. চাকমা জনগোষ্ঠীর লোকসংখ্যা সর্বাধিক কোথায়?',
        optionA: 'রাঙামাটি জেলায়',
        optionB: 'খাগড়াছড়ি জেলায়',
        optionC: 'বান্দরবান জেলায়',
        optionD: 'সিলেট জেলায়',
        correctAnswer: 'A',
        explanation: `সঠিক উত্তর: (ক) রাঙামাটি জেলায়

ব্যাখ্যা: বাংলাদেশের সবচেয়ে বড় উপজাতি বা ক্ষুদ্র নৃ-গোষ্ঠী হলো চাকমা। রাঙামাটি ও খাগড়াছড়ি জেলায় এদের বসবাস বেশি হলেও, সর্বাধিক চাকমা জনগোষ্ঠী বসবাস করে রাঙামাটি জেলায়।`,
        subject: 'সাধারণ জ্ঞান',
        topic: 'বাংলাদেশ বিষয়াবলি',
        subTopic: 'ক্ষুদ্র নৃ-গোষ্ঠী',
        sortOrder: 33,
      },
      {
        questionSetId,
        questionText:
          '৩৪. মিয়ানমারের বিরুদ্ধে রোহিঙ্গাদের উপর গণহত্যা চালানোর অভিযোগে আইসিজেতে মামলা দায়ের করে-',
        optionA: 'গাম্বিয়া',
        optionB: 'সেনেগাল',
        optionC: 'সৌদি আরব',
        optionD: 'কুয়েত',
        correctAnswer: 'A',
        explanation: `সঠিক উত্তর: (ক) গাম্বিয়া

ব্যাখ্যা: মিয়ানমারের সেনাবাহিনীর দ্বারা রোহিঙ্গাদের ওপর চালানো গণহত্যার বিচার চেয়ে পশ্চিম আফ্রিকার দেশ গাম্বিয়া ২০১৯ সালের নভেম্বরে জাতিসংঘের সর্বোচ্চ আদালত ইন্টারন্যাশনাল কোর্ট অব জাস্টিস (ICJ) বা আন্তর্জাতিক বিচার আদালতে মামলা দায়ের করে। গাম্বিয়া ওআইসির (OIC) পক্ষে এই মামলাটি করে।`,
        subject: 'সাধারণ জ্ঞান',
        topic: 'আন্তর্জাতিক বিষয়াবলি',
        subTopic: 'আন্তর্জাতিক সম্পর্ক ও সংস্থা',
        sortOrder: 34,
      },
      {
        questionSetId,
        questionText: '৩৫. রাশিয়া ইউক্রেনে সামরিক অভিযান শুরু করে-',
        optionA: '২৪ ফেব্রুয়ারি, ২০২২',
        optionB: '২৪ মার্চ, ২০২২',
        optionC: '২৪ জানুয়ারি, ২০২২',
        optionD: '২৪ এপ্রিল, ২০২২',
        correctAnswer: 'A',
        explanation: `সঠিক উত্তর: (ক) ২৪ ফেব্রুয়ারি, ২০২২

ব্যাখ্যা: রাশিয়ার প্রেসিডেন্ট ভ্লাদিমির পুতিনের নির্দেশে ২০২২ সালের ২৪ ফেব্রুয়ারি রাশিয়া ইউক্রেনে পুরোদমে সামরিক আগ্রাসন শুরু করে, যাকে রাশিয়া "বিশেষ সামরিক অভিযান" বলে আখ্যায়িত করেছিল। এটি দ্বিতীয় বিশ্বযুদ্ধের পর ইউরোপের সবচেয়ে বড় সামরিক সংঘাত।`,
        subject: 'সাধারণ জ্ঞান',
        topic: 'আন্তর্জাতিক বিষয়াবলি',
        subTopic: 'সাম্প্রতিক বিশ্ব',
        sortOrder: 35,
      },
      {
        questionSetId,
        questionText: '৩৬. বিশ্ব বাণিজ্য সংস্থা এর সদস্য সংখ্যা-',
        optionA: '১৫৪টি',
        optionB: '১৭৪টি',
        optionC: '১৬৪টি',
        optionD: '১৮৪টি',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) ১৬৪টি

ব্যাখ্যা: পরীক্ষার সময় অনুযায়ী বিশ্ব বাণিজ্য সংস্থা (WTO)-এর সদস্য সংখ্যা ছিল ১৬৪টি (১৬৪তম সদস্য আফগানিস্তান)। তবে সাম্প্রতিক তথ্য অনুযায়ী (২০২৪), কমোরোস ও তিমুর-লেস্তে নতুন সদস্য হিসেবে যুক্ত হওয়ায় বর্তমানে WTO এর সদস্য সংখ্যা ১৬৬টি।`,
        subject: 'সাধারণ জ্ঞান',
        topic: 'আন্তর্জাতিক বিষয়াবলি',
        subTopic: 'আন্তর্জাতিক সংগঠন',
        sortOrder: 36,
      },
      {
        questionSetId,
        questionText: '৩৭. ‘কিয়েভ’ কোন দেশের রাজধানী?',
        optionA: 'রুমানিয়া',
        optionB: 'পোল্যান্ড',
        optionC: 'ইউক্রেন',
        optionD: 'স্পেন',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) ইউক্রেন

ব্যাখ্যা: 'কিয়েভ' (Kyiv) হলো পূর্ব ইউরোপের দেশ ইউক্রেনের রাজধানী ও বৃহত্তম শহর। রুমানিয়ার রাজধানী বুখারেস্ট, পোল্যান্ডের রাজধানী ওয়ারশ এবং স্পেনের রাজধানী মাদ্রিদ।`,
        subject: 'সাধারণ জ্ঞান',
        topic: 'আন্তর্জাতিক বিষয়াবলি',
        subTopic: 'দেশ ও রাজধানী',
        sortOrder: 37,
      },
      {
        questionSetId,
        questionText: '৩৮. অ্যান্তোনিও গুতেরেস জাতিসংঘের কততম মহাসচিব?',
        optionA: 'অষ্টম',
        optionB: 'নবম',
        optionC: 'দশম',
        optionD: 'একাদশ',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) নবম

ব্যাখ্যা: পর্তুগালের সাবেক প্রধানমন্ত্রী অ্যান্তোনিও গুতেরেস (António Guterres) জাতিসংঘের নবম ও বর্তমান মহাসচিব। তিনি ১ জানুয়ারি ২০১৭ তারিখে দায়িত্ব গ্রহণ করেন। অষ্টম মহাসচিব ছিলেন দক্ষিণ কোরিয়ার বান কি মুন।`,
        subject: 'সাধারণ জ্ঞান',
        topic: 'আন্তর্জাতিক বিষয়াবলি',
        subTopic: 'জাতিসংঘ',
        sortOrder: 38,
      },
      {
        questionSetId,
        questionText: '৩৯. ইংল্যান্ডের বর্তমান প্রধানমন্ত্রী?',
        optionA: 'বরিস জনসন',
        optionB: 'লিজ স্ট্রাস',
        optionC: 'ঋষি সুনাক',
        optionD: 'টনি ব্লেয়ার',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) ঋষি সুনাক

ব্যাখ্যা: পরীক্ষার সময় (২০২২ সালের শেষভাগে) যুক্তরাজ্যের প্রধানমন্ত্রী ছিলেন ঋষি সুনাক। তিনি ভারতীয় বংশোদ্ভূত প্রথম ব্রিটিশ প্রধানমন্ত্রী ছিলেন। 
তবে সাম্প্রতিক তথ্য (২০২৪): বর্তমানে যুক্তরাজ্যের প্রধানমন্ত্রী হলেন লেবার পার্টির নেতা কিয়ার স্টারমার (Keir Starmer)।`,
        subject: 'সাধারণ জ্ঞান',
        topic: 'আন্তর্জাতিক বিষয়াবলি',
        subTopic: 'সাম্প্রতিক ব্যক্তিত্ব',
        sortOrder: 39,
      },
      {
        questionSetId,
        questionText: '৪০. গোবি মরুভূমি কোন মহাদেশে অবস্থিত?',
        optionA: 'আফ্রিকা',
        optionB: 'দক্ষিণ আমেরিকা',
        optionC: 'এশিয়া',
        optionD: 'ইউরোপ',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) এশিয়া

ব্যাখ্যা: গোবি মরুভূমি এশিয়া মহাদেশের বৃহত্তম মরুভূমি। এটি উত্তর ও উত্তর-পশ্চিম চীন এবং দক্ষিণ মঙ্গোলিয়া জুড়ে বিস্তৃত। এটি একটি শীতল মরুভূমি (Cold Desert)। অন্যদিকে বিশ্বের বৃহত্তম উষ্ণ মরুভূমি সাহারা আফ্রিকায় অবস্থিত।`,
        subject: 'সাধারণ জ্ঞান',
        topic: 'আন্তর্জাতিক বিষয়াবলি',
        subTopic: 'ভৌগোলিক স্থান',
        sortOrder: 40,
      },
      {
        questionSetId,
        questionText: '৪১. বাংলাদেশে সর্বপ্রথম ইন্টারনেট সিস্টেম চালু হয় কোন সালে?',
        optionA: '১৯৯৫ সালে',
        optionB: '১৯৯৬ সালে',
        optionC: '১৯৯৭ সালে',
        optionD: '১৯৯৮ সালে',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) ১৯৯৬ সালে

ব্যাখ্যা: বাংলাদেশে সর্বপ্রথম ইন্টারনেট সেবা চালু হয় ১৯৯৬ সালে। ISN (Information Services Network) নামক একটি প্রতিষ্ঠানের মাধ্যমে দেশে প্রথম ডায়াল-আপ ইন্টারনেট সেবা শুরু হয়।`,
        subject: 'সাধারণ জ্ঞান',
        topic: 'তথ্য ও প্রযুক্তি',
        subTopic: 'ইন্টারনেট ও নেটওয়ার্ক',
        sortOrder: 41,
      },
      {
        questionSetId,
        questionText: '৪২. কচুশাক বিশেষভাবে মূল্যবান যে উপাদানের জন্য তা হলো-',
        optionA: 'লৌহ',
        optionB: 'ভিটামিন-সি',
        optionC: 'ক্যালসিয়াম',
        optionD: 'ভিটামিন-এ',
        correctAnswer: 'A',
        explanation: `সঠিক উত্তর: (ক) লৌহ

ব্যাখ্যা: কচুশাকে প্রচুর পরিমাণে লৌহ (Iron) থাকে। লৌহ রক্তে হিমোগ্লোবিন তৈরিতে সাহায্য করে, যা রক্তশূন্যতা (Anemia) দূর করতে অত্যন্ত কার্যকর। তাই রক্তশূন্যতায় ভোগা রোগীদের বেশি করে কচুশাক খেতে বলা হয়।`,
        subject: 'সাধারণ জ্ঞান',
        topic: 'দৈনন্দিন বিজ্ঞান',
        subTopic: 'খাদ্য ও পুষ্টি',
        sortOrder: 42,
      },
      {
        questionSetId,
        questionText: '৪৩. ক্যান্সার সংক্রান্ত বিদ্যাকে বলে-',
        optionA: 'টিউমারোলজি',
        optionB: 'একালজি',
        optionC: 'অনকোলজি',
        optionD: 'সাইটোলজি',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) অনকোলজি

ব্যাখ্যা: চিকিৎসা বিজ্ঞানের যে শাখায় ক্যান্সার বা টিউমার সম্পর্কে অধ্যয়ন, রোগ নির্ণয় এবং চিকিৎসা নিয়ে আলোচনা করা হয়, তাকে অনকোলজি (Oncology) বলা হয়। 
অন্যদিকে, কোষ সম্পর্কে বিদ্যাকে সাইটোলজি (Cytology) বলে।`,
        subject: 'সাধারণ জ্ঞান',
        topic: 'বিজ্ঞান',
        subTopic: 'বিজ্ঞানের বিভিন্ন শাখা',
        sortOrder: 43,
      },
      {
        questionSetId,
        questionText: '৪৪. জাতিসংঘ পরিবেশ কর্মসূচি এর সদর দপ্তর অবস্থিত-',
        optionA: 'স্টকহোম',
        optionB: 'নাইরোবি',
        optionC: 'হেগ',
        optionD: 'বৈরুত',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) নাইরোবি

ব্যাখ্যা: জাতিসংঘ পরিবেশ কর্মসূচি বা UNEP (United Nations Environment Programme) এর সদর দপ্তর কেনিয়ার রাজধানী নাইরোবিতে অবস্থিত। এটি ১৯৭২ সালে প্রতিষ্ঠিত হয় এবং বিশ্বব্যাপী পরিবেশগত সমস্যা মোকাবিলায় নেতৃত্ব দেয়।`,
        subject: 'সাধারণ জ্ঞান',
        topic: 'আন্তর্জাতিক বিষয়াবলি',
        subTopic: 'আন্তর্জাতিক সংস্থা ও সদর দপ্তর',
        sortOrder: 44,
      },
      {
        questionSetId,
        questionText: '৪৫. শর্করা জাতীয় খাদ্য যে কাজে ব্যয় হয়-',
        optionA: 'দেহের বৃদ্ধির জন্য',
        optionB: 'ক্ষয়রোধের জন্য',
        optionC: 'পুষ্টির অভাব পূরণে',
        optionD: 'হাড় গঠনে',
        correctAnswer: 'A',
        explanation: `সঠিক উত্তর: (ক) দেহের বৃদ্ধির জন্য 
(মূলত শর্করা দেহের তাপশক্তি উৎপাদন ও কাজ করার শক্তি যোগায়, তবে অপশন অনুসারে দেহের বৃদ্ধি ও রক্ষণাবেক্ষণ কাজেও এর পরোক্ষ ভূমিকা রয়েছে)। 
সংশোধনী ব্যাখ্যা: বৈজ্ঞানিকভাবে আমিষ (Protein) দেহের বৃদ্ধি ও ক্ষয়পূরণ করে। শর্করা বা কার্বোহাইড্রেট মূলত শক্তি যোগায়। প্রদত্ত অপশনগুলোর মধ্যে সবচেয়ে প্রাসঙ্গিক না হলেও বোর্ড কর্তৃক গৃহীত উত্তর হিসেবে এটি গণ্য। সঠিক তথ্যটি হলো আমিষ দেহের বৃদ্ধি ঘটায়।`,
        subject: 'সাধারণ জ্ঞান',
        topic: 'দৈনন্দিন বিজ্ঞান',
        subTopic: 'খাদ্য ও পুষ্টি',
        sortOrder: 45,
      },
      {
        questionSetId,
        questionText: '৪৬. দৃষ্টিহীনদের জন্য আবিষ্কৃত বাংলায় প্রথম সফটওয়্যার এর নাম কী?',
        optionA: 'আইলিপ',
        optionB: 'আইসাইট',
        optionC: 'আইডট',
        optionD: 'আইলাইট',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) আইসাইট

ব্যাখ্যা: দৃষ্টিহীনদের জন্য ব্রেইল পদ্ধতির পাশাপাশি কম্পিউটারে কাজ করার জন্য আবিষ্কৃত বাংলায় প্রথম সফটওয়্যারটির নাম হলো 'আইসাইট' (iSight)। এটি দৃষ্টিপ্রতিবন্ধীদের প্রযুক্তি ব্যবহারে সহায়তা করে।`,
        subject: 'সাধারণ জ্ঞান',
        topic: 'তথ্য ও প্রযুক্তি',
        subTopic: 'সফটওয়্যার ও আইটি',
        sortOrder: 46,
      },
      {
        questionSetId,
        questionText: '৪৭. বৈদ্যুতিক সংযোগ বিচ্ছিন্ন হয়ে গেলে কোন মেমোরি থেকে তথ্য চলে যায়?',
        optionA: 'ROM',
        optionB: 'Secondary storage',
        optionC: 'RAM',
        optionD: 'কোনোটিই নয়',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) RAM

ব্যাখ্যা: RAM (Random Access Memory) হলো কম্পিউটারের একটি অস্থায়ী বা ভোলাটাইল (Volatile) মেমোরি। বৈদ্যুতিক সংযোগ বিচ্ছিন্ন হলে বা কম্পিউটার বন্ধ করলে RAM-এ থাকা সমস্ত তথ্য মুছে যায়। অন্যদিকে ROM (Read Only Memory) হলো স্থায়ী মেমোরি।`,
        subject: 'সাধারণ জ্ঞান',
        topic: 'তথ্য ও প্রযুক্তি',
        subTopic: 'কম্পিউটার মেমোরি',
        sortOrder: 47,
      },
      {
        questionSetId,
        questionText: '৪৮. বিশ্ব স্বাস্থ্য সংস্থা করোনা ভাইরাসের দাপ্তরিক নাম দিয়েছে-',
        optionA: 'করোনা-১',
        optionB: 'কোভিড-১৯',
        optionC: 'করোনা ভাইরাস',
        optionD: 'SARS-COV-1',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) কোভিড-১৯

ব্যাখ্যা: বিশ্ব স্বাস্থ্য সংস্থা (WHO) ২০২০ সালের ১১ ফেব্রুয়ারি নভেল করোনা ভাইরাসের কারণে সৃষ্ট রোগের দাপ্তরিক নাম দেয় COVID-19 (Coronavirus Disease 2019)। আর এই রোগের জন্য দায়ী ভাইরাসটির বৈজ্ঞানিক নাম হলো SARS-CoV-2।`,
        subject: 'সাধারণ জ্ঞান',
        topic: 'বিজ্ঞান ও চিকিৎসা',
        subTopic: 'সাম্প্রতিক স্বাস্থ্য',
        sortOrder: 48,
      },
      {
        questionSetId,
        questionText: '৪৯. কোন হরমোনের অভাবে গলগণ্ড রোগের সৃষ্টি হয়?',
        optionA: 'থাইরক্সিন',
        optionB: 'ইনসুলিন',
        optionC: 'গ্লুকাগন',
        optionD: 'করটিসোল',
        correctAnswer: 'A',
        explanation: `সঠিক উত্তর: (ক) থাইরক্সিন

ব্যাখ্যা: থাইরয়েড গ্রন্থি থেকে নিঃসৃত হরমোন হলো থাইরক্সিন। খাবারে আয়োডিনের অভাব ঘটলে থাইরয়েড গ্রন্থি থাইরক্সিন হরমোন ঠিকমতো উৎপাদন করতে পারে না, ফলে গ্রন্থিটি অস্বাভাবিকভাবে ফুলে যায়। একেই গলগণ্ড বা ঘ্যাগ (Goiter) রোগ বলা হয়।`,
        subject: 'সাধারণ জ্ঞান',
        topic: 'দৈনন্দিন বিজ্ঞান',
        subTopic: 'মানবদেহ ও রোগব্যাধি',
        sortOrder: 49,
      },
      {
        questionSetId,
        questionText: '৫০. GIS-এর পূর্ণরূপ কোনটি?',
        optionA: 'Geographic Information System.',
        optionB: 'Geological Information System.',
        optionC: 'Geographic Integrated System.',
        optionD: 'Geological Integrated System.',
        correctAnswer: 'A',
        explanation: `সঠিক উত্তর: (ক) Geographic Information System.

ব্যাখ্যা: GIS এর পূর্ণরূপ হলো Geographic Information System (ভৌগলিক তথ্য ব্যবস্থা)। এটি এমন একটি কম্পিউটারাইজড সিস্টেম যা পৃথিবীর পৃষ্ঠের বিভিন্ন ধরনের স্থানিক বা ভৌগলিক তথ্য সংরক্ষণ, বিশ্লেষণ এবং প্রদর্শন করতে ব্যবহৃত হয়।`,
        subject: 'সাধারণ জ্ঞান',
        topic: 'তথ্য ও প্রযুক্তি',
        subTopic: 'সংক্ষিপ্ত রূপ',
        sortOrder: 50,
      },
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // বিষয়: বাংলা ভাষা ও সাহিত্য (প্রশ্ন ৫১–৭৫)
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      {
        questionSetId,
        questionText: '৫১. অঘোষ অল্পপ্রাণ ধ্বনি কোনটি?',
        optionA: 'চ ধ্বনি',
        optionB: 'ছ ধ্বনি',
        optionC: 'জ ধ্বনি',
        optionD: 'ঝ ধ্বনি',
        correctAnswer: 'A',
        explanation: `সঠিক উত্তর: (ক) চ ধ্বনি

ব্যাখ্যা: বর্গের প্রথম ও দ্বিতীয় ধ্বনি হলো অঘোষ। আর বর্গের প্রথম ও তৃতীয় ধ্বনি হলো অল্পপ্রাণ। 
চ-বর্গের ধ্বনিসমূহ: চ, ছ, জ, ঝ, ঞ। 
এখানে 'চ' বর্গের প্রথম ধ্বনি। তাই এটি একইসাথে অঘোষ এবং অল্পপ্রাণ ধ্বনি। 'ছ' অঘোষ মহাপ্রাণ, 'জ' ঘোষ অল্পপ্রাণ এবং 'ঝ' ঘোষ মহাপ্রাণ।`,
        subject: 'বাংলা ভাষা ও সাহিত্য',
        topic: 'বাংলা ব্যাকরণ',
        subTopic: 'ধ্বনি ও বর্ণ',
        sortOrder: 51,
      },
      {
        questionSetId,
        questionText: '৫২. বাক্যের ক্ষুদ্রাংশকে কী বলে?',
        optionA: 'পদ',
        optionB: 'রূপ',
        optionC: 'শব্দমূল',
        optionD: 'ধ্বনি',
        correctAnswer: 'A',
        explanation: `সঠিক উত্তর: (ক) পদ

ব্যাখ্যা: বাক্যে ব্যবহৃত প্রতিটি শব্দকেই পদ বলে। বাক্যের অন্তর্গত ক্ষুদ্রতম অর্থবোধক অংশ বা একক হলো শব্দ বা পদ। বিভক্তিযুক্ত শব্দ ও ধাতুকে পদ বলে। ধ্বনি হলো ভাষার ক্ষুদ্রতম একক, আর পদ হলো বাক্যের ক্ষুদ্রতম অংশ।`,
        subject: 'বাংলা ভাষা ও সাহিত্য',
        topic: 'বাংলা ব্যাকরণ',
        subTopic: 'পদ প্রকরণ',
        sortOrder: 52,
      },
      {
        questionSetId,
        questionText: '৫৩. সাধু ও চলিত ভাষার প্রধান পার্থক্য-',
        optionA: 'বাক্যের গঠন প্রক্রিয়ায়',
        optionB: 'ক্রিয়া ও সর্বনাম পদের রূপগত ভিন্নতায়',
        optionC: 'শব্দের কথ্য ও লেখ্য রূপের ভিন্নতায়',
        optionD: 'ভাষার জটিলতা ও প্রাঞ্জলতায়',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) ক্রিয়া ও সর্বনাম পদের রূপগত ভিন্নতায়

ব্যাখ্যা: সাধু ও চলিত রীতির মূল পার্থক্য দেখা যায় ক্রিয়া ও সর্বনাম পদের রূপের মধ্যে। সাধু ভাষায় ক্রিয়া ও সর্বনাম পদের পূর্ণাঙ্গ রূপ ব্যবহৃত হয় (যেমন: খাইতেছি, তাহারা), অন্যদিকে চলিত ভাষায় এগুলোর সংক্ষিপ্ত রূপ ব্যবহৃত হয় (যেমন: খাচ্ছি, তারা)।`,
        subject: 'বাংলা ভাষা ও সাহিত্য',
        topic: 'বাংলা ব্যাকরণ',
        subTopic: 'ভাষারীতি',
        sortOrder: 53,
      },
      {
        questionSetId,
        questionText: '৫৪. বাক্যে সম্বোধনের পর কোন চিহ্ন বসে?',
        optionA: 'কমা',
        optionB: 'কোলন',
        optionC: 'হাইফেন',
        optionD: 'ড্যাস',
        correctAnswer: 'A',
        explanation: `সঠিক উত্তর: (ক) কমা

ব্যাখ্যা: বাক্যে কাউকে উদ্দেশ্য করে কিছু বলা বা ডাকা হলে তাকে সম্বোধন পদ বলে। সম্বোধন পদের পর সামান্য বিরতি নিতে হয়, তাই সেখানে সর্বদা কমা (,) বসে। যেমন: "ওহে মাঝি, আমাকে পার করো।"`,
        subject: 'বাংলা ভাষা ও সাহিত্য',
        topic: 'বাংলা ব্যাকরণ',
        subTopic: 'বিরাম চিহ্ন',
        sortOrder: 54,
      },
      {
        questionSetId,
        questionText: '৫৫. ‘প্রথিত’ শব্দের অর্থ কোনটি?',
        optionA: 'প্রথা অনুসারে',
        optionB: 'যা প্রার্থনা',
        optionC: 'বিখ্যাত',
        optionD: 'যা পুঁতে রাখা হচ্ছে',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) বিখ্যাত

ব্যাখ্যা: 'প্রথিত' শব্দের আক্ষরিক অর্থ হলো বিখ্যাত, খ্যাতনামা বা নামকরা। 
যেমন আমরা বলি 'প্রথিতযশা' (বিখ্যাত বা স্বনামধন্য সাহিত্যিক/ব্যক্তি)। অন্যদিকে 'প্রোথিত' শব্দের অর্থ হলো যা মাটিতে পুঁতে রাখা হয়েছে।`,
        subject: 'বাংলা ভাষা ও সাহিত্য',
        topic: 'বাংলা ব্যাকরণ',
        subTopic: 'শব্দার্থ',
        sortOrder: 55,
      },
      {
        questionSetId,
        questionText: '৫৬. ‘পত্রপাঠ’ বাগধারাটির অর্থ কী?',
        optionA: 'গোপন চুক্তি',
        optionB: 'বৃহৎ ব্যাপার',
        optionC: 'অবিলম্ব',
        optionD: 'দীর্ঘস্থায়ী',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) অবিলম্ব

ব্যাখ্যা: 'পত্রপাঠ' একটি বহুল ব্যবহৃত বাগধারা যার অর্থ তৎক্ষণাৎ, অবিলম্ব বা সাথে সাথে। যেমন: "পত্রপাঠ বিদায়" অর্থ হলো চিঠি বা আদেশ পাওয়া মাত্রই তৎক্ষণাৎ বিদায় নেওয়া।`,
        subject: 'বাংলা ভাষা ও সাহিত্য',
        topic: 'বাংলা ব্যাকরণ',
        subTopic: 'বাগধারা',
        sortOrder: 56,
      },
      {
        questionSetId,
        questionText: '৫৭. কোন বানানটি শুদ্ধ?',
        optionA: 'স্বায়ত্ত্বশাসন',
        optionB: 'শ্রদ্ধাঞ্জলী',
        optionC: 'দারিদ্রতা',
        optionD: 'উপর্যুক্ত',
        correctAnswer: 'D',
        explanation: `সঠিক উত্তর: (ঘ) উপর্যুক্ত

ব্যাখ্যা: শুদ্ধ বানানটি হলো 'উপর্যুক্ত' (উপরি + উক্ত)। 
অন্যান্য অপশনের অশুদ্ধ দিক:
- স্বায়ত্তশাসন (সঠিক বানান: স্বায়ত্তশাসন - য়-এ ত্ত্ব হবে না, ত্ত হবে)
- শ্রদ্ধাঞ্জলি (সঠিক বানান: শ্রদ্ধাঞ্জলি - অঞ্জলি প্রত্যয়ান্ত শব্দে হ্রস্ব ই-কার হয়)
- দারিদ্রতা (সঠিক বানান: দরিদ্রতা বা দারিদ্র্য)।`,
        subject: 'বাংলা ভাষা ও সাহিত্য',
        topic: 'বাংলা ব্যাকরণ',
        subTopic: 'শুদ্ধ বানান',
        sortOrder: 57,
      },
      {
        questionSetId,
        questionText: '৫৮. শুদ্ধ বাক্যটি নির্দেশ করুন?',
        optionA: 'দৈন্যতা প্রশংসনীয় নয়',
        optionB: 'দীনতা প্রশংসনীয় নয়',
        optionC: 'দৈন্যতা অপ্রসংসনীয়',
        optionD: 'দৈন্যতা নিন্দনীয়',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) দীনতা প্রশংসনীয় নয়

ব্যাখ্যা: 'দীন' শব্দের বিশেষ্য রূপ হলো 'দীনতা' বা 'দৈন্য'। 'দৈন্যতা' শব্দটি ব্যাকরণগতভাবে অশুদ্ধ (অপপ্রয়োগ), কারণ বিশেষ্য রূপ 'দৈন্য' এর সাথে আবার 'তা' প্রত্যয় যুক্ত করা বাহুল্য দোষের সৃষ্টি করে। তাই শুদ্ধ বাক্য হবে "দীনতা প্রশংসনীয় নয়"।`,
        subject: 'বাংলা ভাষা ও সাহিত্য',
        topic: 'বাংলা ব্যাকরণ',
        subTopic: 'বাক্য শুদ্ধি',
        sortOrder: 58,
      },
      {
        questionSetId,
        questionText: '৫৯. ণ-ত্ব বিধি অনুসারে কোন বানানটি শুদ্ধ?',
        optionA: 'পূর্বাহ্ণ',
        optionB: 'মধ্যাহ্ণ',
        optionC: 'অপরাহ্ন',
        optionD: 'সায়াহ্ণ',
        correctAnswer: 'A',
        explanation: `সঠিক উত্তর: (ক) পূর্বাহ্ণ

ব্যাখ্যা: 'অহ্ন' শব্দের পূর্বে পূর্ব, অপর, প্র ইত্যাদি থাকলে অহ্ন-এর দন্ত্য-ন মূর্ধন্য-ণ হয় এবং তা হ-এর নিচে যুক্ত হয় (হ্ + ণ = হ্ণ)। যেমন: পূর্বাহ্ণ, অপরাহ্ণ। 
কিন্তু মধ্য, সায় ইত্যাদি থাকলে দন্ত্য-ন হয় এবং তা হ-এর পাশে বসে (হ্ + ন = হ্ন)। যেমন: মধ্যাহ্ন, সায়াহ্ন। 
তাই এখানে শুদ্ধ বানান 'পূর্বাহ্ণ'।`,
        subject: 'বাংলা ভাষা ও সাহিত্য',
        topic: 'বাংলা ব্যাকরণ',
        subTopic: 'ণত্ব ও ষত্ব বিধান',
        sortOrder: 59,
      },
      {
        questionSetId,
        questionText: '৬০. ‘Look before you leap’ বাক্যটির সঠিক বাংলা অনুবাদ কোনটি?',
        optionA: 'কাটা দিয়ে কাটা তোলা',
        optionB: 'নিজের চরকায় তেল দাও',
        optionC: 'দেখে পথ চলো, বুঝে কথা বলো',
        optionD: 'নিজের কাজ নিজে করো',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) দেখে পথ চলো, বুঝে কথা বলো / ভাবিয়া করিও কাজ

ব্যাখ্যা: ইংরেজি প্রবাদ 'Look before you leap' এর আক্ষরিক অর্থ হলো লাফ দেওয়ার আগে দেখে নাও। এর ভাবার্থ হলো কাজ শুরু করার আগে ভালোভাবে ভেবে দেখা বা পরিস্থিতি যাচাই করা। বাংলায় এর সঠিক প্রবাদ হলো "ভাবিয়া করিও কাজ" বা "দেখে পথ চলো, বুঝে কথা বলো"।`,
        subject: 'বাংলা ভাষা ও সাহিত্য',
        topic: 'বাংলা ব্যাকরণ',
        subTopic: 'প্রবাদ ও অনুবাদ',
        sortOrder: 60,
      },
      {
        questionSetId,
        questionText: '৬১. ‘Invoice’ এর বাংলা পারিভাষিক রূপ কোনটি?',
        optionA: 'চালান',
        optionB: 'পণ্যাগার',
        optionC: 'শুল্ক',
        optionD: 'বিনিয়োগ',
        correctAnswer: 'A',
        explanation: `সঠিক উত্তর: (ক) চালান

ব্যাখ্যা: 'Invoice' শব্দটি ব্যবসায়িক বা দাপ্তরিক পরিভাষা। এর সঠিক বাংলা পরিভাষা হলো 'চালান' (পণ্যের মূল্য ও পরিমাণের তালিকা)। 
অন্যান্য অপশন: পণ্যাগার (Warehouse/Godown), শুল্ক (Customs/Duty/Tariff), বিনিয়োগ (Investment)।`,
        subject: 'বাংলা ভাষা ও সাহিত্য',
        topic: 'বাংলা ব্যাকরণ',
        subTopic: 'পারিভাষিক শব্দ',
        sortOrder: 61,
      },
      {
        questionSetId,
        questionText: '৬২. ‘প্রত্যাবর্তন’ শব্দের সন্ধি-বিচ্ছেদ-',
        optionA: 'প্রতি + বর্তন',
        optionB: 'প্রতি + আবর্তন',
        optionC: 'প্রতিঃ + বর্তন',
        optionD: 'প্রতিঃ + আবর্তন',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) প্রতি + আবর্তন

ব্যাখ্যা: য-ফলা সন্ধির নিয়ম: ই-কার কিংবা ঈ-কারের পর ই/ঈ ভিন্ন অন্য স্বরবর্ণ থাকলে ই/ঈ স্থানে 'য' (য-ফলা) হয়। য-ফলা পূর্ববর্তী ব্যঞ্জনের সাথে যুক্ত হয়। 
এখানে, প্রতি (ই) + আবর্তন (আ) = প্রত্যাবর্তণ। (ত + য-ফলা + আ-কার = ত্যা)।`,
        subject: 'বাংলা ভাষা ও সাহিত্য',
        topic: 'বাংলা ব্যাকরণ',
        subTopic: 'সন্ধি',
        sortOrder: 62,
      },
      {
        questionSetId,
        questionText: '৬৩. সন্ধিতে চ ও জ এর নাসিক্য ধ্বনি কী হয়?',
        optionA: 'অনুস্বার',
        optionB: 'দ্বিত্ব',
        optionC: 'মহাপ্রাণ',
        optionD: 'তালব্য',
        correctAnswer: 'D',
        explanation: `সঠিক উত্তর: (ঘ) তালব্য

ব্যাখ্যা: চ-বর্গীয় ধ্বনির (চ, ছ, জ, ঝ) আগের নাসিক্য ধ্বনিটি সন্ধির নিয়মে তালব্য নাসিক্য ধ্বনি (ঞ) হয়। 
যেমন: সম্ + চয় = সঞ্চয়, সম্ + জীবন = সঞ্জীবন। এখানে 'ম' নাসিক্য ধ্বনিটি চ বা জ এর প্রভাবে তালব্য ধ্বনি 'ঞ' তে পরিণত হয়েছে।`,
        subject: 'বাংলা ভাষা ও সাহিত্য',
        topic: 'বাংলা ব্যাকরণ',
        subTopic: 'সন্ধি',
        sortOrder: 63,
      },
      {
        questionSetId,
        questionText: '৬৪. ‘পড়াশোনায় মন দাও’ বাক্যে ‘পড়াশোনায়’ শব্দটি কোন কারকে কোন বিভক্তি?',
        optionA: 'কর্তায় ৭মী',
        optionB: 'কর্মে ৭মী',
        optionC: 'অপাদানে ৭মী',
        optionD: 'অধিকরণে ৭মী',
        correctAnswer: 'D',
        explanation: `সঠিক উত্তর: (ঘ) অধিকরণে ৭মী

ব্যাখ্যা: কোথায় বা কিসে মন দেবে? উত্তরে পাওয়া যায় 'পড়াশোনায়'। ক্রিয়া সম্পাদনের বিষয়, স্থান বা কালকে অধিকরণ কারক বলে। এটি বিষয়াদিকরণ (কোনো বিষয়ে দক্ষতা বা মনযোগ)। 
'পড়াশোনা' এর সাথে 'য়' যুক্ত হয়েছে, যা ৭মী (এ, য়, তে) বিভক্তি। তাই এটি অধিকরণে ৭মী।`,
        subject: 'বাংলা ভাষা ও সাহিত্য',
        topic: 'বাংলা ব্যাকরণ',
        subTopic: 'কারক ও বিভক্তি',
        sortOrder: 64,
      },
      {
        questionSetId,
        questionText:
          '৬৫. “এবারের সংগ্রাম, স্বাধীনতার সংগ্রাম” বাক্যটিতে ‘স্বাধীনতার’ শব্দটি কোন কারকে কোন বিভক্তি?',
        optionA: 'কর্মে ষষ্ঠী',
        optionB: 'নিমিত্তার্থে ষষ্ঠী',
        optionC: 'করণে ষষ্ঠী',
        optionD: 'সম্প্রদানে ষষ্ঠী',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) নিমিত্তার্থে ষষ্ঠী

ব্যাখ্যা: কীসের জন্য সংগ্রাম? স্বাধীনতার জন্য বা নিমিত্তে। 
কোনো কিছুর নিমিত্ত বা উদ্দেশ্যে কাজ করা বোঝালে নিমিত্তার্থে কারক (বা সম্প্রদান) হয়। এখানে 'স্বাধীনতা' এর সাথে 'র' বিভক্তি যুক্ত আছে, যা ষষ্ঠী বিভক্তি (র, এর)। তাই এটি নিমিত্তার্থে ষষ্ঠী।`,
        subject: 'বাংলা ভাষা ও সাহিত্য',
        topic: 'বাংলা ব্যাকরণ',
        subTopic: 'কারক ও বিভক্তি',
        sortOrder: 65,
      },
      {
        questionSetId,
        questionText: '৬৬. ‘কালান্তর’ শব্দটির ব্যাসবাক্য কোনটি?',
        optionA: 'অন্যকাল',
        optionB: 'ক্ষুদ্রকাল',
        optionC: 'কালের অন্তর',
        optionD: 'কাল ও অন্তর',
        correctAnswer: 'A',
        explanation: `সঠিক উত্তর: (ক) অন্যকাল

ব্যাখ্যা: 'অন্তর' শব্দ যোগে গঠিত সমাস হলো নিত্য সমাস। নিত্য সমাসে ব্যাসবাক্যের দরকার হয় না, কেবল অর্থ বোঝাতে অন্য একটি পদ ব্যবহৃত হয়। 
যেমন: অন্য কাল = কালান্তর, অন্য দেশ = দেশান্তর, অন্য গ্রাম = গ্রামান্তর।`,
        subject: 'বাংলা ভাষা ও সাহিত্য',
        topic: 'বাংলা ব্যাকরণ',
        subTopic: 'সমাস',
        sortOrder: 66,
      },
      {
        questionSetId,
        questionText: '৬৭. ‘মুজিববর্ষ’ কোন সমাস?',
        optionA: 'দ্বন্দ্ব সমাস',
        optionB: 'দ্বিগু সমাস',
        optionC: 'কর্মধারয় সমাস',
        optionD: 'অব্যয়ীভাব সমাস',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) কর্মধারয় সমাস

ব্যাখ্যা: 'মুজিববর্ষ' শব্দের ব্যাসবাক্য হলো 'মুজিব নামাঙ্কিত বর্ষ' বা 'মুজিব স্মরণার্থে বর্ষ'। এটি মধ্যপদলোপী কর্মধারয় সমাস। যে কর্মধারয় সমাসে ব্যাসবাক্যের মধ্যবর্তী পদ লোপ পায়, তাকে মধ্যপদলোপী কর্মধারয় সমাস বলে। (যেমন: সিংহ চিহ্নিত আসন = সিংহাসন)।`,
        subject: 'বাংলা ভাষা ও সাহিত্য',
        topic: 'বাংলা ব্যাকরণ',
        subTopic: 'সমাস',
        sortOrder: 67,
      },
      {
        questionSetId,
        questionText: '৬৮. ‘মুক্তি-এর সঠিক প্রকৃতি ও প্রত্যয় কোনটি?',
        optionA: '√মুচ্ + ক্তি',
        optionB: '√মুহ্ + ক্তি',
        optionC: '√মুক্ + ক্তি',
        optionD: '√মৃচ্ + ক্তি',
        correctAnswer: 'A',
        explanation: `সঠিক উত্তর: (ক) √মুচ্ + ক্তি

ব্যাখ্যা: 'মুক্তি' শব্দটি কৃৎ প্রত্যয় সাধিত শব্দ। এর প্রকৃতি হলো সংস্কৃত ধাতু √মুচ্ (অর্থ মুক্ত করা) এবং এর সাথে প্রত্যয় যুক্ত হয়েছে 'ক্তি'। 
√মুচ্ + ক্তি = মুক্তি। (চ-এর স্থলে ক হয়)।`,
        subject: 'বাংলা ভাষা ও সাহিত্য',
        topic: 'বাংলা ব্যাকরণ',
        subTopic: 'প্রকৃতি ও প্রত্যয়',
        sortOrder: 68,
      },
      {
        questionSetId,
        questionText: '৬৯. পৃথিবী’র সমার্থক শব্দ কোনটি?',
        optionA: 'অচল',
        optionB: 'অদ্রি',
        optionC: 'ভূধর',
        optionD: 'অবনী',
        correctAnswer: 'D',
        explanation: `সঠিক উত্তর: (ঘ) অবনী

ব্যাখ্যা: পৃথিবীর সমার্থক শব্দসমূহ হলো: ধরিত্রী, ধরা, মেদিনী, অবনী, বসুন্ধরা, বসুধা ইত্যাদি। 
অন্য অপশনগুলোর অর্থ: অচল, অদ্রি, ভূধর — এই তিনটির অর্থই হলো পর্বত বা পাহাড়।`,
        subject: 'বাংলা ভাষা ও সাহিত্য',
        topic: 'বাংলা ব্যাকরণ',
        subTopic: 'সমার্থক শব্দ',
        sortOrder: 69,
      },
      {
        questionSetId,
        questionText: '৭০. ‘খিড়কি’ শব্দের বিপরীতার্থক শব্দ কোনটি?',
        optionA: 'সরুপথ',
        optionB: 'চিলেকোঠা',
        optionC: 'গুপ্তপথ',
        optionD: 'সিংহদ্বার',
        correctAnswer: 'D',
        explanation: `সঠিক উত্তর: (ঘ) সিংহদ্বার

ব্যাখ্যা: 'খিড়কি' শব্দের অর্থ হলো বাড়ির পেছনের ছোট দরজা বা গোপন দরজা। 
এর ঠিক বিপরীত শব্দ হলো 'সিংহদ্বার', যার অর্থ হলো বাড়ির সামনের প্রধান ও বৃহৎ দরজা বা সদর দরজা।`,
        subject: 'বাংলা ভাষা ও সাহিত্য',
        topic: 'বাংলা ব্যাকরণ',
        subTopic: 'বিপরীত শব্দ',
        sortOrder: 70,
      },
      {
        questionSetId,
        questionText: '৭১. ‘কর্মে অতিশয় তৎপর’ এক কথায় কী হবে?',
        optionA: 'ত্বরিৎকর্মা',
        optionB: 'কর্মবীর',
        optionC: 'কর্মপটু',
        optionD: 'কর্মনিষ্ঠ',
        correctAnswer: 'A',
        explanation: `সঠিক উত্তর: (ক) ত্বরিৎকর্মা

ব্যাখ্যা: এক কথায় প্রকাশ:
- কর্মে অতিশয় তৎপর বা দ্রুত যে কাজ করে = ত্বরিৎকর্মা। 
- যে কর্মে দক্ষ = কর্মপটু বা কর্মী। 
- যিনি কর্মে নিষ্ঠাবান = কর্মনিষ্ঠ।`,
        subject: 'বাংলা ভাষা ও সাহিত্য',
        topic: 'বাংলা ব্যাকরণ',
        subTopic: 'বাক্য সংকোচন',
        sortOrder: 71,
      },
      {
        questionSetId,
        questionText: '৭২. ‘যা বলা হবে’ এর বাক্য সংকোচন কোনটি?',
        optionA: 'উক্ত',
        optionB: 'অনুমিত',
        optionC: 'ভবিতব্য',
        optionD: 'বক্তব্য',
        correctAnswer: 'D',
        explanation: `সঠিক উত্তর: (ঘ) বক্তব্য

ব্যাখ্যা: এক কথায় প্রকাশ:
- যা বলা হবে = বক্তব্য বা বক্ষ্যমাণ।
- যা বলা হয়েছে = উক্ত।
- যা অবশ্যই ঘটবে = ভবিতব্য।`,
        subject: 'বাংলা ভাষা ও সাহিত্য',
        topic: 'বাংলা ব্যাকরণ',
        subTopic: 'বাক্য সংকোচন',
        sortOrder: 72,
      },
      {
        questionSetId,
        questionText: '৭৩. ‘শ্রবণ’ শব্দটির প্রকৃতি ও প্রত্যয় কোনটি?',
        optionA: 'শ্রবণ + অ',
        optionB: '√শ্রী + অন',
        optionC: '√শ্রু + অন',
        optionD: '√শ্রব + অন',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) √শ্রু + অন

ব্যাখ্যা: 'শ্রবণ' শব্দটি সংস্কৃত কৃৎ প্রত্যয় সাধিত। এর প্রকৃতি হলো √শ্রু (শোনা) এবং প্রত্যয় হলো 'অন' (অনট)। 
√শ্রু + অন(ট) = শ্রবণ। (উ-কারের পর অ থাকলে উ-কার ও-কার হয়ে অব-এ পরিণত হয়, এবং নত্ব বিধানে ন ণ হয়)।`,
        subject: 'বাংলা ভাষা ও সাহিত্য',
        topic: 'বাংলা ব্যাকরণ',
        subTopic: 'প্রকৃতি ও প্রত্যয়',
        sortOrder: 73,
      },
      {
        questionSetId,
        questionText: '৭৪. নিত্য স্ত্রীবাচক শব্দ কোনটি?',
        optionA: 'জেঠী',
        optionB: 'পাগলী',
        optionC: 'বেঙ্গামী',
        optionD: 'সৎমা',
        correctAnswer: 'D',
        explanation: `সঠিক উত্তর: (ঘ) সৎমা

ব্যাখ্যা: যেসব স্ত্রীবাচক শব্দের কোনো পুরুষবাচক শব্দ নেই, সেগুলোকে নিত্য স্ত্রীবাচক শব্দ বলে। যেমন: সৎমা, সধবা, বিধবা, ডাইনি, এয়ো, সতীন, কুলটা ইত্যাদি। 
অন্যান্য অপশনগুলোর পুরুষবাচক শব্দ আছে: জেঠা-জেঠী, পাগল-পাগলী, বেঙ্গমা-বেঙ্গামী।`,
        subject: 'বাংলা ভাষা ও সাহিত্য',
        topic: 'বাংলা ব্যাকরণ',
        subTopic: 'লিঙ্গ প্রকরণ',
        sortOrder: 74,
      },
      {
        questionSetId,
        questionText: '৭৫. ‘রজক’ এর স্ত্রীবাচক শব্দ কোনটি?',
        optionA: 'রজকা',
        optionB: 'রজকী',
        optionC: 'রজকিনী',
        optionD: 'রজকানী',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) রজকী

ব্যাখ্যা: 'রজক' (ধোপা) শব্দের সংস্কৃত নিয়মে শুদ্ধ স্ত্রীবাচক রূপ হলো 'রজকী' (ঈ-প্রত্যয় যোগে)। তবে বাংলা সাহিত্যে বা সাধারণ প্রয়োগে কখনো কখনো 'রজকিনী' রূপটিও ব্যবহৃত হয় (যেমন: রামী রজকিনী)। কিন্তু ব্যাকরণগতভাবে সবচেয়ে শুদ্ধ হলো 'রজকী'।`,
        subject: 'বাংলা ভাষা ও সাহিত্য',
        topic: 'বাংলা ব্যাকরণ',
        subTopic: 'লিঙ্গ প্রকরণ',
        sortOrder: 75,
      },
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // বিষয়: গণিত (প্রশ্ন ৭৬–১০০)
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      {
        questionSetId,
        questionText:
          '৭৬. পিতা ও পুত্রের বয়সের গড় ৩০ বছর। ৬ বছর পরে তাদের বয়সের অনুপাত ৫ : ১ হলে, পুত্রের বর্তমান বয়স কত বছর?',
        optionA: '৫',
        optionB: '৬',
        optionC: '৮',
        optionD: '৯',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) ৬

ব্যাখ্যা: 
পিতা ও পুত্রের বর্তমান বয়সের সমষ্টি = ৩০ × ২ = ৬০ বছর।
৬ বছর পর পিতা ও পুত্রের বয়সের সমষ্টি হবে = ৬০ + (৬ + ৬) = ৭২ বছর।
৬ বছর পর তাদের বয়সের অনুপাত = ৫ : ১ 
অনুপাতের যোগফল = ৫ + ১ = ৬
সুতরাং, ৬ বছর পর পুত্রের বয়স = ৭২ × (১ / ৬) = ১২ বছর।
অতএব, পুত্রের বর্তমান বয়স = ১২ - ৬ = ৬ বছর।`,
        subject: 'গণিত',
        topic: 'পাটিগণিত',
        subTopic: 'বয়স ও গড়',
        sortOrder: 76,
      },
      {
        questionSetId,
        questionText:
          '৭৭. পাঁচটি ঘন্টা একত্রে বেজে যথাক্রমে ৩, ৬, ৯, ১২, ১৫ সেকেন্ড অন্তর বাজতে লাগল। কতক্ষণ পর ঘন্টাগুলো পুনরায় একত্রে বাজবে?',
        optionA: '৩০ সেকেন্ড',
        optionB: '৯০ সেকেন্ড',
        optionC: '৩ মিনিট',
        optionD: '৫ মিনিট',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) ৩ মিনিট

ব্যাখ্যা: ঘন্টাগুলো পুনরায় একত্রে বাজার সময় হবে ৩, ৬, ৯, ১২ ও ১৫ এর ল.সা.গু।
৩, ৬, ৯, ১২, ১৫ এর ল.সা.গু নির্ণয়:
ল.সা.গু = ১৮০।
অর্থাৎ, ১৮০ সেকেন্ড পর ঘন্টাগুলো পুনরায় একত্রে বাজবে।
১৮০ সেকেন্ড = ১৮০/৬০ = ৩ মিনিট।`,
        subject: 'গণিত',
        topic: 'পাটিগণিত',
        subTopic: 'ল.সা.গু ও গ.সা.গু',
        sortOrder: 77,
      },
      {
        questionSetId,
        questionText:
          '৭৮. যদি ৩ জন পুরুষ বা ৫ জন বালক একটি কাজ ২০ দিনে করতে পারে তবে ৪ জন পুরুষ এবং ১০ জন বালক ঐ কাজটি কত দিনে করতে পারবে?',
        optionA: '১০',
        optionB: '৯',
        optionC: '৮',
        optionD: '৬',
        correctAnswer: 'D',
        explanation: `সঠিক উত্তর: (ঘ) ৬

ব্যাখ্যা: 
প্রশ্নমতে, ৩ জন পুরুষ = ৫ জন বালক
তাহলে, ১ জন পুরুষ = ৫/৩ জন বালক
সুতরাং, ৪ জন পুরুষ = (৫ × ৪) / ৩ = ২০/৩ জন বালক
এখন, (৪ জন পুরুষ + ১০ জন বালক) = (২০/৩ + ১০) জন বালক = ৫০/৩ জন বালক।
৫ জন বালক কাজটি করে ২০ দিনে
১ জন বালক কাজটি করে ২০ × ৫ = ১০০ দিনে
৫০/৩ জন বালক করে = ১০০ / (৫০/৩) = (১০০ × ৩) / ৫০ = ৬ দিনে।`,
        subject: 'গণিত',
        topic: 'পাটিগণিত',
        subTopic: 'ঐকিক নিয়ম (কাজ ও শ্রমিক)',
        sortOrder: 78,
      },
      {
        questionSetId,
        questionText:
          '৭৯. ৮ জন লোক একটি কাজ ১২ দিনে করতে পারে। দুই জন লোক কমিয়ে দিলে কাজটি সম্পূর্ণ করতে শতকরা কত দিন বেশি লাগবে?',
        optionA: '২৫',
        optionB: '৫০',
        optionC: '৩৩.৩৩',
        optionD: '৬৬.৬৬',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) ৩৩.৩৩

ব্যাখ্যা: 
৮ জন লোক কাজ করে ১২ দিনে।
১ জন লোক করে = ১২ × ৮ = ৯৬ দিনে।
২ জন লোক কমালে লোক থাকে ৬ জন।
৬ জন লোক করে = ৯৬ / ৬ = ১৬ দিনে।
আগে লাগতো ১২ দিন, এখন লাগে ১৬ দিন। বেশি লাগে = ১৬ - ১২ = ৪ দিন।
১২ দিনে বেশি লাগে ৪ দিন
১০০ দিনে বেশি লাগে = (৪ × ১০০) / ১২ = ৩৩.৩৩ দিন।
অর্থাৎ ৩৩.৩৩% সময় বেশি লাগবে।`,
        subject: 'গণিত',
        topic: 'পাটিগণিত',
        subTopic: 'ঐকিক নিয়ম ও শতকরা',
        sortOrder: 79,
      },
      {
        questionSetId,
        questionText: '৮০. ৫% হারে ৫০০০ টাকার ২ বছরের সরল ও চক্রবৃদ্ধি সুদের পার্থক্য কত টাকা?',
        optionA: '১০',
        optionB: '১২.৫০',
        optionC: '১৫',
        optionD: '২৫',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) ১২.৫০

ব্যাখ্যা: 
সরল সুদ (I) = Pnr = ৫০০০ × ২ × (৫/১০০) = ৫০০ টাকা।
চক্রবৃদ্ধি সবৃদ্ধিমূল (C) = P(1+r)^n = ৫০০০ × (১ + ৫/১০০)^২ = ৫০০০ × (২১/২০) × (২১/২০) = ৫৫১২.৫০ টাকা।
চক্রবৃদ্ধি সুদ = ৫৫১২.৫০ - ৫০০০ = ৫১২.৫০ টাকা।
পার্থক্য = চক্রবৃদ্ধি সুদ - সরল সুদ = ৫১২.৫০ - ৫০০ = ১২.৫০ টাকা।
শর্টকাট সূত্র: ২ বছরের সুদের পার্থক্য = P(r/100)^2 = ৫০০০ × (৫/১০০)^২ = ৫০০০ × (২৫/১০০০০) = ১২.৫০ টাকা।`,
        subject: 'গণিত',
        topic: 'পাটিগণিত',
        subTopic: 'সুদকষা',
        sortOrder: 80,
      },
      {
        questionSetId,
        questionText:
          '৮১. একটি দ্রব্য বিক্রি করে বিক্রেতার ১০% ক্ষতি হলো। বিক্রয়মূল্য ১৩৫ টাকা বেশি হলে বিক্রেতার ২০% লাভ হতো। দ্রব্যটির ক্রয়মূল্য কত টাকা?',
        optionA: '৪২০',
        optionB: '৪৫০',
        optionC: '৪৬০',
        optionD: '৪৮০',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) ৪৫০

ব্যাখ্যা: 
ধরি, ক্রয়মূল্য ১০০x টাকা।
১০% ক্ষতিতে বিক্রয়মূল্য = ৯০x টাকা।
২০% লাভে বিক্রয়মূল্য = ১২০x টাকা।
দুটি বিক্রয়মূল্যের পার্থক্য = ১২০x - ৯০x = ৩০x টাকা।
প্রশ্নমতে, ৩০x = ১৩৫
বা, x = ১৩৫ / ৩০ = ৪.৫
অতএব, ক্রয়মূল্য = ১০০x = ১০০ × ৪.৫ = ৪৫০ টাকা।`,
        subject: 'গণিত',
        topic: 'পাটিগণিত',
        subTopic: 'লাভ-ক্ষতি',
        sortOrder: 81,
      },
      {
        questionSetId,
        questionText:
          '৮২. দুইটি বৃত্তের ব্যাসার্ধের অনুপাত ৩ : ২। বৃত্তদ্বয়ের ক্ষেত্রফলের অনুপাত কত হবে?',
        optionA: '২ : ৩',
        optionB: '৩ : ৪',
        optionC: '৪ : ৯',
        optionD: '৯ : ৪',
        correctAnswer: 'D',
        explanation: `সঠিক উত্তর: (ঘ) ৯ : ৪

ব্যাখ্যা: 
বৃত্তের ক্ষেত্রফল তার ব্যাসার্ধের বর্গের সমানুপাতিক (Area = πr²)।
যেহেতু ব্যাসার্ধের অনুপাত = ৩ : ২
তাই ক্ষেত্রফলের অনুপাত হবে তাদের বর্গের অনুপাত = ৩² : ২² = ৯ : ৪।`,
        subject: 'গণিত',
        topic: 'জ্যামিতি',
        subTopic: 'বৃত্ত ও পরিমিতি',
        sortOrder: 82,
      },
      {
        questionSetId,
        questionText:
          '৮৩. ৯৮০০ টাকা ২ : ৩ : ৪ : ৫ অনুপাতে ভাগ করলে বৃহত্তর এবং ক্ষুদ্রতর অংশের পার্থক্য কত টাকা হবে?',
        optionA: '২১০০',
        optionB: '২২০০',
        optionC: '২৫০০',
        optionD: '৩৫০০',
        correctAnswer: 'A',
        explanation: `সঠিক উত্তর: (ক) ২১০০

ব্যাখ্যা: 
অনুপাতের যোগফল = ২ + ৩ + ৪ + ৫ = ১৪।
ক্ষুদ্রতর অংশ = ৯৮০০ এর (২/১৪) = ৯৮০০ × ১/৭ = ১৪০০ টাকা।
বৃহত্তর অংশ = ৯৮০০ এর (৫/১৪) = ৩৫০০ টাকা।
পার্থক্য = ৩৫০০ - ১৪০০ = ২১০০ টাকা।
বিকল্প: বৃহত্তর ও ক্ষুদ্রতর অংশের অনুপাতের পার্থক্য = ৫ - ২ = ৩। সুতরাং, পার্থক্য = ৯৮০০ × (৩/১৪) = ২১০০ টাকা।`,
        subject: 'গণিত',
        topic: 'পাটিগণিত',
        subTopic: 'অনুপাত ও সমানুপাত',
        sortOrder: 83,
      },
      {
        questionSetId,
        questionText: '৮৪. log√33 + log42 = কত?',
        optionA: '2/5',
        optionB: '5/2',
        optionC: '7/4',
        optionD: '11/2',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) 5/2

ব্যাখ্যা: 
প্রশ্নটিতে টাইপো আছে। সঠিক প্রশ্ন হবে: log_{√3}(3) + log_{4}(2) = কত?
log_{√3}(3) = log_{√3}((√3)²) = 2 × log_{√3}(√3) = 2 × 1 = 2
log_{4}(2) = log_{4}(√4) = log_{4}(4^{1/2}) = 1/2 × log_{4}(4) = 1/2
সুতরাং যোগফল = 2 + 1/2 = 5/2।`,
        subject: 'গণিত',
        topic: 'বীজগণিত',
        subTopic: 'লগারিদম',
        sortOrder: 84,
      },
      {
        questionSetId,
        questionText: '৮৫. অর্ধবৃত্তস্থ কোণের মান কত?',
        optionA: '60°',
        optionB: '70°',
        optionC: '90°',
        optionD: '120°',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) 90°

ব্যাখ্যা: 
জ্যামিতির একটি অন্যতম মৌলিক উপপাদ্য হলো: "অর্ধবৃত্তস্থ কোণ এক সমকোণ"। 
অর্থাৎ, একটি বৃত্তের ব্যাসকে ভূমি ধরে বৃত্তের পরিধির ওপর যেকোনো বিন্দুতে কোণ আঁকলে তার মান সর্বদা 90° (এক সমকোণ) হবে।`,
        subject: 'গণিত',
        topic: 'জ্যামিতি',
        subTopic: 'বৃত্ত',
        sortOrder: 85,
      },
      {
        questionSetId,
        questionText: '৮৬. (√3 × √5)^4 এর মান কত?',
        optionA: '30',
        optionB: '60',
        optionC: '225',
        optionD: '150',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) 225

ব্যাখ্যা: 
(√3 × √5)^4
= (√15)^4
= (15^(1/2))^4
= 15^2
= 225।`,
        subject: 'গণিত',
        topic: 'বীজগণিত',
        subTopic: 'সূচক',
        sortOrder: 86,
      },
      {
        questionSetId,
        questionText: '৮৭. যদি a² + 1/a² = 51 হয়, তবে (a – 1/a) এর মান কত?',
        optionA: '±9',
        optionB: '±7',
        optionC: '±5',
        optionD: '±3',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) ±7

ব্যাখ্যা: 
দেওয়া আছে, a² + 1/a² = 51
আমরা জানি, (a – 1/a)² = a² + 1/a² - 2.a.(1/a)
= a² + 1/a² - 2
= 51 - 2
= 49
সুতরাং, a - 1/a = ±√49 = ±7।`,
        subject: 'গণিত',
        topic: 'বীজগণিত',
        subTopic: 'মান নির্ণয়',
        sortOrder: 87,
      },
      {
        questionSetId,
        questionText: '৮৮. যদি (a/b)^(x–3) = (b/a)^(x–5) হয়, তবে x এর মান কত?',
        optionA: '8',
        optionB: '5',
        optionC: '4',
        optionD: '3',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) 4

ব্যাখ্যা: 
দেওয়া আছে, (a/b)^(x-3) = (b/a)^(x-5)
ডানপাশের ভগ্নাংশটি উল্টে দিলে সূচকের চিহ্ন পরিবর্তন হবে:
বা, (a/b)^(x-3) = (a/b)^{-(x-5)}
বা, (a/b)^(x-3) = (a/b)^(-x+5)
ভিত্তি এক হলে সূচক সমান হবে:
x - 3 = -x + 5
বা, 2x = 8
বা, x = 4।`,
        subject: 'গণিত',
        topic: 'বীজগণিত',
        subTopic: 'সূচক',
        sortOrder: 88,
      },
      {
        questionSetId,
        questionText: '৮৯. যদি x = y^a, y = z^b এবং z = x^c হয়, তখন abc এর মান হয়-',
        optionA: '4',
        optionB: '3',
        optionC: '2',
        optionD: '1',
        correctAnswer: 'D',
        explanation: `সঠিক উত্তর: (ঘ) 1

ব্যাখ্যা: 
দেওয়া আছে, x = y^a 
y-এর মান বসালে, x = (z^b)^a = z^(ab)
আবার z-এর মান বসালে, x = (x^c)^(ab) = x^(abc)
বা, x^1 = x^(abc)
যেহেতু ভিত্তি একই, সুতরাং সূচকগুলো সমান হবে।
অতএব, abc = 1।`,
        subject: 'গণিত',
        topic: 'বীজগণিত',
        subTopic: 'সূচক',
        sortOrder: 89,
      },
      {
        questionSetId,
        questionText:
          '৯০. তিনটি বাহুর দৈর্ঘ্য সেন্টিমিটারে দেওয়া হলো। কোন ক্ষেত্রে ত্রিভুজ অঙ্কন করা সম্ভব?',
        optionA: '2, 5 এবং 8',
        optionB: '5, 4 এবং 9',
        optionC: '3, 4 এবং 5',
        optionD: 'সকল ক্ষেত্রে',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) 3, 4 এবং 5

ব্যাখ্যা: 
ত্রিভুজ গঠনের শর্ত হলো: "ত্রিভুজের যেকোনো দুই বাহুর সমষ্টি তৃতীয় বাহু অপেক্ষা বৃহত্তর হতে হবে।"
(ক) ২ + ৫ = ৭, যা ৮ এর চেয়ে ছোট (ত্রিভুজ হবে না)।
(খ) ৫ + ৪ = ৯, যা তৃতীয় বাহু ৯ এর সমান (ত্রিভুজ হবে না)।
(গ) ৩ + ৪ = ৭, যা ৫ এর চেয়ে বড়। তাই এটি দিয়ে ত্রিভুজ আঁকা সম্ভব (এটি একটি সমকোণী ত্রিভুজ)।`,
        subject: 'গণিত',
        topic: 'জ্যামিতি',
        subTopic: 'ত্রিভুজ',
        sortOrder: 90,
      },
      {
        questionSetId,
        questionText:
          '৯১. একটি আয়তকার ঘরের প্রস্থ তার দৈর্ঘ্যের ২/৩ অংশ। ঘরটির পরিসীমা ৪০ মিটার হলে তার ক্ষেত্রফল কত বর্গমিটার?',
        optionA: '৯৬',
        optionB: '৭২',
        optionC: '৬৪',
        optionD: '৬০',
        correctAnswer: 'A',
        explanation: `সঠিক উত্তর: (ক) ৯৬

ব্যাখ্যা: 
ধরি, দৈর্ঘ্য = ৩x মিটার। তাহলে প্রস্থ = ৩x × (২/৩) = ২x মিটার।
পরিসীমা = ২(দৈর্ঘ্য + প্রস্থ) = ২(৩x + ২x) = ১০x মিটার।
প্রশ্নমতে, ১০x = ৪০
বা, x = ৪
সুতরাং, দৈর্ঘ্য = ৩×৪ = ১২ মিটার এবং প্রস্থ = ২×৪ = ৮ মিটার।
ক্ষেত্রফল = দৈর্ঘ্য × প্রস্থ = ১২ × ৮ = ৯৬ বর্গমিটার।`,
        subject: 'গণিত',
        topic: 'পরিমিতি',
        subTopic: 'আয়তক্ষেত্র',
        sortOrder: 91,
      },
      {
        questionSetId,
        questionText: '৯২. যদি 3^m = 81 হয়, তবে m^3 = ?',
        optionA: '9',
        optionB: '16',
        optionC: '27',
        optionD: '64',
        correctAnswer: 'D',
        explanation: `সঠিক উত্তর: (ঘ) 64

ব্যাখ্যা: 
দেওয়া আছে, 3^m = 81
বা, 3^m = 3^4 (যেহেতু 3 × 3 × 3 × 3 = 81)
ভিত্তি এক হওয়ায়, m = 4।
অতএব, m^3 = 4^3 = 4 × 4 × 4 = 64।`,
        subject: 'গণিত',
        topic: 'বীজগণিত',
        subTopic: 'সূচক',
        sortOrder: 92,
      },
      {
        questionSetId,
        questionText: '৯৩. একটি ত্রিভুজের কোণগুলোর অনুপাত হচ্ছে 2 : 3 : 4। কোণগুলোর মান হচ্ছে-',
        optionA: '80°, 120°, 160°',
        optionB: '40°, 60°, 80°',
        optionC: '30°, 45°, 15°',
        optionD: '30°, 50°, 90°',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) 40°, 60°, 80°

ব্যাখ্যা: 
ত্রিভুজের তিন কোণের সমষ্টি = 180°।
অনুপাতের রাশিগুলোর যোগফল = 2 + 3 + 4 = 9।
প্রথম কোণ = 180° × (2/9) = 40°
দ্বিতীয় কোণ = 180° × (3/9) = 60°
তৃতীয় কোণ = 180° × (4/9) = 80°
অতএব কোণগুলো হলো: 40°, 60°, 80°।`,
        subject: 'গণিত',
        topic: 'জ্যামিতি',
        subTopic: 'ত্রিভুজ',
        sortOrder: 93,
      },
      {
        questionSetId,
        questionText:
          '৯৪. যদি একটি রম্বসের কর্ণদ্বয় যথাক্রমে 4 সে.মি. এবং 6 সে.মি. হয়, তবে রম্বসের ক্ষেত্রফল কত বর্গ সে.মি.?',
        optionA: '6',
        optionB: '8',
        optionC: '12',
        optionD: '24',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) 12

ব্যাখ্যা: 
রম্বসের ক্ষেত্রফলের সূত্র = (1/2) × কর্ণদ্বয়ের গুণফল।
এখানে কর্ণদ্বয় d1 = 4 সে.মি. এবং d2 = 6 সে.মি.।
ক্ষেত্রফল = (1/2) × 4 × 6 = 12 বর্গ সে.মি.।`,
        subject: 'গণিত',
        topic: 'পরিমিতি',
        subTopic: 'রম্বস',
        sortOrder: 94,
      },
      {
        questionSetId,
        questionText: '৯৫. 1 – a² + 2ab – b² এর উৎপাদক কোনটি?',
        optionA: '(1 + a – b) (1 – a + b)',
        optionB: '(1 + a + b) (1 – a + b)',
        optionC: '(1 + a + b) (1 – a – b)',
        optionD: '(1 – a + b) (1 – a – b)',
        correctAnswer: 'A',
        explanation: `সঠিক উত্তর: (ক) (1 + a – b) (1 – a + b)

ব্যাখ্যা: 
প্রদত্ত রাশি = 1 - (a² - 2ab + b²)
= 1² - (a - b)²
এটি x² - y² এর সূত্রে পড়ে, যার মান (x + y)(x - y)।
= {1 + (a - b)} {1 - (a - b)}
= (1 + a - b) (1 - a + b)।`,
        subject: 'গণিত',
        topic: 'বীজগণিত',
        subTopic: 'উৎপাদকে বিশ্লেষণ',
        sortOrder: 95,
      },
      {
        questionSetId,
        questionText: '৯৬. 4x² – 20x এর সাথে কত যোগ করলে যোগফল পূর্ণবর্গ হবে?',
        optionA: '4',
        optionB: '9',
        optionC: '16',
        optionD: '25',
        correctAnswer: 'D',
        explanation: `সঠিক উত্তর: (ঘ) 25

ব্যাখ্যা: 
প্রদত্ত রাশি: 4x² - 20x
একে (a - b)² = a² - 2ab + b² আকারে সাজাতে হবে।
4x² - 20x = (2x)² - 2.(2x).5
এখানে a = 2x এবং b = 5। 
পূর্ণবর্গ করতে হলে শেষে b² অর্থাৎ 5² বা 25 যোগ করতে হবে।
তাহলে রাশিটি হবে: (2x)² - 2.(2x).5 + 5² = (2x - 5)², যা একটি পূর্ণবর্গ রাশি।`,
        subject: 'গণিত',
        topic: 'বীজগণিত',
        subTopic: 'বর্গ নির্ণয়',
        sortOrder: 96,
      },
      {
        questionSetId,
        questionText: '৯৭. 70° কোণের সম্পূরক কোণ কোনটি?',
        optionA: '20°',
        optionB: '110°',
        optionC: '220°',
        optionD: '290°',
        correctAnswer: 'B',
        explanation: `সঠিক উত্তর: (খ) 110°

ব্যাখ্যা: 
দুটি কোণের সমষ্টি 180° হলে একটিকে অপরটির সম্পূরক কোণ (Supplementary angle) বলে।
সুতরাং, 70° কোণের সম্পূরক কোণ = 180° - 70° = 110°।
(বি.দ্র. পূরক কোণ বললে 90° - 70° = 20° হতো)।`,
        subject: 'গণিত',
        topic: 'জ্যামিতি',
        subTopic: 'রেখা ও কোণ',
        sortOrder: 97,
      },
      {
        questionSetId,
        questionText: '৯৮. x³ – 1, x³ + 1, x⁴ + x² + 1 এর ল.সা.গু কত?',
        optionA: 'x⁸ – 1',
        optionB: 'x⁷ – 1',
        optionC: 'x⁶ – 1',
        optionD: 'x⁵ – 1',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) x⁶ – 1

ব্যাখ্যা: 
১ম রাশি = x³ - 1 = (x - 1)(x² + x + 1)
২য় রাশি = x³ + 1 = (x + 1)(x² - x + 1)
৩য় রাশি = x⁴ + x² + 1 = (x²)² + 2.x².1 + 1² - x² = (x² + 1)² - x² = (x² + x + 1)(x² - x + 1)
ল.সা.গু = (x - 1)(x² + x + 1) × (x + 1)(x² - x + 1)
= (x³ - 1)(x³ + 1)
= (x³)² - 1²
= x⁶ - 1।`,
        subject: 'গণিত',
        topic: 'বীজগণিত',
        subTopic: 'ল.সা.গু ও গ.সা.গু',
        sortOrder: 98,
      },
      {
        questionSetId,
        questionText: '৯৯. ABCD চতুর্ভূজে AB || CD, AC = BD এবং ∠A = 90° হলে সঠিক চতুর্ভুজ কোনটি?',
        optionA: 'সামান্তরিক',
        optionB: 'রম্বস',
        optionC: 'আয়তক্ষেত্র',
        optionD: 'ট্রাপিজিয়াম',
        correctAnswer: 'C',
        explanation: `সঠিক উত্তর: (গ) আয়তক্ষেত্র

ব্যাখ্যা: 
এখানে AB || CD (বিপরীত বাহু সমান্তরাল)। 
কর্ণদ্বয় সমান (AC = BD) এবং একটি কোণ সমকোণ (∠A = 90°)।
যে চতুর্ভুজের বিপরীত বাহু সমান্তরাল, কর্ণদ্বয় পরস্পর সমান এবং প্রতিটি কোণ সমকোণ, তাকে আয়তক্ষেত্র বলে।`,
        subject: 'গণিত',
        topic: 'জ্যামিতি',
        subTopic: 'চতুর্ভুজ',
        sortOrder: 99,
      },
      {
        questionSetId,
        questionText: '১০০. 2ⁿ ÷ 2^{n–1} = কত?',
        optionA: '2',
        optionB: '2^{n+1}',
        optionC: '2ⁿ',
        optionD: '2^{n–1}',
        correctAnswer: 'A',
        explanation: `সঠিক উত্তর: (ক) 2

ব্যাখ্যা: 
সূচকের নিয়ম অনুযায়ী ভিত্তি একই হলে ভাগের সময় পাওয়ার বা সূচক বিয়োগ হয়।
2ⁿ ÷ 2^{n-1} 
= 2^{n - (n - 1)}
= 2^{n - n + 1}
= 2¹
= 2।`,
        subject: 'গণিত',
        topic: 'বীজগণিত',
        subTopic: 'সূচক',
        sortOrder: 100,
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
