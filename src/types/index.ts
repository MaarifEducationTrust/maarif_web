export type Language = 'en' | 'ur';

export interface SiteSettings {
  id: string;
  madrasa_name_en: string;
  madrasa_name_ur: string;
  tagline_en: string;
  tagline_ur: string;
  logo_url: string;
  hero_badge_en: string;
  hero_badge_ur: string;
  hero_title_en: string;
  hero_title_ur: string;
  hero_subtitle_en: string;
  hero_subtitle_ur: string;
  hero_image_url: string;
  about_heading_en: string;
  about_heading_ur: string;
  about_history_en: string;
  about_history_ur: string;
  about_mission_en: string;
  about_mission_ur: string;
  about_vision_en: string;
  about_vision_ur: string;
  about_objectives_en: string;
  about_objectives_ur: string;
  intro_video_title_en: string;
  intro_video_title_ur: string;
  intro_video_desc_en: string;
  intro_video_desc_ur: string;
  intro_video_url: string;
  intro_video_thumb: string;
  phone: string;
  email: string;
  address_en: string;
  address_ur: string;
  whatsapp: string;
  facebook_url: string;
  youtube_url: string;
  twitter_url: string;
  donation_enabled: boolean;
  donation_qr_url: string;
  upi_id: string;
  bank_name: string;
  account_holder: string;
  account_number: string;
  ifsc_code: string;
  branch: string;
  donation_instructions_en: string;
  donation_instructions_ur: string;
  footer_text_en: string;
  footer_text_ur: string;
  copyright_text_en: string;
  copyright_text_ur: string;
  updated_at?: string;
}

export interface HomepageSection {
  id: string;
  section_key: 'hero' | 'about' | 'video' | 'programs' | 'impact' | 'needs' | 'documents' | 'donation';
  title_en: string;
  title_ur: string;
  subtitle_en: string;
  subtitle_ur: string;
  is_visible: boolean;
  display_order: number;
  updated_at?: string;
}

export interface Program {
  id: string;
  title_en: string;
  title_ur: string;
  slug: string;
  short_desc_en: string;
  short_desc_ur: string;
  detailed_desc_en: string;
  detailed_desc_ur: string;
  age_group_en: string;
  age_group_ur: string;
  timing_en: string;
  timing_ur: string;
  curriculum_highlights_en: string;
  curriculum_highlights_ur: string;
  image_url: string;
  video_url?: string;
  display_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Problem {
  id: string;
  title_en: string;
  title_ur: string;
  slug: string;
  summary_en: string;
  summary_ur: string;
  description_en: string;
  description_ur: string;
  why_needed_en: string;
  why_needed_ur: string;
  requested_amount: string; // Stored as entered by admin e.g. "₹ 2,50,000" or empty
  status: 'active' | 'resolved' | 'archived';
  image_url: string;
  video_url?: string;
  supporting_doc_url?: string;
  donation_note_en?: string;
  donation_note_ur?: string;
  display_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface StudentStatistic {
  id: string;
  label_en: string;
  label_ur: string;
  value: string; // e.g. "450+", "18", "100%"
  subtext_en: string;
  subtext_ur: string;
  icon_name: string; // Lucide icon name e.g. "GraduationCap", "Users", "BookOpen", "Award", "HeartHandshake"
  year_or_period: string;
  display_order: number;
  is_published: boolean;
  updated_at?: string;
}

export interface StudentActivity {
  id: string;
  title_en: string;
  title_ur: string;
  description_en: string;
  description_ur: string;
  content_en?: string;
  content_ur?: string;
  category_en: string;
  category_ur: string;
  activity_date: string;
  image_url: string;
  video_url?: string;
  display_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LegalDocument {
  id: string;
  title_en: string;
  title_ur: string;
  description_en: string;
  description_ur: string;
  category_en: string;
  category_ur: string;
  file_url: string;
  thumbnail_url?: string;
  issue_date: string;
  document_number: string;
  is_public: boolean;
  is_published: boolean;
  display_order: number;
  created_at?: string;
}

export interface AdminProfile {
  id: string;
  email: string;
  role: string;
  full_name: string;
  created_at?: string;
}
