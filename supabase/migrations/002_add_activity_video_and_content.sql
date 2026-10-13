-- Migration: 002_add_activity_video_and_content.sql
-- Description: Adds optional video_url, extended content fields, and updated_at to student_activities table
-- Author: Madrasa Portal System

-- 1. Add new columns to student_activities if they do not exist
ALTER TABLE public.student_activities
  ADD COLUMN IF NOT EXISTS video_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS content_en TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS content_ur TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- 2. Ensure Row Level Security (RLS) is enabled
ALTER TABLE public.student_activities ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Public can view published student activities
DROP POLICY IF EXISTS "Public can view published student activities" ON public.student_activities;
CREATE POLICY "Public can view published student activities"
  ON public.student_activities FOR SELECT
  TO public
  USING (is_published = true);

-- 4. Policy: Authenticated administrators have full CRUD access
DROP POLICY IF EXISTS "Admins can manage student activities" ON public.student_activities;
CREATE POLICY "Admins can manage student activities"
  ON public.student_activities FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5. Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_activity_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_student_activities_updated ON public.student_activities;
CREATE TRIGGER on_student_activities_updated
  BEFORE UPDATE ON public.student_activities
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_activity_updated_at();
