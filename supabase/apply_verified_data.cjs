const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Safely load environment variables from local .env or process.env
function getEnvConfig() {
  const envVars = { ...process.env };
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = (match[2] || '').trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!envVars[key]) envVars[key] = val;
      }
    }
  }
  return envVars;
}

const env = getEnvConfig();
const url = env.VITE_SUPABASE_URL || 'https://vfrmbsiuirqoebmyehnk.supabase.co';
const secretKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY || env.VITE_SUPABASE_ANON_KEY;

if (!secretKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_ANON_KEY is required in environment or .env');
  process.exit(1);
}

const supabase = createClient(url, secretKey, {
  auth: { persistSession: false }
});

async function runMigration() {
  console.log('--- STARTING VERIFIED DATA MIGRATION ---');

  // 1. Update site_settings
  console.log('1. Updating site_settings...');
  const { error: settingsError } = await supabase
    .from('site_settings')
    .upsert({
      id: 'current',
      madrasa_name_en: 'Madrasa Afzal-ul-Maarif Education Trust',
      madrasa_name_ur: 'مدرسہ افضل المعارف ایجوکیشن ٹرسٹ',
      tagline_en: 'Centre for Classical Islamic Learning, Hifz-ul-Quran & Academic Education',
      tagline_ur: 'دینی و عصری تعلیم اور اخلاقی تربیت کا معتبر ادارہ',
      logo_url: '',
      hero_badge_en: 'Dedicated to Religious & Academic Education Since 2002',
      hero_badge_ur: 'سنہ ۲۰۰۲ء سے دینی و عصری تعلیم اور اخلاقی تربیت میں مصروفِ عمل',
      hero_title_en: 'Nurturing Minds with the Light of the Holy Quran & Education',
      hero_title_ur: 'قرآنِ پاک، دینی تعلیم اور عصری علوم کی روشنی میں بچوں کی ہمہ جہت تربیت',
      hero_subtitle_en: 'Providing children with religious and academic education, good character, and proper upbringing to build a better future.',
      hero_subtitle_ur: 'بچوں کو دینی و عصری تعلیم، عمدہ اخلاق اور بہترین تربیت فراہم کرنا تاکہ ان کے روشن اور باوقار مستقبل کی تعمیر ہو سکے۔',
      hero_image_url: '',
      about_heading_en: 'About Madrasa Afzal-ul-Maarif Education Trust',
      about_heading_ur: 'مدرسہ افضل المعارف ایجوکیشن ٹرسٹ کا تعارف',
      about_history_en: 'Operating at rented premises in Agripada, Mumbai since 2002, Madrasa Afzal-ul-Maarif Education Trust has been dedicated to providing children with religious and academic education alongside complete residential facilities, meals, clothing, and moral tarbiyah.',
      about_history_ur: 'سنہ ۲۰۰۲ء سے آگری پاڑہ، ممبئی میں کرایہ کی عمارت میں قائم، مدرسہ افضل المعارف ایجوکیشن ٹرسٹ بچوں کو دینی و عصری تعلیم دینے کے ساتھ ساتھ ان کے قیام، طعام، لباس اور اخلاقی تربیت کی مکمل خدمات انجام دے رہا ہے۔',
      about_mission_en: 'To provide children with religious and academic education, good character, and proper upbringing to build a better future.',
      about_mission_ur: 'بچوں کو دینی و عصری تعلیم، عمدہ اخلاق اور بہترین تربیت فراہم کرنا تاکہ ان کے روشن اور باوقار مستقبل کی تعمیر ہو سکے۔',
      about_vision_en: 'To establish a permanent educational centre that ensures quality Islamic learning, academic schooling, and dignified residential care for all students.',
      about_vision_ur: 'ایک ایسی مستقل اور وسیع عمارت قائم کرنا جہاں طلبہ کو معیاری دینی تعلیم، اسکول کی تعلیم اور باوقار رہائشی سہولیات میسر آ سکیں۔',
      about_objectives_en: '1. Complete Quran education (Qaida, Naazra, and Hifz with Tajweed)\n2. School academic education (Urdu, Hindi, English, and Mathematics)\n3. Memorization of Prophetic Hadith and Masnoon Duas without looking at text\n4. Holistic residential care, weekly pocket money, and moral tarbiyah\n5. Striving towards establishing a permanent educational building',
      about_objectives_ur: '۱۔ تجوید کے ساتھ مکمل قرآنی تعلیم (قاعدہ، ناظرہ اور حفظِ قرآن کریم)\n۲۔ اسکول کی بنیادی عصری تعلیم (اردو، ہندی، انگریزی اور ریاضی)\n۳۔ احادیثِ نبویہ اور مسنون دعاؤں کا زبانی حفظ\n۴۔ طلبہ کی مکمل رہائش، طعام، لباس، ہفتہ وار جیب خرچ اور اخلاقی تربیت\n۵۔ مدرسہ کے لیے ذاتی و مستقل عمارت کا قیام',
      intro_video_title_en: 'Madrasa Activities & Daily Life',
      intro_video_title_ur: 'مدرسہ کے تعلیمی و تربیتی معمولات',
      intro_video_desc_en: 'Official documentary and educational video will be shared shortly.',
      intro_video_desc_ur: 'مدرسہ کے تعلیمی و دستار بندی کا باضابطہ ویڈیو جلد شامل کیا جائے گا۔',
      intro_video_url: '',
      intro_video_thumb: '',
      phone: '9892607755, 9322171099',
      email: 'contact@maarif.org',
      address_en: 'Islam Building Compound, Next to Baug-e-Rabbani Tower, Near Arabic Masjid, Souter Street, Agripada, Mumbai – 400011.',
      address_ur: 'اسلام بلڈنگ کمپاؤنڈ، متصل باغِ ربانی ٹاور، بالمقابل عربک مسجد، سوٹر اسٹریٹ، آگری پاڑہ، ممبئی - 400011',
      whatsapp: '9930797935',
      facebook_url: '',
      youtube_url: '',
      twitter_url: '',
      donation_enabled: true,
      donation_qr_url: '',
      upi_id: '',
      bank_name: '',
      account_holder: 'Madrasa Afzal-ul-Maarif Education Trust',
      account_number: '',
      ifsc_code: '',
      branch: 'Agripada, Mumbai',
      donation_instructions_en: 'Official donation QR code and bank account information will be updated upon administrative verification. Please contact Qari Suleman Saheb (9892607755 / 9322171099) or via WhatsApp (9930797935) for direct guidance.',
      donation_instructions_ur: 'عطیات کی منتقلی کے لیے باضابطہ بینک اکاؤنٹ اور کیو آر کوڈ تصدیق کے بعد جاری کیا جائے گا۔ رہنمائی کے لیے حضرت قاری سلیمان صاحب (9892607755 / 9322171099) یا واٹس ایپ (9930797935) پر رابطہ فرمائیں۔',
      footer_text_en: 'Madrasa Afzal-ul-Maarif Education Trust — Operating since 2002 at Agripada, Mumbai. Dedicated to religious and academic education.',
      footer_text_ur: 'مدرسہ افضل المعارف ایجوکیشن ٹرسٹ — سنہ ۲۰۰۲ء سے آگری پاڑہ، ممبئی میں دینی و عصری تعلیم اور اخلاقی تربیت میں مصروفِ عمل۔',
      copyright_text_en: 'All Rights Reserved. Madrasa Afzal-ul-Maarif Education Trust.',
      copyright_text_ur: 'جملہ حقوق بحق مدرسہ افضل المعارف ایجوکیشن ٹرسٹ محفوظ ہیں۔',
      updated_at: new Date().toISOString()
    });

  if (settingsError) throw new Error('Failed to update site_settings: ' + settingsError.message);
  console.log('✅ site_settings updated successfully.');

  // 2. Replace Educational Programs
  console.log('2. Updating programs...');
  // Delete existing programs
  const { error: delProgError } = await supabase.from('programs').delete().neq('title_en', '__none__');
  if (delProgError) throw new Error('Failed to clean programs: ' + delProgError.message);

  const programsData = [
    {
      title_en: 'Darja-e-Deeniyat (Qaida)',
      title_ur: 'درجہ دینیات (قاعدہ)',
      slug: 'darja-e-deeniyat-qaida',
      short_desc_en: 'Foundational Qaida, basic Islamic education, memorization of Hadith and Masnoon Duas, and Urdu literacy.',
      short_desc_ur: 'بنیادی قاعدہ، ابتدائی اسلامی تعلیمات، زبانی حفظِ احادیث و مسنون دعائیں اور اردو پڑھنا لکھنا۔',
      detailed_desc_en: 'Teaches elementary children correct phonetic recitation of Quranic Qaida with proper pronunciation, foundational Islamic tenets, and memorization of Hadith and Masnoon Duas through repetition without looking at text, along with Urdu reading and writing.',
      detailed_desc_ur: 'چھوٹے بچوں کے لیے قرآن کریم کے درست تلفظ کے ساتھ قاعدہ، بنیادی عقائد و طہارت، زبانی مسنون دعائیں، احادیثِ مبارکہ اور اردو تحریر و قرأت کی باقاعدہ تدریس۔',
      age_group_en: '7–11 years',
      age_group_ur: '۷ تا ۱۱ سال',
      timing_en: 'Daily Classes',
      timing_ur: 'روزانہ تعلیمی اوقات',
      curriculum_highlights_en: '• Qaida recitation with correct Makharij\n• Basic Islamic education and tenets\n• Memorization of Hadith and Masnoon Duas (without looking at text)\n• Urdu reading and writing practice',
      curriculum_highlights_ur: '• مخارج کی صحت کے ساتھ نورانی قاعدہ\n• بنیادی اسلامی عقائد، آداب اور وضو کی عملی تعلیم\n• منتخب احادیث اور روزمرہ کی مسنون دعاؤں کا زبانی حفظ\n• اردو پڑھنے اور لکھنے کی باضابطہ مشق',
      image_url: '',
      video_url: '',
      display_order: 1,
      is_published: true
    },
    {
      title_en: 'Darja-e-Naazra',
      title_ur: 'درجہ ناظرہ قرآن کریم',
      slug: 'darja-e-naazra',
      short_desc_en: 'Recitation of the Holy Quran with Tajweed, memorization of Hadith and Masnoon Duas, and Urdu literacy.',
      short_desc_ur: 'تجوید و ترتیل کے ساتھ ناظرہ قرآن پاک، زبانی احادیث و مسنون دعائیں اور اردو تحریر و قرأت۔',
      detailed_desc_en: 'Comprehensive instruction in reciting the entire Holy Quran with rules of Tajweed, continued memorization of Prophetic Hadith and daily Masnoon Duas through memorization, and advancing Urdu language literacy.',
      detailed_desc_ur: 'مکمل قرآن مجید کو قواعدِ تجوید کے مطابق روانی اور خوبصورت ترتیل کے ساتھ پڑھنے کی تدریس، مسنون دعاؤں اور اخلاقی احادیث کا زبانی حفظ، اور اردو مضمون نگاری۔',
      age_group_en: '11–15 years',
      age_group_ur: '۱۱ تا ۱۵ سال',
      timing_en: 'Daily Classes',
      timing_ur: 'روزانہ تعلیمی اوقات',
      curriculum_highlights_en: '• Fluent Quran recitation with Tajweed rules\n• Pronunciation and phonetic discipline\n• Memorization of Hadith and Masnoon Duas\n• Urdu reading, comprehension, and writing',
      curriculum_highlights_ur: '• تجوید و صحتِ مخارج کے ساتھ مکمل ناظرہ قرآن پاک\n• ضروری قواعدِ تجوید، ادغام اور رموزِ اوقاف کی مشق\n• اہم مسنون دعاؤں اور اخلاقی احادیث کا زبانی حفظ\n• اردو مطالعہ، املاء اور تحریری مشق',
      image_url: '',
      video_url: '',
      display_order: 2,
      is_published: true
    },
    {
      title_en: 'Darja-e-Hifz',
      title_ur: 'درجہ حفظِ قرآن کریم',
      slug: 'darja-e-hifz',
      short_desc_en: 'Quran-e-Pak memorization education, retention through daily revision, Hadith memorization, and Urdu proficiency.',
      short_desc_ur: 'مکمل حفظِ قرآن مجید، پختہ دور و تکرار، احادیثِ مبارکہ اور اردو زبان کی تعلیم۔',
      detailed_desc_en: 'Intensive memorization of the Holy Quran under expert Huffaz with systematic daily Sabaq (new lesson), Sabqi (recent lessons), and Manzil (revision) cycles. Accompanied by memorization of Hadith, Masnoon Duas, and moral character training.',
      detailed_desc_ur: 'ماہر اساتذہ و حفاظ کی زیرِ نگرانی قرآن مجید حفظ کرنے کا شعبہ۔ روزانہ نیا سبق، سبقی اور پختہ منزل کے ساتھ ساتھ مسنون آداب، احادیثِ نبویہ اور اخلاقی تربیت کا مکمل اہتمام۔',
      age_group_en: '12–21 years',
      age_group_ur: '۱۲ تا ۲۱ سال',
      timing_en: 'Full-time Residential Schedule',
      timing_ur: 'مکمل رہائشی تعلیمی اوقات',
      curriculum_highlights_en: '• Complete memorization of the 30 Juz of the Holy Quran\n• Rigorous Sabaq, Sabqi, and Manzil retention system\n• Advanced Tajweed and voice modulation\n• Memorization of Prophetic Hadith and daily prayers\n• Urdu reading, writing, and moral character building',
      curriculum_highlights_ur: '• ۳۰ پاروں کا باقاعدہ و پختہ حفظ\n• سبق، سبقی اور منزل کا روزانہ سخت امتحانی نظام\n• احکامِ تجوید اور حسنِ ترتیل\n• مسنون دعاؤں اور نبوی ارشادات کا زبانی حفظ\n• اردو تحریر اور اخلاقی کردار سازی',
      image_url: '',
      video_url: '',
      display_order: 3,
      is_published: true
    },
    {
      title_en: 'School Academic Education',
      title_ur: 'عصری اسکول تعلیم',
      slug: 'school-academic-education',
      short_desc_en: 'Academic schooling covering Urdu, Hindi, English, and Mathematics taught alongside religious studies.',
      short_desc_ur: 'دینی تعلیم کے ساتھ ساتھ بنیادی عصری مضامین: اردو، ہندی، انگریزی اور ریاضی کی باقاعدہ تعلیم۔',
      detailed_desc_en: 'Provides every enrolled child with formal schooling in modern foundational subjects including Urdu, Hindi, English, and Mathematics, ensuring balanced academic capability alongside their religious education.',
      detailed_desc_ur: 'جامعہ میں دینی تعلیم کے ساتھ ساتھ تمام بچوں کو جدید بنیادی مضامین کی معیاری تعلیم دی جاتی ہے تاکہ طلبہ زبان دانی اور حساب و کتاب میں مہارت حاصل کر کے ایک باصلاحیت شہری بن سکیں۔',
      age_group_en: 'All Enrolled Students',
      age_group_ur: 'تمام زیرِ تعلیم طلبہ',
      timing_en: 'Daily Academic Periods',
      timing_ur: 'روزانہ کے تعلیمی ادوار',
      curriculum_highlights_en: '• English language, reading, and vocabulary\n• Hindi language reading, writing, and grammar\n• Urdu literature, comprehension, and composition\n• Mathematics and practical arithmetic\n• Moral education and general knowledge',
      curriculum_highlights_ur: '• انگریزی زبان، قرأت اور بنیادی گرائمر\n• ہندی زبان کی مکمل تحریر و قرأت\n• اردو ادب، انشائیہ اور املاء\n• بنیادی حساب اور ریاضیاتی فہم\n• اخلاقیات اور عام معلومات',
      image_url: '',
      video_url: '',
      display_order: 4,
      is_published: true
    }
  ];

  const { error: insertProgError } = await supabase.from('programs').insert(programsData);
  if (insertProgError) throw new Error('Failed to insert programs: ' + insertProgError.message);
  console.log('✅ programs updated successfully (4 verified programs).');

  // 3. Replace Problems / Current Needs
  console.log('3. Updating problems...');
  const { error: delProbError } = await supabase.from('problems').delete().neq('title_en', '__none__');
  if (delProbError) throw new Error('Failed to clean problems: ' + delProbError.message);

  const problemData = [
    {
      title_en: 'Need for a Permanent Madrasa Building',
      title_ur: 'مدرسہ کے لیے ذاتی و مستقل عمارت کی ضرورت',
      slug: 'permanent-madrasa-building',
      summary_en: 'Since 2002, the Madrasa has operated in rented premises in Agripada, Mumbai. We appeal for your support to establish our own permanent educational center for children\'s accommodation, worship, and learning.',
      summary_ur: 'ادارہ سنہ ۲۰۰۲ء سے کرایہ کی جگہ پر خدمات انجام دے رہا ہے۔ طلبہ کی رہائش، تعلیم اور عبادت کے لیے مستقل عمارت کے قیام کی پرخلوص اپیل۔',
      description_en: 'Madrasa Afzal-ul-Maarif Education Trust has been providing religious and academic education while taking care of children\'s accommodation, meals, and other daily needs.\n\nSince 2002, the Madrasa has been operating in rented premises. Limited space creates difficulties in providing a more comfortable and suitable environment for children\'s education and residential needs.\n\nThe Madrasa\'s primary objective is to establish its own larger, permanent premises where children can receive education and have suitable arrangements for accommodation, worship, and other essential needs.',
      description_ur: 'مدرسہ افضل المعارف ایجوکیشن ٹرسٹ بچوں کو دینی و عصری تعلیم دینے کے ساتھ ساتھ ان کے قیام، طعام، لباس اور دیگر ضروریات کی مکمل کفالت کرتا آ رہا ہے۔\n\nسنہ ۲۰۰۲ء سے یہ ادارہ کرایہ کی محدود عمارت میں چل رہا ہے۔ جگہ کی تنگی کی وجہ سے بچوں کی رہائش اور تعلیمی سرگرمیوں میں مشکلات پیش آتی ہیں۔\n\nادارے کا سب سے اہم مقصد اپنی مستقل اور کشادہ عمارت قائم کرنا ہے تاکہ نونہالانِ اسلام کے لیے رہائش، تعلیم، طہارت اور باجماعت نماز کا منظم اور پرسکون انتظام ہو سکے۔',
      why_needed_en: 'We request your prayers, guidance, and support in helping the Madrasa work towards establishing a permanent educational centre. Together, we can help provide children with a better environment for religious and academic education and a stronger foundation for their future.',
      why_needed_ur: 'ہم آپ سے دعاؤں، مفید مشوروں اور ہر ممکن تعاون کی پرخلوص اپیل کرتے ہیں تاکہ مدرسہ اپنی مستقل عمارت کے خواب کو شرمندۂ تعبیر کر سکے۔ آپ کا تعاون نادار اور یتیم بچوں کے شاندار مستقبل کی ضمانت بنے گا۔',
      requested_amount: '',
      status: 'active',
      image_url: '',
      video_url: '',
      supporting_doc_url: '',
      donation_note_en: 'Please contact the Madrasa management directly for guidance on supporting our permanent building initiative.',
      donation_note_ur: 'مستقل عمارت کے قیام کے سلسلے میں معاونت کے لیے براہِ کرم مدرسہ کی انتظامیہ سے براہِ راست رابطہ فرمائیں۔',
      display_order: 1,
      is_published: true
    }
  ];

  const { error: insertProbError } = await supabase.from('problems').insert(problemData);
  if (insertProbError) throw new Error('Failed to insert problems: ' + insertProbError.message);
  console.log('✅ problems updated successfully (1 verified primary need).');

  // 4. Replace Student Statistics
  console.log('4. Updating student_statistics...');
  const { error: delStatError } = await supabase.from('student_statistics').delete().neq('label_en', '__none__');
  if (delStatError) throw new Error('Failed to clean student_statistics: ' + delStatError.message);

  const statsData = [
    {
      label_en: 'Residential Students',
      label_ur: 'مقیم طلبہ (رہائشی)',
      value: '60',
      subtext_en: 'Full residential boarding: accommodation, meals, clothing, daily necessities, weekly pocket money, and medical care',
      subtext_ur: 'مکمل رہائشی سہولیات: قیام و طعام، لباس، ضروریاتِ زندگی، ہفتہ وار جیب خرچ، دینی و عصری تعلیم اور طبی نگہداشت',
      icon_name: 'Users',
      year_or_period: 'Current Academic Session',
      display_order: 1,
      is_published: true
    }
  ];

  const { error: insertStatError } = await supabase.from('student_statistics').insert(statsData);
  if (insertStatError) throw new Error('Failed to insert statistics: ' + insertStatError.message);
  console.log('✅ student_statistics updated successfully (60 residential students confirmed).');

  // 5. Replace Student Activities
  console.log('5. Updating student_activities...');
  const { error: delActError } = await supabase.from('student_activities').delete().neq('title_en', '__none__');
  if (delActError) throw new Error('Failed to clean student_activities: ' + delActError.message);

  const activitiesData = [
    {
      title_en: 'Weekly Anjuman (Public Speaking & Naat)',
      title_ur: 'ہفتہ واری انجمن (تقاریر و نعت خوانی)',
      description_en: 'Students recite Naat-e-Pak, deliver speeches, and practise public speaking every Thursday to build confidence, communication skills, and presentation abilities.',
      description_ur: 'طلبہ ہر جمعرات کو نعت خوانی اور تقاریر کی مشق کرتے ہیں تاکہ ان میں خود اعتمادی اور خطاب کی صلاحیت پیدا ہو۔',
      content_en: 'Every Thursday, the Madrasa organizes the Weekly Anjuman. Under the guidance of our Asatizah, students prepare speeches on moral and Islamic topics, recite Naat-e-Pak, and develop their public articulation and stage presence.',
      content_ur: 'ہر جمعرات کو مدرسہ میں ہفتہ واری بزم کا انعقاد کیا جاتا ہے جس میں اساتذہ کی زیرِ نگرانی طلبہ اخلاقی و دینی موضوعات پر تقاریر پیش کرتے ہیں اور نعت خوانی کا مظاہرہ کرتے ہیں۔',
      category_en: 'Tarbiyah & Public Speaking',
      category_ur: 'تربیت و خطابت',
      activity_date: '2026-10-15',
      image_url: '',
      video_url: '',
      display_order: 1,
      is_published: true
    },
    {
      title_en: 'Dastar Bandi Ceremony',
      title_ur: 'تقریبِ دستار بندی و اعزاز',
      description_en: 'Madrasa ceremony documenting students\' educational milestones and honoring graduates of the Quran memorization program.',
      description_ur: 'حفظِ قرآن مجید مکمل کرنے والے ہونہار طلبہ کی دستار بندی اور تعلیمی اعزاز کی پروقار تقریب۔',
      content_en: 'The Dastar Bandi ceremony is a landmark milestone at Madrasa Afzal-ul-Maarif, where Huffaz who have completed memorizing the Holy Quran are formally crowned with the turban of honor in the presence of distinguished scholars and community elders.',
      content_ur: 'دستار بندی کی تقریب ادارے کا ایک تاریخی و یادگار سنگ میل ہے جس میں حفظِ کلامِ پاک کی تکمیل کرنے والے حفاظِ کرام کی باوقار دستار بندی علمائے کرام کے مبارک ہاتھوں سے عمل میں لائی جاتی ہے۔',
      category_en: 'Milestone & Convocation',
      category_ur: 'تکمیلِ حفظ و اعزاز',
      activity_date: '2026-03-20',
      image_url: '',
      video_url: '',
      display_order: 2,
      is_published: true
    },
    {
      title_en: 'Outdoor Games & Physical Fitness',
      title_ur: 'کھیل کود اور جسمانی نشوونما',
      description_en: 'Students participate in outdoor games at a nearby playground during their free time to develop physical fitness, teamwork, and confidence.',
      description_ur: 'طلبہ قریبی میدان میں کھیل کود میں حصہ لیتے ہیں جس سے ان کی جسمانی صحت، باہمی اتحاد اور ذہنی تازگی قائم رہتی ہے۔',
      content_en: 'Recognizing that sound health supports sound learning, students are taken to a nearby playground for structured outdoor sports and recreational activities during their scheduled free time.',
      content_ur: 'جسمانی صحت اور چستی کو تعلیمی یکسوئی کے لیے لازمی سمجھتے ہوئے، فارغ اوقات میں طلبہ کو قریبی گراؤنڈ میں کھیل کود اور تفریح کے باقاعدہ مواقع فراہم کیے جاتے ہیں۔',
      category_en: 'Physical Recreation',
      category_ur: 'صحت و تفریح',
      activity_date: '2026-10-10',
      image_url: '',
      video_url: '',
      display_order: 3,
      is_published: true
    },
    {
      title_en: 'Religious and Academic Education',
      title_ur: 'دینی و عصری جامع تعلیم',
      description_en: 'Ongoing Quran education, Hadith, Masnoon Duas, Islamic upbringing, together with Urdu, Hindi, English, and Mathematics.',
      description_ur: 'قرآن مجید، احادیث، مسنون دعاؤں اور اخلاقی تربیت کے ساتھ ساتھ اردو، ہندی، انگریزی اور ریاضی کی روزانہ باقاعدہ تدریس۔',
      content_en: 'A balanced daily routine encompassing classical Quran recitation, memorization of Masnoon Duas and Hadith without text, ethical tarbiyah, and rigorous instruction in modern languages and mathematics.',
      content_ur: 'روزمرہ کا ایک منظم تعلیمی سلسلہ جس میں تجوید القرآن، زبانی مسنون دعائیں اور احادیث کے علاوہ اردو، ہندی، انگریزی اور ریاضی کے اسباق شامل ہیں۔',
      category_en: 'Core Curriculum',
      category_ur: 'بنیادی تعلیمی سلسلہ',
      activity_date: '2026-10-01',
      image_url: '',
      video_url: '',
      display_order: 4,
      is_published: true
    }
  ];

  const { error: insertActError } = await supabase.from('student_activities').insert(activitiesData);
  if (insertActError) throw new Error('Failed to insert activities: ' + insertActError.message);
  console.log('✅ student_activities updated successfully (4 verified activities).');

  // 6. Replace Legal Documents (Clear fake documents and keep 1 unverified draft reference)
  console.log('6. Updating legal_documents...');
  const { error: delDocError } = await supabase.from('legal_documents').delete().neq('title_en', '__none__');
  if (delDocError) throw new Error('Failed to clean legal_documents: ' + delDocError.message);

  const docsData = [
    {
      title_en: 'Trust Registration (Ref: E-24389 - Pending Document Verification)',
      title_ur: 'ٹرسٹ رجسٹریشن (حوالہ: E-24389 - زیرِ تصدیق)',
      description_en: 'Business card reference registration number E-24389. Maintained in administrative records pending confirmation against official certificate.',
      description_ur: 'بزنس کارڈ پر درج رجسٹریشن نمبر E-24389 کا حوالہ۔ اصل سرکاری سرٹیفکیٹ کی تصدیق تک دفتری ریکارڈ میں محفوظ۔',
      category_en: 'Registration Reference',
      category_ur: 'رجسٹریشن حوالہ',
      file_url: '',
      thumbnail_url: '',
      issue_date: 'Unconfirmed',
      document_number: 'E-24389 (Unconfirmed Reference)',
      is_public: false,
      is_published: false,
      display_order: 1
    }
  ];

  const { error: insertDocError } = await supabase.from('legal_documents').insert(docsData);
  if (insertDocError) throw new Error('Failed to insert legal_documents: ' + insertDocError.message);
  console.log('✅ legal_documents updated (fake certificates removed, draft reference set to unpublished).');

  console.log('--- ALL TABLES SAFELY UPDATED WITH VERIFIED CONTENT ---');
}

runMigration().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
