-- Migration: 003_replace_with_verified_content.sql
-- Description: Replaces old placeholder Madrasa data with verified institutional records,
-- creates the institution_staff table, and enforces publication security.

-- ==============================================================================
-- 1. CREATE INSTITUTION STAFF TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.institution_staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en TEXT NOT NULL,
  name_ur TEXT DEFAULT '',
  role_en TEXT NOT NULL,
  role_ur TEXT DEFAULT '',
  category TEXT NOT NULL CHECK (category IN ('leadership', 'teaching', 'support')),
  display_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.institution_staff ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published staff" ON public.institution_staff;
CREATE POLICY "Public can view published staff"
  ON public.institution_staff FOR SELECT
  TO public
  USING (is_published = true);

DROP POLICY IF EXISTS "Admins can manage staff" ON public.institution_staff;
CREATE POLICY "Admins can manage staff"
  ON public.institution_staff FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 2. POPULATE VERIFIED LEADERSHIP, TEACHING, AND SUPPORT STAFF
-- ==============================================================================
DELETE FROM public.institution_staff;

INSERT INTO public.institution_staff (name_en, name_ur, role_en, role_ur, category, display_order, is_published)
VALUES
  -- Leadership
  ('Hazrat Qari Suleman Saheb', 'حضرت قاری سلیمان صاحب', 'Founder and Head; Teacher, Darja-e-Hifz', 'بانی و مہتمم؛ استاد درجہ حفظ', 'leadership', 1, true),
  ('Hafiz Hassan Saheb', 'حافظ حسن صاحب', 'Nazim-e-Taleemat / Head of Education', 'ناظمِ تعلیمات', 'leadership', 2, true),
  ('Maulana Ameen Saheb', 'مولانا امین صاحب', 'Sarparast', 'سرپرست', 'leadership', 3, true),
  
  -- Teaching Staff
  ('Qari Suleman Saheb', 'قاری سلیمان صاحب', 'Teacher, Darja-e-Hifz', 'استاد درجہ حفظ', 'teaching', 4, true),
  ('Maulana Hafiz Abdurrahman Saheb', 'مولانا حافظ عبد الرحمن صاحب', 'Teacher, Darja-e-Naazra', 'استاد درجہ ناظرہ', 'teaching', 5, true),
  ('Maulana Abdullah Saheb', 'مولانا عبد اللہ صاحب', 'Teacher, Darja-e-Deeniyat / Qaida', 'استاد درجہ دینیات / قاعدہ', 'teaching', 6, true),
  ('Maulana Dabeer Saheb', 'مولانا دبیر صاحب', 'Teacher, Tajweed and Qiraat', 'استاد تجوید و قرأت', 'teaching', 7, true),
  ('Hafiz Muzaffar Saheb', 'حافظ مظفر صاحب', 'Assistant Teacher', 'معاون مدرس', 'teaching', 8, true),
  ('Shaikh Saleha', 'شیخ صالحہ', 'Teacher, Hindi, English, and Mathematics', 'معلمہ ہندی، انگریزی اور ریاضی', 'teaching', 9, true),
  
  -- Support Staff
  ('Haji Mohammed Nasimuddin Saheb', 'حاجی محمد نسیم الدین صاحب', 'Responsible for Cooking', 'نگراں و ذمہ دار مطبخ (باورچی)', 'support', 10, true),
  ('Rafat Khatoon', 'رفعت خاتون', 'Responsible for Cleaning and Washing Utensils', 'صفائی اور برتنوں کی دیکھ بھال', 'support', 11, true);

-- ==============================================================================
-- 3. UPDATE SITE SETTINGS WITH VERIFIED MADRASA DETAILS
-- ==============================================================================
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
  copyright_text_ur,
  updated_at
) VALUES (
  'current',
  'Madrasa Afzal-ul-Maarif Education Trust',
  'مدرسہ افضل المعارف ایجوکیشن ٹرسٹ',
  'Centre for Classical Islamic Learning, Hifz-ul-Quran & Academic Education',
  'دینی و عصری تعلیم اور اخلاقی تربیت کا معتبر ادارہ',
  '',
  'Dedicated to Religious & Academic Education Since 2002',
  'سنہ ۲۰۰۲ء سے دینی و عصری تعلیم اور اخلاقی تربیت میں مصروفِ عمل',
  'Nurturing Minds with the Light of the Holy Quran & Education',
  'قرآنِ پاک، دینی تعلیم اور عصری علوم کی روشنی میں بچوں کی ہمہ جہت تربیت',
  'Providing children with religious and academic education, good character, and proper upbringing to build a better future.',
  'بچوں کو دینی و عصری تعلیم، عمدہ اخلاق اور بہترین تربیت فراہم کرنا تاکہ ان کے روشن اور باوقار مستقبل کی تعمیر ہو سکے۔',
  '',
  'About Madrasa Afzal-ul-Maarif Education Trust',
  'مدرسہ افضل المعارف ایجوکیشن ٹرسٹ کا تعارف',
  'Operating at rented premises in Agripada, Mumbai since 2002, Madrasa Afzal-ul-Maarif Education Trust has been dedicated to providing children with religious and academic education alongside complete residential facilities, meals, clothing, and moral tarbiyah.',
  'سنہ ۲۰۰۲ء سے آگری پاڑہ، ممبئی میں کرایہ کی عمارت میں قائم، مدرسہ افضل المعارف ایجوکیشن ٹرسٹ بچوں کو دینی و عصری تعلیم دینے کے ساتھ ساتھ ان کے قیام، طعام، لباس اور اخلاقی تربیت کی مکمل خدمات انجام دے رہا ہے۔',
  'To provide children with religious and academic education, good character, and proper upbringing to build a better future.',
  'بچوں کو دینی و عصری تعلیم، عمدہ اخلاق اور بہترین تربیت فراہم کرنا تاکہ ان کے روشن اور باوقار مستقبل کی تعمیر ہو سکے۔',
  'To establish a permanent educational centre that ensures quality Islamic learning, academic schooling, and dignified residential care for all students.',
  'ایک ایسی مستقل اور وسیع عمارت قائم کرنا جہاں طلبہ کو معیاری دینی تعلیم، اسکول کی تعلیم اور باوقار رہائشی سہولیات میسر آ سکیں۔',
  E'1. Complete Quran education (Qaida, Naazra, and Hifz with Tajweed)\n2. School academic education (Urdu, Hindi, English, and Mathematics)\n3. Memorization of Prophetic Hadith and Masnoon Duas without looking at text\n4. Holistic residential care, weekly pocket money, and moral tarbiyah\n5. Striving towards establishing a permanent educational building',
  E'۱۔ تجوید کے ساتھ مکمل قرآنی تعلیم (قاعدہ، ناظرہ اور حفظِ قرآن کریم)\n۲۔ اسکول کی بنیادی عصری تعلیم (اردو، ہندی، انگریزی اور ریاضی)\n۳۔ احادیثِ نبویہ اور مسنون دعاؤں کا زبانی حفظ\n۴۔ طلبہ کی مکمل رہائش، طعام، لباس، ہفتہ وار جیب خرچ اور اخلاقی تربیت\n۵۔ مدرسہ کے لیے ذاتی و مستقل عمارت کا قیام',
  'Madrasa Activities & Daily Life',
  'مدرسہ کے تعلیمی و تربیتی معمولات',
  'Official documentary and educational video will be shared shortly.',
  'مدرسہ کے تعلیمی و دستار بندی کا باضابطہ ویڈیو جلد شامل کیا جائے گا۔',
  '',
  '',
  '9892607755, 9322171099',
  'contact@maarif.org',
  'Islam Building Compound, Next to Baug-e-Rabbani Tower, Near Arabic Masjid, Souter Street, Agripada, Mumbai – 400011.',
  'اسلام بلڈنگ کمپاؤنڈ، متصل باغِ ربانی ٹاور، بالمقابل عربک مسجد، سوٹر اسٹریٹ، آگری پاڑہ، ممبئی - 400011',
  '9930797935',
  true,
  '',
  '',
  '',
  'Madrasa Afzal-ul-Maarif Education Trust',
  '',
  '',
  'Agripada, Mumbai',
  'Official donation QR code and bank account information will be updated upon administrative verification. Please contact Qari Suleman Saheb (9892607755 / 9322171099) or via WhatsApp (9930797935) for direct guidance.',
  'عطیات کی منتقلی کے لیے باضابطہ بینک اکاؤنٹ اور کیو آر کوڈ تصدیق کے بعد جاری کیا جائے گا۔ رہنمائی کے لیے حضرت قاری سلیمان صاحب (9892607755 / 9322171099) یا واٹس ایپ (9930797935) پر رابطہ فرمائیں۔',
  'Madrasa Afzal-ul-Maarif Education Trust — Operating since 2002 at Agripada, Mumbai. Dedicated to religious and academic education.',
  'مدرسہ افضل المعارف ایجوکیشن ٹرسٹ — سنہ ۲۰۰۲ء سے آگری پاڑہ، ممبئی میں دینی و عصری تعلیم اور اخلاقی تربیت میں مصروفِ عمل۔',
  'All Rights Reserved. Madrasa Afzal-ul-Maarif Education Trust.',
  'جملہ حقوق بحق مدرسہ افضل المعارف ایجوکیشن ٹرسٹ محفوظ ہیں۔',
  timezone('utc'::text, now())
)
ON CONFLICT (id) DO UPDATE SET
  madrasa_name_en = EXCLUDED.madrasa_name_en,
  madrasa_name_ur = EXCLUDED.madrasa_name_ur,
  tagline_en = EXCLUDED.tagline_en,
  tagline_ur = EXCLUDED.tagline_ur,
  logo_url = EXCLUDED.logo_url,
  hero_badge_en = EXCLUDED.hero_badge_en,
  hero_badge_ur = EXCLUDED.hero_badge_ur,
  hero_title_en = EXCLUDED.hero_title_en,
  hero_title_ur = EXCLUDED.hero_title_ur,
  hero_subtitle_en = EXCLUDED.hero_subtitle_en,
  hero_subtitle_ur = EXCLUDED.hero_subtitle_ur,
  hero_image_url = EXCLUDED.hero_image_url,
  about_heading_en = EXCLUDED.about_heading_en,
  about_heading_ur = EXCLUDED.about_heading_ur,
  about_history_en = EXCLUDED.about_history_en,
  about_history_ur = EXCLUDED.about_history_ur,
  about_mission_en = EXCLUDED.about_mission_en,
  about_mission_ur = EXCLUDED.about_mission_ur,
  about_vision_en = EXCLUDED.about_vision_en,
  about_vision_ur = EXCLUDED.about_vision_ur,
  about_objectives_en = EXCLUDED.about_objectives_en,
  about_objectives_ur = EXCLUDED.about_objectives_ur,
  intro_video_title_en = EXCLUDED.intro_video_title_en,
  intro_video_title_ur = EXCLUDED.intro_video_title_ur,
  intro_video_desc_en = EXCLUDED.intro_video_desc_en,
  intro_video_desc_ur = EXCLUDED.intro_video_desc_ur,
  intro_video_url = EXCLUDED.intro_video_url,
  intro_video_thumb = EXCLUDED.intro_video_thumb,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  address_en = EXCLUDED.address_en,
  address_ur = EXCLUDED.address_ur,
  whatsapp = EXCLUDED.whatsapp,
  donation_enabled = EXCLUDED.donation_enabled,
  donation_qr_url = EXCLUDED.donation_qr_url,
  upi_id = EXCLUDED.upi_id,
  bank_name = EXCLUDED.bank_name,
  account_holder = EXCLUDED.account_holder,
  account_number = EXCLUDED.account_number,
  ifsc_code = EXCLUDED.ifsc_code,
  branch = EXCLUDED.branch,
  donation_instructions_en = EXCLUDED.donation_instructions_en,
  donation_instructions_ur = EXCLUDED.donation_instructions_ur,
  footer_text_en = EXCLUDED.footer_text_en,
  footer_text_ur = EXCLUDED.footer_text_ur,
  copyright_text_en = EXCLUDED.copyright_text_en,
  copyright_text_ur = EXCLUDED.copyright_text_ur,
  updated_at = timezone('utc'::text, now());

-- ==============================================================================
-- 4. REPLACE EDUCATIONAL PROGRAMS
-- ==============================================================================
DELETE FROM public.programs;

INSERT INTO public.programs (
  title_en, title_ur, slug, short_desc_en, short_desc_ur, detailed_desc_en, detailed_desc_ur,
  age_group_en, age_group_ur, timing_en, timing_ur, curriculum_highlights_en, curriculum_highlights_ur,
  image_url, video_url, display_order, is_published
) VALUES
(
  'Darja-e-Deeniyat (Qaida)',
  'درجہ دینیات (قاعدہ)',
  'darja-e-deeniyat-qaida',
  'Foundational Qaida, basic Islamic education, memorization of Hadith and Masnoon Duas, and Urdu literacy.',
  'بنیادی قاعدہ، ابتدائی اسلامی تعلیمات، زبانی حفظِ احادیث و مسنون دعائیں اور اردو پڑھنا لکھنا۔',
  'Teaches elementary children correct phonetic recitation of Quranic Qaida with proper pronunciation, foundational Islamic tenets, and memorization of Hadith and Masnoon Duas through repetition without looking at text, along with Urdu reading and writing.',
  'چھوٹے بچوں کے لیے قرآن کریم کے درست تلفظ کے ساتھ قاعدہ، بنیادی عقائد و طہارت، زبانی مسنون دعائیں، احادیثِ مبارکہ اور اردو تحریر و قرأت کی باقاعدہ تدریس۔',
  '7–11 years',
  '۷ تا ۱۱ سال',
  'Daily Classes',
  'روزانہ تعلیمی اوقات',
  E'• Qaida recitation with correct Makharij\n• Basic Islamic education and tenets\n• Memorization of Hadith and Masnoon Duas (without looking at text)\n• Urdu reading and writing practice',
  E'• مخارج کی صحت کے ساتھ نورانی قاعدہ\n• بنیادی اسلامی عقائد، آداب اور وضو کی عملی تعلیم\n• منتخب احادیث اور روزمرہ کی مسنون دعاؤں کا زبانی حفظ\n• اردو پڑھنے اور لکھنے کی باضابطہ مشق',
  '',
  '',
  1,
  true
),
(
  'Darja-e-Naazra',
  'درجہ ناظرہ قرآن کریم',
  'darja-e-naazra',
  'Recitation of the Holy Quran with Tajweed, memorization of Hadith and Masnoon Duas, and Urdu literacy.',
  'تجوید و ترتیل کے ساتھ ناظرہ قرآن پاک، زبانی احادیث و مسنون دعائیں اور اردو تحریر و قرأت۔',
  'Comprehensive instruction in reciting the entire Holy Quran with rules of Tajweed, continued memorization of Prophetic Hadith and daily Masnoon Duas through memorization, and advancing Urdu language literacy.',
  'مکمل قرآن مجید کو قواعدِ تجوید کے مطابق روانی اور خوبصورت ترتیل کے ساتھ پڑھنے کی تدریس، مسنون دعاؤں اور اخلاقی احادیث کا زبانی حفظ، اور اردو مضمون نگاری۔',
  '11–15 years',
  '۱۱ تا ۱۵ سال',
  'Daily Classes',
  'روزانہ تعلیمی اوقات',
  E'• Fluent Quran recitation with Tajweed rules\n• Pronunciation and phonetic discipline\n• Memorization of Hadith and Masnoon Duas\n• Urdu reading, comprehension, and writing',
  E'• تجوید و صحتِ مخارج کے ساتھ مکمل ناظرہ قرآن پاک\n• ضروری قواعدِ تجوید، ادغام اور رموزِ اوقاف کی مشق\n• اہم مسنون دعاؤں اور اخلاقی احادیث کا زبانی حفظ\n• اردو مطالعہ، املاء اور تحریری مشق',
  '',
  '',
  2,
  true
),
(
  'Darja-e-Hifz',
  'درجہ حفظِ قرآن کریم',
  'darja-e-hifz',
  'Quran-e-Pak memorization education, retention through daily revision, Hadith memorization, and Urdu proficiency.',
  'مکمل حفظِ قرآن مجید، پختہ دور و تکرار، احادیثِ مبارکہ اور اردو زبان کی تعلیم۔',
  'Intensive memorization of the Holy Quran under expert Huffaz with systematic daily Sabaq (new lesson), Sabqi (recent lessons), and Manzil (revision) cycles. Accompanied by memorization of Hadith, Masnoon Duas, and moral character training.',
  'ماہر اساتذہ و حفاظ کی زیرِ نگرانی قرآن مجید حفظ کرنے کا شعبہ۔ روزانہ نیا سبق، سبقی اور پختہ منزل کے ساتھ ساتھ مسنون آداب، احادیثِ نبویہ اور اخلاقی تربیت کا مکمل اہتمام۔',
  '12–21 years',
  '۱۲ تا ۲۱ سال',
  'Full-time Residential Schedule',
  'مکمل رہائشی تعلیمی اوقات',
  E'• Complete memorization of the 30 Juz of the Holy Quran\n• Rigorous Sabaq, Sabqi, and Manzil retention system\n• Advanced Tajweed and voice modulation\n• Memorization of Prophetic Hadith and daily prayers\n• Urdu reading, writing, and moral character building',
  E'• ۳۰ پاروں کا باقاعدہ و پختہ حفظ\n• سبق، سبقی اور منزل کا روزانہ سخت امتحانی نظام\n• احکامِ تجوید اور حسنِ ترتیل\n• مسنون دعاؤں اور نبوی ارشادات کا زبانی حفظ\n• اردو تحریر اور اخلاقی کردار سازی',
  '',
  '',
  3,
  true
),
(
  'School Academic Education',
  'عصری اسکول تعلیم',
  'school-academic-education',
  'Academic schooling covering Urdu, Hindi, English, and Mathematics taught alongside religious studies.',
  'دینی تعلیم کے ساتھ ساتھ بنیادی عصری مضامین: اردو، ہندی، انگریزی اور ریاضی کی باقاعدہ تعلیم۔',
  'Provides every enrolled child with formal schooling in modern foundational subjects including Urdu, Hindi, English, and Mathematics, ensuring balanced academic capability alongside their religious education.',
  'جامعہ میں دینی تعلیم کے ساتھ ساتھ تمام بچوں کو جدید بنیادی مضامین کی معیاری تعلیم دی جاتی ہے تاکہ طلبہ زبان دانی اور حساب و کتاب میں مہارت حاصل کر کے ایک باصلاحیت شہری بن سکیں۔',
  'All Enrolled Students',
  'تمام زیرِ تعلیم طلبہ',
  'Daily Academic Periods',
  'روزانہ کے تعلیمی ادوار',
  E'• English language, reading, and vocabulary\n• Hindi language reading, writing, and grammar\n• Urdu literature, comprehension, and composition\n• Mathematics and practical arithmetic\n• Moral education and general knowledge',
  E'• انگریزی زبان، قرأت اور بنیادی گرائمر\n• ہندی زبان کی مکمل تحریر و قرأت\n• اردو ادب، انشائیہ اور املاء\n• بنیادی حساب اور ریاضیاتی فہم\n• اخلاقیات اور عام معلومات',
  '',
  '',
  4,
  true
);

-- ==============================================================================
-- 5. REPLACE CURRENT NEEDS (PRIMARY NEED: PERMANENT BUILDING)
-- ==============================================================================
DELETE FROM public.problems;

INSERT INTO public.problems (
  title_en, title_ur, slug, summary_en, summary_ur, description_en, description_ur,
  why_needed_en, why_needed_ur, requested_amount, status, image_url, video_url, supporting_doc_url,
  donation_note_en, donation_note_ur, display_order, is_published
) VALUES (
  'Need for a Permanent Madrasa Building',
  'مدرسہ کے لیے ذاتی و مستقل عمارت کی ضرورت',
  'permanent-madrasa-building',
  'Since 2002, the Madrasa has operated in rented premises in Agripada, Mumbai. We appeal for your support to establish our own permanent educational center for children''s accommodation, worship, and learning.',
  'ادارہ سنہ ۲۰۰۲ء سے کرایہ کی جگہ پر خدمات انجام دے رہا ہے۔ طلبہ کی رہائش، تعلیم اور عبادت کے لیے مستقل عمارت کے قیام کی پرخلوص اپیل۔',
  E'Madrasa Afzal-ul-Maarif Education Trust has been providing religious and academic education while taking care of children''s accommodation, meals, and other daily needs.\n\nSince 2002, the Madrasa has been operating in rented premises. Limited space creates difficulties in providing a more comfortable and suitable environment for children''s education and residential needs.\n\nThe Madrasa''s primary objective is to establish its own larger, permanent premises where children can receive education and have suitable arrangements for accommodation, worship, and other essential needs.',
  E'مدرسہ افضل المعارف ایجوکیشن ٹرسٹ بچوں کو دینی و عصری تعلیم دینے کے ساتھ ساتھ ان کے قیام، طعام، لباس اور دیگر ضروریات کی مکمل کفالت کرتا آ رہا ہے۔\n\nسنہ ۲۰۰۲ء سے یہ ادارہ کرایہ کی محدود عمارت میں چل رہا ہے۔ جگہ کی تنگی کی وجہ سے بچوں کی رہائش اور تعلیمی سرگرمیوں میں مشکلات پیش آتی ہیں۔\n\nادارے کا سب سے اہم مقصد اپنی مستقل اور کشادہ عمارت قائم کرنا ہے تاکہ نونہالانِ اسلام کے لیے رہائش، تعلیم، طہارت اور باجماعت نماز کا منظم اور پرسکون انتظام ہو سکے۔',
  'We request your prayers, guidance, and support in helping the Madrasa work towards establishing a permanent educational centre. Together, we can help provide children with a better environment for religious and academic education and a stronger foundation for their future.',
  'ہم آپ سے دعاؤں، مفید مشوروں اور ہر ممکن تعاون کی پرخلوص اپیل کرتے ہیں تاکہ مدرسہ اپنی مستقل عمارت کے خواب کو شرمندۂ تعبیر کر سکے۔ آپ کا تعاون نادار اور یتیم بچوں کے شاندار مستقبل کی ضمانت بنے گا۔',
  '',
  'active',
  '',
  '',
  '',
  'Please contact the Madrasa management directly for guidance on supporting our permanent building initiative.',
  'مستقل عمارت کے قیام کے سلسلے میں معاونت کے لیے براہِ کرم مدرسہ کی انتظامیہ سے براہِ راست رابطہ فرمائیں۔',
  1,
  true
);

-- ==============================================================================
-- 6. REPLACE STUDENT STATISTICS (VERIFIED: 60 RESIDENTIAL STUDENTS)
-- ==============================================================================
DELETE FROM public.student_statistics;

INSERT INTO public.student_statistics (
  label_en, label_ur, value, subtext_en, subtext_ur, icon_name, year_or_period, display_order, is_published
) VALUES (
  'Residential Students',
  'مقیم طلبہ (رہائشی)',
  '60',
  'Full residential boarding: accommodation, meals, clothing, daily necessities, weekly pocket money, and medical care',
  'مکمل رہائشی سہولیات: قیام و طعام، لباس، ضروریاتِ زندگی، ہفتہ وار جیب خرچ، دینی و عصری تعلیم اور طبی نگہداشت',
  'Users',
  'Current Academic Session',
  1,
  true
);

-- ==============================================================================
-- 7. REPLACE STUDENT ACTIVITIES
-- ==============================================================================
DELETE FROM public.student_activities;

INSERT INTO public.student_activities (
  title_en, title_ur, description_en, description_ur, content_en, content_ur,
  category_en, category_ur, activity_date, image_url, video_url, display_order, is_published
) VALUES
(
  'Weekly Anjuman (Public Speaking & Naat)',
  'ہفتہ واری انجمن (تقاریر و نعت خوانی)',
  'Students recite Naat-e-Pak, deliver speeches, and practise public speaking every Thursday to build confidence, communication skills, and presentation abilities.',
  'طلبہ ہر جمعرات کو نعت خوانی اور تقاریر کی مشق کرتے ہیں تاکہ ان میں خود اعتمادی اور خطاب کی صلاحیت پیدا ہو۔',
  'Every Thursday, the Madrasa organizes the Weekly Anjuman. Under the guidance of our Asatizah, students prepare speeches on moral and Islamic topics, recite Naat-e-Pak, and develop their public articulation and stage presence.',
  'ہر جمعرات کو مدرسہ میں ہفتہ واری بزم کا انعقاد کیا جاتا ہے جس میں اساتذہ کی زیرِ نگرانی طلبہ اخلاقی و دینی موضوعات پر تقاریر پیش کرتے ہیں اور نعت خوانی کا مظاہرہ کرتے ہیں۔',
  'Tarbiyah & Public Speaking',
  'تربیت و خطابت',
  '2026-10-15',
  '',
  '',
  1,
  true
),
(
  'Dastar Bandi Ceremony',
  'تقریبِ دستار بندی و اعزاز',
  'Madrasa ceremony documenting students'' educational milestones and honoring graduates of the Quran memorization program.',
  'حفظِ قرآن مجید مکمل کرنے والے ہونہار طلبہ کی دستار بندی اور تعلیمی اعزاز کی پروقار تقریب۔',
  'The Dastar Bandi ceremony is a landmark milestone at Madrasa Afzal-ul-Maarif, where Huffaz who have completed memorizing the Holy Quran are formally crowned with the turban of honor in the presence of distinguished scholars and community elders.',
  'دستار بندی کی تقریب ادارے کا ایک تاریخی و یادگار سنگ میل ہے جس میں حفظِ کلامِ پاک کی تکمیل کرنے والے حفاظِ کرام کی باوقار دستار بندی علمائے کرام کے مبارک ہاتھوں سے عمل میں لائی جاتی ہے۔',
  'Milestone & Convocation',
  'تکمیلِ حفظ و اعزاز',
  '2026-03-20',
  '',
  '',
  2,
  true
),
(
  'Outdoor Games & Physical Fitness',
  'کھیل کود اور جسمانی نشوونما',
  'Students participate in outdoor games at a nearby playground during their free time to develop physical fitness, teamwork, and confidence.',
  'طلبہ قریبی میدان میں کھیل کود میں حصہ لیتے ہیں جس سے ان کی جسمانی صحت، باہمی اتحاد اور ذہنی تازگی قائم رہتی ہے۔',
  'Recognizing that sound health supports sound learning, students are taken to a nearby playground for structured outdoor sports and recreational activities during their scheduled free time.',
  'جسمانی صحت اور چستی کو تعلیمی یکسوئی کے لیے لازمی سمجھتے ہوئے، فارغ اوقات میں طلبہ کو قریبی گراؤنڈ میں کھیل کود اور تفریح کے باقاعدہ مواقع فراہم کیے جاتے ہیں۔',
  'Physical Recreation',
  'صحت و تفریح',
  '2026-10-10',
  '',
  '',
  3,
  true
),
(
  'Religious and Academic Education',
  'دینی و عصری جامع تعلیم',
  'Ongoing Quran education, Hadith, Masnoon Duas, Islamic upbringing, together with Urdu, Hindi, English, and Mathematics.',
  'قرآن مجید، احادیث، مسنون دعاؤں اور اخلاقی تربیت کے ساتھ ساتھ اردو، ہندی، انگریزی اور ریاضی کی روزانہ باقاعدہ تدریس۔',
  'A balanced daily routine encompassing classical Quran recitation, memorization of Masnoon Duas and Hadith without text, ethical tarbiyah, and rigorous instruction in modern languages and mathematics.',
  'روزمرہ کا ایک منظم تعلیمی سلسلہ جس میں تجوید القرآن، زبانی مسنون دعائیں اور احادیث کے علاوہ اردو، ہندی، انگریزی اور ریاضی کے اسباق شامل ہیں۔',
  'Core Curriculum',
  'بنیادی تعلیمی سلسلہ',
  '2026-10-01',
  '',
  '',
  4,
  true
);

-- ==============================================================================
-- 8. REPLACE LEGAL DOCUMENTS (REMOVE FAKE CERTIFICATES, RETAIN UNVERIFIED DRAFT)
-- ==============================================================================
DELETE FROM public.legal_documents;

INSERT INTO public.legal_documents (
  title_en, title_ur, description_en, description_ur, category_en, category_ur,
  file_url, thumbnail_url, issue_date, document_number, is_public, is_published, display_order
) VALUES (
  'Trust Registration (Ref: E-24389 - Pending Document Verification)',
  'ٹرسٹ رجسٹریشن (حوالہ: E-24389 - زیرِ تصدیق)',
  'Business card reference registration number E-24389. Maintained in administrative records pending confirmation against official certificate.',
  'بزنس کارڈ پر درج رجسٹریشن نمبر E-24389 کا حوالہ۔ اصل سرکاری سرٹیفکیٹ کی تصدیق تک دفتری ریکارڈ میں محفوظ۔',
  'Registration Reference',
  'رجسٹریشن حوالہ',
  '',
  '',
  'Unconfirmed',
  'E-24389 (Unconfirmed Reference)',
  false,
  false,
  1
);
