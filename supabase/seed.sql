-- seed.sql
-- Initial seed data for Madrasa website

-- 1. Insert Initial Site Settings
INSERT INTO public.site_settings (
  id,
  madrasa_name_en,
  madrasa_name_ur,
  tagline_en,
  tagline_ur,
  logo_url,
  hero_badge_en,
  hero_badge_ur,
  hero_title_en,
  hero_title_ur,
  hero_subtitle_en,
  hero_subtitle_ur,
  hero_image_url,
  about_heading_en,
  about_heading_ur,
  about_history_en,
  about_history_ur,
  about_mission_en,
  about_mission_ur,
  about_vision_en,
  about_vision_ur,
  about_objectives_en,
  about_objectives_ur,
  intro_video_title_en,
  intro_video_title_ur,
  intro_video_desc_en,
  intro_video_desc_ur,
  intro_video_url,
  intro_video_thumb,
  phone,
  email,
  address_en,
  address_ur,
  whatsapp,
  donation_enabled,
  donation_qr_url,
  upi_id,
  bank_name,
  account_holder,
  account_number,
  ifsc_code,
  branch,
  donation_instructions_en,
  donation_instructions_ur,
  footer_text_en,
  footer_text_ur,
  copyright_text_en,
  copyright_text_ur
) VALUES (
  'current',
  'Madrasa Rabbani Baug',
  'جامعہ ربانی باغ اسلامی تعلیمی ٹرسٹ',
  'Centre for Classical Islamic Learning, Hifz-ul-Quran & Character Building',
  'مرکزِ علومِ اسلامیہ، حفظ القرآن اور اخلاقی تربیت',
  'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=250',
  'Serving Sacred Education with Trust & Integrity',
  'دینی تعلیم اور اخلاقی کردار سازی کا معتبر و منظم ادارہ',
  'Nurturing Minds with the Light of the Holy Quran & Sunnah',
  'قرآن و سنت کی پاکیزہ روشنی میں نئی نسل کی دینی و اخلاقی نشوونما',
  'Dedicated to comprehensive memorization of the Holy Quran, classical Arabic sciences, and disciplined character formation for the next generation.',
  'قرآن کریم کے حفظ و تجوید، بنیادی اسلامی علوم اور باکردار اخلاقی تربیت کے لیے ایک پرسکون، منظم اور معیاری دینی تعلیمی ادارہ۔',
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200',
  'About Our Educational Institution',
  'ہمارے ادارے کا تعارف اور پس منظر',
  'Established with the objective of preserving traditional Islamic literacy and moral guidance, Madrasa Rabbani Baug provides an integrated environment where students memorize the Holy Quran while nurturing sound Islamic ethics, cleanliness, and responsibility.',
  'جامعہ ربانی باغ کا بنیادی مقصد نئی نسل کو حفظِ کلامِ پاک کے ساتھ ساتھ اسلامی عقائد، بنیادی فقہی مسائل اور پاکیزہ اخلاق سے آراستہ کرنا ہے۔ یہاں مستحق اور یتیم طلبہ کو بھی معیاری ماحول اور مفت تعلیم فراہم کی جاتی ہے۔',
  'To provide every enrolled child with deep Quranic comprehension, disciplined behavior, and a heart full of compassion and civic responsibility.',
  'ہر طالب علم میں قرآنی شعور، باوقار کردار اور انسانیت کی بے لوث خدمت کا جذبہ پیدا کرنا۔',
  'To be recognized as a premier sanctuary of traditional Islamic learning that produces upright, knowledgeable citizens.',
  'ایک ایسا مثالی اسلامی تعلیمی مرکز بننا جو روایتی دینی تعلیم اور متوازن عملی زندگی کا بہترین نمونہ پیش کرے۔',
  '1. Rigorous Hifz-ul-Quran curriculum under certified Asatizah.\n2. Tajweed according to classical riwayaat.\n3. Daily moral discourses (Tarbiyah and Sunnah etiquette).\n4. 100% free boarding and nutritional meals for needy and orphan learners.',
  '۱۔ سند یافتہ اساتذہ کی زیرِ نگرانی حفظِ قرآن کریم کا مکمل نصاب۔\n۲۔ قواعدِ تجوید و ترتیل کی عملی مشق۔\n۳۔ روزانہ سنتِ نبوی کے مطابق آداب و اخلاق کی عملی تربیت۔\n۴۔ یتیم اور نادار طلبہ کے لیے مکمل مفت طعام، قیام اور طبی دیکھ بھال۔',
  'Daily Quranic Recitation & Student Life',
  'مدرسہ میں طلبہ کے روزمرہ تعلیمی معمولات کی جھلک',
  'Experience the peaceful atmosphere of our classrooms, collective morning assemblies, and Tajweed practice sessions.',
  'حلقۂ درس، صبح کی مجالس اور طلبہ کرام کے باقاعدہ تعلیمی و تربیتی معمولات کا مختصر و روح پرور مشاہدہ۔',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&q=80&w=1200',
  '+91 98765 43210',
  'contact@rabbanibaug.edu',
  'Rabbani Baug Campus, Education Road, Dist. Cultural Heritage, India',
  'ربانی باغ کیمپس، ایجوکیشن روڈ، ضلع ثقافتی مرکز، بھارت',
  '+91 98765 43210',
  true,
  '',
  'madrasa@upi',
  'State Bank of India',
  'Madrasa Rabbani Baug Educational Trust',
  '389201928312',
  'SBIN0001234',
  'Central Branch',
  'Scan the verified QR code using any UPI payment app (Google Pay, PhonePe, Paytm, BHIM, or Banking Apps). For direct NEFT/RTGS transfers, use the official bank details provided below.',
  'کسی بھی یو پی آئی ایپ (Google Pay، PhonePe، Paytm وغیرہ) کے ذریعے براہِ راست کیو آر کوڈ اسکین کرکے تعاون فرمائیں۔ آفیشل بینک اکاؤنٹ میں منتقلی کے لیے نیچے دی گئی تفصیلات استعمال فرمائیں۔',
  'A non-profit educational and welfare trust dedicated to Quranic education, character building, and community support.',
  'ایک غیر منافع بخش دینی و فلاحی ادارہ جو قرآنی تعلیم، کردار سازی اور مستحقین کی کفالت کے لیے کوشاں ہے۔',
  'All rights reserved. Madrasa Rabbani Baug Educational Trust.',
  'جملہ حقوق بحق جامعہ ربانی باغ تعلیمی ٹرسٹ محفوظ ہیں۔'
) ON CONFLICT (id) DO UPDATE SET updated_at = now();

-- 2. Insert Homepage Sections
INSERT INTO public.homepage_sections (section_key, title_en, title_ur, subtitle_en, subtitle_ur, is_visible, display_order)
VALUES
  ('hero', 'Hero Banner', 'مرکزی بینر', 'Main welcome message and introduction', 'مرکزی تعارفی پیغام', true, 1),
  ('about', 'About the Madrasa', 'مدرسہ کا تعارف', 'History, mission, and institutional vision', 'تاریخ، مشن اور مقاصد', true, 2),
  ('video', 'Introductory Video', 'تعارفی ویڈیو', 'Visual tour and student daily life', 'تعلیمی ماحول کا ویڈیو مشاہدہ', true, 3),
  ('programs', 'Educational Programs', 'تعلیمی شعبہ جات', 'Overview of departments and courses', 'مختلف کورسز اور تعلیمی درجات', true, 4),
  ('impact', 'Students & Impact', 'طلبہ اور تعلیمی خدمات', 'Verified statistics of students and staff', 'طلبہ و اساتذہ کے تصدیق شدہ اعداد و شمار', true, 5),
  ('needs', 'Current Needs & Support', 'ادارے کی موجودہ ضروریات', 'Active appeals for infrastructure and welfare', 'تعمیری اور تعلیمی امداد کی اپیلیں', true, 6),
  ('documents', 'Legal & Transparency', 'قانونی دستاویزات و شفافیت', 'Publicly approved registration certificates', 'منظور شدہ سرکاری و انتظامی اسناد', true, 7),
  ('donation', 'Contribution & Donation', 'تعاون اور عطیات', 'Direct QR scan and bank transfer details', 'کیو آر کوڈ اور بینک اکاؤنٹ کی تفصیلات', true, 8)
ON CONFLICT (section_key) DO NOTHING;

-- 3. Insert Educational Programs
INSERT INTO public.programs (title_en, title_ur, slug, short_desc_en, short_desc_ur, detailed_desc_en, detailed_desc_ur, age_group_en, age_group_ur, timing_en, timing_ur, curriculum_highlights_en, curriculum_highlights_ur, image_url, display_order, is_published)
VALUES
  (
    'Hifz-ul-Quran (Full Memorization)',
    'شعبۂ حفظِ قرآن کریم',
    'hifz-ul-quran',
    'Comprehensive memorization of the entire Holy Quran under certified Huffaz with daily revision.',
    'مستند حفاظ کرام کی زیرِ نگرانی کلامِ الٰہی کا مکمل حفظ اور روزانہ کا پختہ دور۔',
    'Our flagship program focuses on complete memorization of the Holy Quran with precise pronunciation, classical Tajweed rules, and methodical daily revision (Daur). Students are nurtured in a disciplined residential and day-boarding environment with individualized monitoring.',
    'اس مبارک شعبے میں طلبہ کو تجوید کے ساتھ کلامِ پاک کے ۳۰ پاروں کا پختہ حفظ کرایا جاتا ہے۔ روزانہ سبق، سبقی اور منزل کا باقاعدہ جائزہ لیا جاتا ہے تاکہ حافظ بننے کے بعد قرآن کریم دلوں میں محفوظ رہے۔',
    'Ages 8 to 16 years',
    'عمر ۸ تا ۱۶ سال',
    'Full-Time / Boarding (Fajr to Isha with structured breaks)',
    'مکمل وقتی / شبانہ و روزانہ',
    'Daily Sabbaq, Sabqi, and Manzil reviews; Tajweed articulation rules; Duas and Sunnah manners.',
    'روزانہ نیا سبق، سبقی اور منزل؛ مخارج اور قواعدِ تجوید؛ مسنون دعائیں اور سنتِ نبوی کے آداب۔',
    'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=800',
    1,
    true
  ),
  (
    'Nazra Quran with Tajweed',
    'شعبۂ ناظرہ مع تجوید',
    'nazra-quran-tajweed',
    'Foundational recitation from Noorani Qaida to full Quranic fluent reading.',
    'نورانی قاعدہ سے لے کر مکمل قرآن مجید کو درست تلفظ اور روانی کے ساتھ پڑھنے کی بنیادی تعلیم۔',
    'Designed for beginners and young learners to build flawless phonetics and recitation habits. Emphasis is laid on Makharij (points of vocal articulation) and foundational Arabic alphabet recognition.',
    'یہ شعبہ نونہالوں اور ابتدائی طلبہ کے لیے مختص ہے جہاں نورانی قاعدے کے ذریعے حروف کی درست ادائیگی، تجوید کے بنیادی قواعد اور روانی سے تلاوت سکھائی جاتی ہے۔',
    'Ages 5 to 12 years',
    'عمر ۵ تا ۱۲ سال',
    'Morning & Afternoon Shifts (2 hours daily)',
    'صبح اور بعد دوپہر کے اوقات (روزانہ ۲ گھنٹے)',
    'Arabic phonetics, Noorani Qaida, 30th Juz memorization, daily Islamic supplications.',
    'حروفِ تہجی کے مخارج، نورانی قاعدہ، آخری پارہ کی سورتوں کا زبانی حفظ اور روزمرہ دعائیں۔',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
    2,
    true
  ),
  (
    'Deeni Taleem & Islamic Basics',
    'بنیادی دینی تعلیم و اخلاقیات',
    'deeni-taleem-basics',
    'Essential Islamic jurisprudence (Fiqh of Taharah & Salah), Aqeedah, and Seerat-un-Nabi.',
    'طہارت، نماز کے مسائل، اسلامی عقائد اور سیرت النبی ﷺ کی بنیادی و ضروری تعلیم۔',
    'Provides foundational religious literacy alongside Quranic studies. Students learn the essentials of Halal and Haram, practical performance of prayers, hygiene, and the golden examples of the Prophet (Peace Be Upon Him).',
    'طلبہ کو روزمرہ زندگی کے لیے ضروری دینی معلومات فراہم کی جاتی ہیں، جن میں وضو، نماز، پاکی و ناپاکی کے احکام، ضروری عقائد اور سیرتِ طیبہ شامل ہیں۔',
    'All Enrolled Students',
    'تمام زیرِ تعلیم طلبہ',
    'Integrated into daily class schedule',
    'روزانہ کے تعلیمی نظام الاوقات کا حصہ',
    'Practical Wudu & Salah practice, 40 Hadiths, Islamic manners and respectful conduct.',
    'وضو اور نماز کی عملی مشق، ۴۰ منتخب احادیث، والدین اور اساتذہ کے ادب و احترام کے آداب۔',
    'https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&q=80&w=800',
    3,
    true
  ),
  (
    'Evening Quran Learning for Adults & Youths',
    'نوجوانوں اور بڑوں کے لیے شام کا قرآنی حلقہ',
    'evening-adult-quran',
    'Flexible evening classes for working youths and adults to rectify pronunciation and learn translation.',
    'ملازمت پیشہ نوجوانوں اور بزرگوں کے لیے شام کے وقت قرآن درست پڑھنے کا خصوصی حلقہ۔',
    'Tailored for working individuals and college students who wish to rectify their recitation, learn basic Quranic vocabulary, and understand essential injunctions of the faith.',
    'یہ کلاس ان حضرات کے لیے ہے جو روزگار کے ساتھ ساتھ اپنے فارغ اوقات میں تلاوت درست کرنا اور دین کے بنیادی احکام سمجھنا چاہتے ہیں۔',
    'Ages 16 and above',
    'عمر ۱۶ سال سے زائد',
    'Post-Maghrib to Isha (Flexible days)',
    'بعد نمازِ مغرب تا عشاء',
    'Tajweed rectification, basic Quranic vocabulary, Qiyam-ul-Layl practice.',
    'تجوید کی اصلاح، قرآنی الفاظ کے بنیادی معانی، نماز کے اذکار کی تصحیح۔',
    'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=800',
    4,
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- 4. Insert Problems / Current Needs
INSERT INTO public.problems (title_en, title_ur, slug, summary_en, summary_ur, description_en, description_ur, why_needed_en, why_needed_ur, requested_amount, status, image_url, donation_note_en, donation_note_ur, display_order, is_published)
VALUES
  (
    'Student Hostel Clean Drinking Water & Filtration Plant',
    'طلبہ کے ہاسٹل کے لیے صاف پینے کا پانی اور آر او فلٹر پلانٹ',
    'clean-drinking-water-plant',
    'Installing a commercial RO purification system to ensure hygienic drinking water for residential learners.',
    'ہاسٹل کے طلبہ کے لیے صحت بخش اور جراثیم سے پاک پینے کا پانی مہیا کرنے کے لیے واٹر فلٹر پلانٹ کی تنصیب۔',
    'With more than 400 students residing and studying on campus, the current ground water supply has high mineral hardness. To prevent water-borne illnesses and ensure child health, an industrial filtration unit is urgently needed.',
    'کیمپس میں مقیم سینکڑوں طلبہ کے لیے زمینی پانی میں نمکیات زیادہ ہونے کی وجہ سے فلٹریشن پلانٹ کی سخت ضرورت ہے تاکہ بچے بیماریوں سے محفوظ رہ کر اطمینان کے ساتھ تعلیم حاصل کر سکیں۔',
    'Protects young students from seasonal water contamination and gastrointestinal illness during long study months.',
    'طلبہ کی صحت کی حفاظت اور موسمی بیماریوں سے بچاؤ کے لیے یہ بنیادی ضرورت ہے۔',
    '₹ 1,75,000',
    'active',
    'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&q=80&w=800',
    'You can contribute any amount towards this project via our QR code. Mention "Water Project" in your transaction note if possible.',
    'آپ کیو آر کوڈ کے ذریعے اس تعمیری ضرورت میں حسبِ توفیق حصہ لے سکتے ہیں۔',
    1,
    true
  ),
  (
    'Orphan & Needy Students Education & Boarding Sponsorship',
    'یتیم اور نادار طلبہ کی مکمل تعلیمی و رہائشی کفالت',
    'orphan-students-sponsorship',
    'Providing complete free education, clothing, books, and 3 nutritious daily meals for underprivileged learners.',
    'مستحق اور یتیم طلبہ کے لیے مفت کتب، یونیفارم، علاج معالجہ اور تینوں وقت کے معیاری طعام کی فراہمی۔',
    'A significant portion of our students come from impoverished rural households or have lost their breadwinners. The Madrasa provides them 100% free food, bedding, clothing, medical care, and learning materials.',
    'ہمارے مدرسہ میں زیرِ تعلیم طلبہ کی بڑی تعداد انتہائی غریب اور یتیم بچوں پر مشتمل ہے جن کے طعام، رہائش، علاج اور کتب کی تمام تر ذمہ داری جامعہ بخوشی ادا کر رہی ہے۔',
    'Ensures that no dedicated seeker of knowledge is turned away due to financial helplessness.',
    'کوئی بھی طالب علم مالی مجبوری یا غربت کی وجہ سے علمِ دین کی دولت سے محروم نہ رہے۔',
    '₹ 2,400 / month per student',
    'active',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
    'Sponsor a student for one month (₹ 2,400) or one year (₹ 28,800). Every contribution directly aids a child in memorizing the Book of Allah.',
    'ایک طالب علم کی ماہانہ کفالت ۲۴۰۰ روپے یا سالانہ کفالت میں حصہ ڈال کر صدقۂ جاریہ حاصل فرمائیں۔',
    2,
    true
  ),
  (
    'Library Quranic Manuscripts & Reference Tafseer Collection',
    'مکتبہ کے لیے تفاسیر اور مستند کتبِ حدیث کا ذخیرہ',
    'library-tafseer-collection',
    'Procuring authentic multi-volume Tafseers, Hadith dictionaries, and classical Arabic linguistic references.',
    'اساتذہ اور طلبہ کے مطالعہ کے لیے معتبر تفاسیر، شروحاتِ حدیث اور عربی لغات کی فراہمی۔',
    'To enrich the intellectual and scholarly foundation of both teachers and senior students, our reference library requires standard classical commentaries and pedagogical resources.',
    'اساتذہ کی علمی تیاری اور طلبہ کی تحقیقی صلاحیتوں کو نکھارنے کے لیے مکتبہ میں بنیادی علمی و فقہی مصادر کا ہونا ناگزیر ہے۔',
    'Empowers teachers to provide thorough, referenced answers to student queries.',
    'اساتذہ اور طلبہ کے لیے مستند تحقیقی مواد اور کتبِ حوالہ کی دستیابی۔',
    '₹ 85,000',
    'active',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800',
    'Support the procurement of classical texts as a perpetual charitable endowment (Sadaqah Jariyah).',
    'علمی کتب کا وقف صدقۂ جاریہ ہے، اس کارِ خیر میں اپنا حصہ ضرور شامل فرمائیں۔',
    3,
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- 5. Insert Student Statistics
INSERT INTO public.student_statistics (label_en, label_ur, value, subtext_en, subtext_ur, icon_name, year_or_period, display_order, is_published)
VALUES
  ('Enrolled Students', 'کل زیرِ تعلیم طلبہ', '420+', 'Across all foundational and Hifz classes', 'تمام تعلیمی اور حفظ کے شعبوں میں', 'Users', 'Current Session', 1, true),
  ('Certified Asatizah (Teachers)', 'سند یافتہ مخلص اساتذہ', '18', 'Experienced Huffaz and Islamic Scholars', 'ماہر حفاظ اور باعمل علماء کرام', 'GraduationCap', 'Academic Staff', 2, true),
  ('Free Food & Boarding', 'مفت طعام و رہائش', '100%', 'Provided to orphan and needy learners', 'یتیم اور مستحق طلبہ کے لیے مکمل سہولت', 'HeartHandshake', 'Welfare Program', 3, true),
  ('Graduated Huffaz', 'فارغ التحصیل حفاظِ کرام', '340+', 'Serving communities in various capacities', 'جو معاشرے میں قرآن کی روشنی پھیلا رہے ہیں', 'Award', 'Historical Total', 4, true)
ON CONFLICT DO NOTHING;

-- 6. Insert Student Activities
INSERT INTO public.student_activities (title_en, title_ur, description_en, description_ur, category_en, category_ur, activity_date, image_url, display_order, is_published)
VALUES
  (
    'Annual Husn-e-Qirat & Tajweed Competition',
    'سالانہ مسابقۂ حسنِ قرآت و ترتیل',
    'Students showcased their recitation mastery evaluated by external visiting Qaris on phonetics and melodious delivery.',
    'طلبہ کرام کے مابین حسنِ قرآت کا روح پرور مقابلہ جس میں مہمان قراء کرام نے منصف کے فرائض انجام دیے۔',
    'Competition',
    'مسابقہ',
    '2026-09-15',
    'https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&q=80&w=800',
    1,
    true
  ),
  (
    'Dastar-e-Fazilat (Hifz Completion Graduation Ceremony)',
    'جلسۂ دستارِ فضیلت و تکمیلِ حفظِ قرآن',
    'Honorary graduation assembly where 24 students who completed the full memorization were awarded ceremonial certificates.',
    '۲۴ خوش نصیب طلبہ کی تکمیلِ حفظ کے موقع پر منعقدہ پروقار تقریب جس میں معززین اور والدین نے شرکت فرمائی۔',
    'Graduation Ceremony',
    'تقریبِ دستار بندی',
    '2026-07-20',
    'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=800',
    2,
    true
  ),
  (
    'Seerat-un-Nabi & Moral Etiquette Conference',
    'سیرت النبی ﷺ کانفرنس اور اخلاقی تربیت',
    'Interactive educational gathering emphasizing the character of the Holy Prophet (PBUH) and community hygiene.',
    'حضور اکرم ﷺ کی حیاتِ طیبہ اور باہمی اخلاق و صفائی کی اہمیت پر خصوصی تعلیمی و تربیتی نشست۔',
    'Educational Workshop',
    'تربیتی نشست',
    '2026-05-10',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
    3,
    true
  )
ON CONFLICT DO NOTHING;

-- 7. Insert Legal Documents
INSERT INTO public.legal_documents (title_en, title_ur, description_en, description_ur, category_en, category_ur, file_url, thumbnail_url, issue_date, document_number, is_public, is_published, display_order)
VALUES
  (
    'Madrasa Institutional Society / Trust Registration',
    'سوسائٹی / تعلیمی ٹرسٹ رجسٹریشن سرٹیفکیٹ',
    'Official government registration certificate establishing the legal entity of the educational trust.',
    'سرکاری رجسٹرار آف سوسائٹیز کی جانب سے جاری کردہ تصدیق شدہ ٹرسٹ رجسٹریشن سرٹیفکیٹ۔',
    'Registration Certificate',
    'رجسٹریشن سند',
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600',
    '2014-06-12',
    'REG-TR/2014/8912',
    true,
    true,
    1
  ),
  (
    'Institutional Pan Card & Tax Exemption Verification',
    'ٹرسٹ پین کارڈ و انکم ٹیکس اندراج کی کاپی',
    'Income Tax Department PAN identification issued in the registered name of the educational trust.',
    'انکم ٹیکس ڈپارٹمنٹ کی جانب سے جاری کردہ ٹرسٹ کا تصدیق شدہ مستقل کھاتہ نمبر (PAN)۔',
    'Tax Identification',
    'پین کارڈ سند',
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600',
    '2015-02-18',
    'AAATM9821K',
    true,
    true,
    2
  ),
  (
    'Affiliation Certificate with Central Madrasa Board',
    'مرکزی دینی تعلیمی بورڈ سے الحاق کی سند',
    'Official certificate of curricular affiliation and standardized examination authorization.',
    'مرکزی تعلیمی بورڈ کی جانب سے نصابی الحاق اور باضابطہ امتحانات کی باقاعدہ منظوری۔',
    'Board Affiliation',
    'الحاق نامہ',
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
    '2017-09-05',
    'AFF-BRD-5502',
    true,
    true,
    3
  )
ON CONFLICT DO NOTHING;
