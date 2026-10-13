-- 001_initial_schema.sql
-- Madrasa Website Database Schema with Row Level Security (RLS)

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Admin Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  full_name TEXT NOT NULL DEFAULT 'Administrator',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Helper function to check if current authenticated user is an administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Site Settings Table (Single-row configuration)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  madrasa_name_en TEXT NOT NULL DEFAULT 'Madrasa Rabbani Baug',
  madrasa_name_ur TEXT NOT NULL DEFAULT 'مدرسہ ربانی باغ',
  tagline_en TEXT DEFAULT 'Centre for Classical Islamic Learning, Hifz-ul-Quran & Moral Education',
  tagline_ur TEXT DEFAULT 'مرکزِ علومِ اسلامیہ، حفظ القرآن اور تربیتِ اخلاق',
  logo_url TEXT DEFAULT '',
  
  -- Hero Section
  hero_badge_en TEXT DEFAULT 'Dedicated to Sacred Knowledge & Character',
  hero_badge_ur TEXT DEFAULT 'دینی علوم اور اخلاقی تربیت کا معتبر ادارہ',
  hero_title_en TEXT DEFAULT 'Nurturing Minds with the Light of the Holy Quran & Sunnah',
  hero_title_ur TEXT DEFAULT 'قرآن و سنت کی روشنی میں نئی نسل کی ایمانی و اخلاقی نشوونما',
  hero_subtitle_en TEXT DEFAULT 'Providing quality Hifz-ul-Quran, foundational Islamic sciences, and ethical tarbiyah in a serene, disciplined environment.',
  hero_subtitle_ur TEXT DEFAULT 'معیاری حفظِ قرآن، بنیادی دینی تعلیمات اور اخلاقی تربیت کے لیے ایک منظم اور پرسکون تعلیمی ادارہ۔',
  hero_image_url TEXT DEFAULT '',
  
  -- About Section
  about_heading_en TEXT DEFAULT 'About Our Institution',
  about_heading_ur TEXT DEFAULT 'ہمارے مدرسہ کا تعارف',
  about_history_en TEXT DEFAULT 'Established to preserve authentic Islamic sciences and provide holistic guidance to young minds.',
  about_history_ur TEXT DEFAULT 'ادارے کا قیام مستند دینی علوم کے تحفظ اور نوجوان طلبہ کی ہمہ جہت دینی و اخلاقی رہنمائی کے لیے عمل میں لایا گیا ہے۔',
  about_mission_en TEXT DEFAULT 'To instill deep Quranic literacy, moral uprightness, and service to humanity in every student.',
  about_mission_ur TEXT DEFAULT 'ہر طالب علم میں قرآنی شعور، اعلیٰ اخلاقی اقدار اور انسانیت کی خدمت کا جذبہ بیدار کرنا۔',
  about_vision_en TEXT DEFAULT 'To be a beacon of authentic traditional learning harmonized with disciplined personal development.',
  about_vision_ur TEXT DEFAULT 'ایک ایسا مثالی مرکز بننا جو روایتی دینی تعلیم اور متوازن عملی کردار سازی کا امین ہو۔',
  about_objectives_en TEXT DEFAULT '1. Rigorous Hifz with Tajweed\n2. Classical Arabic & Hadith basics\n3. Holistic character building & personal hygiene\n4. Serving underprivileged and orphan students.',
  about_objectives_ur TEXT DEFAULT '۱۔ تجوید و ترتیل کے ساتھ حفظِ قرآن کریم\n۲۔ ابتدائی عربی زبان اور بنیادی اسلامی فقہ\n۳۔ سیرت کی روشنی میں اخلاقی و عملی تربیت\n۴۔ یتیم اور مستحق طلبہ کی کفالت اور نگہداشت۔',
  
  -- Video Section
  intro_video_title_en TEXT DEFAULT 'A Glimpse into Daily Life at the Madrasa',
  intro_video_title_ur TEXT DEFAULT 'مدرسہ کی روزمرہ تعلیمی سرگرمیوں کی ایک جھلک',
  intro_video_desc_en TEXT DEFAULT 'Watch our students recite the Holy Quran, participate in daily assemblies, and engage in disciplined learning.',
  intro_video_desc_ur TEXT DEFAULT 'طلبہ کرام کی تلاوتِ کلام پاک، روزانہ کے تعلیمی حلقہ جات اور تربیتی معمولات کا مختصر مشاہدہ فرمائیں۔',
  intro_video_url TEXT DEFAULT '',
  intro_video_thumb TEXT DEFAULT '',
  
  -- Contact & Social
  phone TEXT DEFAULT '+91 98765 43210',
  email TEXT DEFAULT 'contact@madrasarabbani.org',
  address_en TEXT DEFAULT 'Near Baug-e-Rabbani, Dist. Cultural Campus, India',
  address_ur TEXT DEFAULT 'نزد باغِ ربانی، ضلع کیمپس، بھارت',
  whatsapp TEXT DEFAULT '+91 98765 43210',
  facebook_url TEXT DEFAULT '',
  youtube_url TEXT DEFAULT '',
  twitter_url TEXT DEFAULT '',
  
  -- Donation Details
  donation_enabled BOOLEAN NOT NULL DEFAULT true,
  donation_qr_url TEXT DEFAULT '',
  upi_id TEXT DEFAULT 'madrasa@upi',
  bank_name TEXT DEFAULT 'State Bank of India',
  account_holder TEXT DEFAULT 'Madrasa Rabbani Baug Educational Trust',
  account_number TEXT DEFAULT '389201928312',
  ifsc_code TEXT DEFAULT 'SBIN0001234',
  branch TEXT DEFAULT 'Main Campus Branch',
  donation_instructions_en TEXT DEFAULT 'Scan the QR code using any UPI app (Google Pay, PhonePe, Paytm, or BHIM). Please retain your transaction reference or contact us for an official receipt.',
  donation_instructions_ur TEXT DEFAULT 'گوگل پے، فون پے یا کسی بھی یو پی آئی ایپ سے کیو آر کوڈ اسکین کریں۔ عطیات کی رسید حاصل کرنے کے لیے ٹرانزیکشن کا اسکرین شاٹ محفوظ رکھیں۔',
  
  -- Footer & Legal Notice
  footer_text_en TEXT DEFAULT 'A registered non-profit educational society dedicated to religious learning, social welfare, and moral development.',
  footer_text_ur TEXT DEFAULT 'ایک رجسٹرڈ غیر منافع بخش تعلیمی ادارہ جو دینی تعلیم، سماجی فلاح اور اخلاقی تربیت کے لیے کوشاں ہے۔',
  copyright_text_en TEXT DEFAULT 'All Rights Reserved. Madrasa Rabbani Baug.',
  copyright_text_ur TEXT DEFAULT 'جملہ حقوق بحق مدرسہ ربانی باغ محفوظ ہیں۔',
  
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Homepage Section Toggles & Ordering
CREATE TABLE IF NOT EXISTS public.homepage_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT NOT NULL UNIQUE,
  title_en TEXT NOT NULL,
  title_ur TEXT NOT NULL,
  subtitle_en TEXT DEFAULT '',
  subtitle_ur TEXT DEFAULT '',
  is_visible BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Educational Programs Table
CREATE TABLE IF NOT EXISTS public.programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_en TEXT NOT NULL,
  title_ur TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_desc_en TEXT NOT NULL,
  short_desc_ur TEXT NOT NULL,
  detailed_desc_en TEXT NOT NULL,
  detailed_desc_ur TEXT NOT NULL,
  age_group_en TEXT DEFAULT '',
  age_group_ur TEXT DEFAULT '',
  timing_en TEXT DEFAULT '',
  timing_ur TEXT DEFAULT '',
  curriculum_highlights_en TEXT DEFAULT '',
  curriculum_highlights_ur TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  video_url TEXT DEFAULT '',
  display_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Current Needs / Problems Table
CREATE TABLE IF NOT EXISTS public.problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_en TEXT NOT NULL,
  title_ur TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary_en TEXT NOT NULL,
  summary_ur TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_ur TEXT NOT NULL,
  why_needed_en TEXT NOT NULL,
  why_needed_ur TEXT NOT NULL,
  requested_amount TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'archived')),
  image_url TEXT DEFAULT '',
  video_url TEXT DEFAULT '',
  supporting_doc_url TEXT DEFAULT '',
  donation_note_en TEXT DEFAULT '',
  donation_note_ur TEXT DEFAULT '',
  display_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Student Statistics Table
CREATE TABLE IF NOT EXISTS public.student_statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label_en TEXT NOT NULL,
  label_ur TEXT NOT NULL,
  value TEXT NOT NULL,
  subtext_en TEXT DEFAULT '',
  subtext_ur TEXT DEFAULT '',
  icon_name TEXT NOT NULL DEFAULT 'GraduationCap',
  year_or_period TEXT DEFAULT 'Current Academic Session',
  display_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Student Activities & Achievements Table
CREATE TABLE IF NOT EXISTS public.student_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_en TEXT NOT NULL,
  title_ur TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_ur TEXT NOT NULL,
  category_en TEXT DEFAULT 'Academic Event',
  category_ur TEXT DEFAULT 'تعلیمی سرگرمی',
  activity_date DATE DEFAULT CURRENT_DATE,
  image_url TEXT DEFAULT '',
  display_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Legal Documents Table
CREATE TABLE IF NOT EXISTS public.legal_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_en TEXT NOT NULL,
  title_ur TEXT NOT NULL,
  description_en TEXT DEFAULT '',
  description_ur TEXT DEFAULT '',
  category_en TEXT NOT NULL DEFAULT 'Registration Document',
  category_ur TEXT NOT NULL DEFAULT 'رجسٹریشن دستاویزات',
  file_url TEXT NOT NULL,
  thumbnail_url TEXT DEFAULT '',
  issue_date TEXT DEFAULT '',
  document_number TEXT DEFAULT '',
  is_public BOOLEAN NOT NULL DEFAULT true,
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;

-- 1. admin_profiles Policies
CREATE POLICY "Admins can view profile entries"
  ON public.admin_profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "Superadmins can insert profiles"
  ON public.admin_profiles FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin() OR NOT EXISTS (SELECT 1 FROM public.admin_profiles));

CREATE POLICY "Admins can update profiles"
  ON public.admin_profiles FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 2. site_settings Policies
CREATE POLICY "Public can view site settings"
  ON public.site_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage site settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 3. homepage_sections Policies
CREATE POLICY "Public can view homepage sections"
  ON public.homepage_sections FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage homepage sections"
  ON public.homepage_sections FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4. programs Policies
CREATE POLICY "Public can view published programs"
  ON public.programs FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Admins can manage programs"
  ON public.programs FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5. problems Policies
CREATE POLICY "Public can view published problems"
  ON public.problems FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Admins can manage problems"
  ON public.problems FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 6. student_statistics Policies
CREATE POLICY "Public can view published student statistics"
  ON public.student_statistics FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Admins can manage student statistics"
  ON public.student_statistics FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 7. student_activities Policies
CREATE POLICY "Public can view published student activities"
  ON public.student_activities FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Admins can manage student activities"
  ON public.student_activities FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 8. legal_documents Policies
CREATE POLICY "Public can view public published documents"
  ON public.legal_documents FOR SELECT
  TO public
  USING (is_public = true AND is_published = true);

CREATE POLICY "Admins can manage legal documents"
  ON public.legal_documents FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
