import { supabase, isSupabaseConfigured } from './supabase';
import { 
  SiteSettings, 
  HomepageSection, 
  Program, 
  Problem, 
  StudentStatistic, 
  StudentActivity, 
  LegalDocument 
} from '../types';
import { 
  initialSiteSettings, 
  initialSections, 
  initialPrograms, 
  initialProblems, 
  initialStatistics, 
  initialActivities, 
  initialDocuments 
} from './initialData';

// Local storage helpers for mock/offline fallback
function getLocalItem<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(`madrasa_${key}`);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocalItem<T>(key: string, val: T): void {
  try {
    localStorage.setItem(`madrasa_${key}`, JSON.stringify(val));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

// 1. Site Settings
export async function getSiteSettings(): Promise<SiteSettings> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'current')
        .single();
      if (!error && data) return data as SiteSettings;
    } catch (err) {
      console.warn('Supabase site_settings fetch error, falling back:', err);
    }
  }
  return getLocalItem<SiteSettings>('site_settings', initialSiteSettings);
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('site_settings')
      .upsert({ ...settings, id: 'current', updated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw error;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('madrasa_settings_updated', { detail: data }));
    }
    return data as SiteSettings;
  }
  const current = getLocalItem<SiteSettings>('site_settings', initialSiteSettings);
  const updated = { ...current, ...settings, updated_at: new Date().toISOString() };
  setLocalItem('site_settings', updated);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('madrasa_settings_updated', { detail: updated }));
  }
  return updated;
}

// 2. Homepage Sections
export async function getHomepageSections(): Promise<HomepageSection[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('homepage_sections')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && data && data.length > 0) return data as HomepageSection[];
    } catch (err) {
      console.warn('Supabase homepage_sections fetch error, falling back:', err);
    }
  }
  return getLocalItem<HomepageSection[]>('homepage_sections', initialSections);
}

export async function updateHomepageSection(section: Partial<HomepageSection> & { id: string }): Promise<void> {
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from('homepage_sections')
      .update({ ...section, updated_at: new Date().toISOString() })
      .eq('id', section.id);
    if (error) throw error;
    return;
  }
  const current = getLocalItem<HomepageSection[]>('homepage_sections', initialSections);
  const updated = current.map(s => s.id === section.id ? { ...s, ...section } : s);
  setLocalItem('homepage_sections', updated);
}

// 3. Programs
export async function getPrograms(adminMode: boolean = false): Promise<Program[]> {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('programs').select('*').order('display_order', { ascending: true });
      if (!adminMode) {
        query = query.eq('is_published', true);
      }
      const { data, error } = await query;
      if (!error && data) return data as Program[];
    } catch (err) {
      console.warn('Supabase programs fetch error, falling back:', err);
    }
  }
  const local = getLocalItem<Program[]>('programs', initialPrograms);
  return adminMode ? local : local.filter(p => p.is_published);
}

export async function saveProgram(program: Partial<Program>): Promise<Program> {
  if (isSupabaseConfigured) {
    if (program.id) {
      const { data, error } = await supabase
        .from('programs')
        .update({ ...program, updated_at: new Date().toISOString() })
        .eq('id', program.id)
        .select()
        .single();
      if (error) throw error;
      return data as Program;
    } else {
      const { data, error } = await supabase
        .from('programs')
        .insert([{ ...program, created_at: new Date().toISOString() }])
        .select()
        .single();
      if (error) throw error;
      return data as Program;
    }
  }

  const current = getLocalItem<Program[]>('programs', initialPrograms);
  if (program.id) {
    const updatedList = current.map(p => p.id === program.id ? { ...p, ...program, updated_at: new Date().toISOString() } as Program : p);
    setLocalItem('programs', updatedList);
    return updatedList.find(p => p.id === program.id)!;
  } else {
    const newProg: Program = {
      id: `p-${Date.now()}`,
      title_en: program.title_en || 'New Program',
      title_ur: program.title_ur || '',
      slug: program.slug || `prog-${Date.now()}`,
      short_desc_en: program.short_desc_en || '',
      short_desc_ur: program.short_desc_ur || '',
      detailed_desc_en: program.detailed_desc_en || '',
      detailed_desc_ur: program.detailed_desc_ur || '',
      age_group_en: program.age_group_en || '',
      age_group_ur: program.age_group_ur || '',
      timing_en: program.timing_en || '',
      timing_ur: program.timing_ur || '',
      curriculum_highlights_en: program.curriculum_highlights_en || '',
      curriculum_highlights_ur: program.curriculum_highlights_ur || '',
      image_url: program.image_url || '',
      video_url: program.video_url || '',
      display_order: program.display_order ?? (current.length + 1),
      is_published: program.is_published ?? true,
      created_at: new Date().toISOString(),
    };
    const updatedList = [...current, newProg];
    setLocalItem('programs', updatedList);
    return newProg;
  }
}

export async function deleteProgram(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('programs').delete().eq('id', id);
    if (error) throw error;
    return;
  }
  const current = getLocalItem<Program[]>('programs', initialPrograms);
  setLocalItem('programs', current.filter(p => p.id !== id));
}

// 4. Problems / Current Needs
export async function getProblems(adminMode: boolean = false): Promise<Problem[]> {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('problems').select('*').order('display_order', { ascending: true });
      if (!adminMode) {
        query = query.eq('is_published', true);
      }
      const { data, error } = await query;
      if (!error && data) return data as Problem[];
    } catch (err) {
      console.warn('Supabase problems fetch error, falling back:', err);
    }
  }
  const local = getLocalItem<Problem[]>('problems', initialProblems);
  return adminMode ? local : local.filter(p => p.is_published);
}

export async function saveProblem(problem: Partial<Problem>): Promise<Problem> {
  if (isSupabaseConfigured) {
    if (problem.id) {
      const { data, error } = await supabase
        .from('problems')
        .update({ ...problem, updated_at: new Date().toISOString() })
        .eq('id', problem.id)
        .select()
        .single();
      if (error) throw error;
      return data as Problem;
    } else {
      const { data, error } = await supabase
        .from('problems')
        .insert([{ ...problem, created_at: new Date().toISOString() }])
        .select()
        .single();
      if (error) throw error;
      return data as Problem;
    }
  }

  const current = getLocalItem<Problem[]>('problems', initialProblems);
  if (problem.id) {
    const updatedList = current.map(p => p.id === problem.id ? { ...p, ...problem, updated_at: new Date().toISOString() } as Problem : p);
    setLocalItem('problems', updatedList);
    return updatedList.find(p => p.id === problem.id)!;
  } else {
    const newProb: Problem = {
      id: `pr-${Date.now()}`,
      title_en: problem.title_en || 'New Need',
      title_ur: problem.title_ur || '',
      slug: problem.slug || `need-${Date.now()}`,
      summary_en: problem.summary_en || '',
      summary_ur: problem.summary_ur || '',
      description_en: problem.description_en || '',
      description_ur: problem.description_ur || '',
      why_needed_en: problem.why_needed_en || '',
      why_needed_ur: problem.why_needed_ur || '',
      requested_amount: problem.requested_amount || '',
      status: problem.status || 'active',
      image_url: problem.image_url || '',
      video_url: problem.video_url || '',
      supporting_doc_url: problem.supporting_doc_url || '',
      donation_note_en: problem.donation_note_en || '',
      donation_note_ur: problem.donation_note_ur || '',
      display_order: problem.display_order ?? (current.length + 1),
      is_published: problem.is_published ?? true,
      created_at: new Date().toISOString(),
    };
    const updatedList = [...current, newProb];
    setLocalItem('problems', updatedList);
    return newProb;
  }
}

export async function deleteProblem(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('problems').delete().eq('id', id);
    if (error) throw error;
    return;
  }
  const current = getLocalItem<Problem[]>('problems', initialProblems);
  setLocalItem('problems', current.filter(p => p.id !== id));
}

// 5. Student Statistics
export async function getStudentStatistics(adminMode: boolean = false): Promise<StudentStatistic[]> {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('student_statistics').select('*').order('display_order', { ascending: true });
      if (!adminMode) {
        query = query.eq('is_published', true);
      }
      const { data, error } = await query;
      if (!error && data) return data as StudentStatistic[];
    } catch (err) {
      console.warn('Supabase statistics fetch error, falling back:', err);
    }
  }
  const local = getLocalItem<StudentStatistic[]>('statistics', initialStatistics);
  return adminMode ? local : local.filter(s => s.is_published);
}

export async function saveStudentStatistic(stat: Partial<StudentStatistic>): Promise<StudentStatistic> {
  if (isSupabaseConfigured) {
    if (stat.id) {
      const { data, error } = await supabase
        .from('student_statistics')
        .update({ ...stat, updated_at: new Date().toISOString() })
        .eq('id', stat.id)
        .select()
        .single();
      if (error) throw error;
      return data as StudentStatistic;
    } else {
      const { data, error } = await supabase
        .from('student_statistics')
        .insert([stat])
        .select()
        .single();
      if (error) throw error;
      return data as StudentStatistic;
    }
  }

  const current = getLocalItem<StudentStatistic[]>('statistics', initialStatistics);
  if (stat.id) {
    const updatedList = current.map(s => s.id === stat.id ? { ...s, ...stat, updated_at: new Date().toISOString() } as StudentStatistic : s);
    setLocalItem('statistics', updatedList);
    return updatedList.find(s => s.id === stat.id)!;
  } else {
    const newStat: StudentStatistic = {
      id: `s-${Date.now()}`,
      label_en: stat.label_en || '',
      label_ur: stat.label_ur || '',
      value: stat.value || '0',
      subtext_en: stat.subtext_en || '',
      subtext_ur: stat.subtext_ur || '',
      icon_name: stat.icon_name || 'GraduationCap',
      year_or_period: stat.year_or_period || '',
      display_order: stat.display_order ?? (current.length + 1),
      is_published: stat.is_published ?? true,
    };
    const updatedList = [...current, newStat];
    setLocalItem('statistics', updatedList);
    return newStat;
  }
}

export async function deleteStudentStatistic(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('student_statistics').delete().eq('id', id);
    if (error) throw error;
    return;
  }
  const current = getLocalItem<StudentStatistic[]>('statistics', initialStatistics);
  setLocalItem('statistics', current.filter(s => s.id !== id));
}

// 6. Student Activities
export async function getStudentActivities(adminMode: boolean = false): Promise<StudentActivity[]> {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('student_activities').select('*').order('display_order', { ascending: true });
      if (!adminMode) {
        query = query.eq('is_published', true);
      }
      const { data, error } = await query;
      if (!error && data) return data as StudentActivity[];
    } catch (err) {
      console.warn('Supabase activities fetch error, falling back:', err);
    }
  }
  const local = getLocalItem<StudentActivity[]>('activities', initialActivities);
  return adminMode ? local : local.filter(a => a.is_published);
}

export async function getActivityById(id: string): Promise<StudentActivity | null> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('student_activities')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) return data as StudentActivity;
    } catch (err) {
      console.warn('Supabase activity fetch by id error:', err);
    }
  }
  const local = getLocalItem<StudentActivity[]>('activities', initialActivities);
  return local.find(a => a.id === id) || null;
}

export async function saveStudentActivity(activity: Partial<StudentActivity>): Promise<StudentActivity> {
  let result: StudentActivity;
  if (isSupabaseConfigured) {
    if (activity.id) {
      const { data, error } = await supabase
        .from('student_activities')
        .update({
          ...activity,
          updated_at: new Date().toISOString(),
        })
        .eq('id', activity.id)
        .select()
        .single();
      if (error) throw error;
      result = data as StudentActivity;
    } else {
      const { data, error } = await supabase
        .from('student_activities')
        .insert([{ ...activity, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
        .select()
        .single();
      if (error) throw error;
      result = data as StudentActivity;
    }
  } else {
    const current = getLocalItem<StudentActivity[]>('activities', initialActivities);
    if (activity.id) {
      const updatedList = current.map(a => a.id === activity.id ? { 
        ...a, 
        ...activity,
        updated_at: new Date().toISOString(),
      } as StudentActivity : a);
      setLocalItem('activities', updatedList);
      result = updatedList.find(a => a.id === activity.id)!;
    } else {
      const newAct: StudentActivity = {
        id: `a-${Date.now()}`,
        title_en: activity.title_en || '',
        title_ur: activity.title_ur || '',
        description_en: activity.description_en || '',
        description_ur: activity.description_ur || '',
        content_en: activity.content_en || '',
        content_ur: activity.content_ur || '',
        category_en: activity.category_en || 'Event',
        category_ur: activity.category_ur || 'تقریب',
        activity_date: activity.activity_date || new Date().toISOString().split('T')[0],
        image_url: activity.image_url || '',
        video_url: activity.video_url || '',
        display_order: activity.display_order ?? (current.length + 1),
        is_published: activity.is_published ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const updatedList = [...current, newAct];
      setLocalItem('activities', updatedList);
      result = newAct;
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('madrasa_activities_updated', { detail: result }));
  }
  return result;
}

export async function deleteStudentActivity(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('student_activities').delete().eq('id', id);
    if (error) throw error;
  } else {
    const current = getLocalItem<StudentActivity[]>('activities', initialActivities);
    setLocalItem('activities', current.filter(a => a.id !== id));
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('madrasa_activities_updated', { detail: { id, deleted: true } }));
  }
}

// 7. Legal Documents
export async function getLegalDocuments(adminMode: boolean = false): Promise<LegalDocument[]> {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('legal_documents').select('*').order('display_order', { ascending: true });
      if (!adminMode) {
        query = query.eq('is_published', true).eq('is_public', true);
      }
      const { data, error } = await query;
      if (!error && data) return data as LegalDocument[];
    } catch (err) {
      console.warn('Supabase documents fetch error, falling back:', err);
    }
  }
  const local = getLocalItem<LegalDocument[]>('documents', initialDocuments);
  return adminMode ? local : local.filter(d => d.is_published && d.is_public);
}

export async function saveLegalDocument(doc: Partial<LegalDocument>): Promise<LegalDocument> {
  if (isSupabaseConfigured) {
    if (doc.id) {
      const { data, error } = await supabase
        .from('legal_documents')
        .update(doc)
        .eq('id', doc.id)
        .select()
        .single();
      if (error) throw error;
      return data as LegalDocument;
    } else {
      const { data, error } = await supabase
        .from('legal_documents')
        .insert([{ ...doc, created_at: new Date().toISOString() }])
        .select()
        .single();
      if (error) throw error;
      return data as LegalDocument;
    }
  }

  const current = getLocalItem<LegalDocument[]>('documents', initialDocuments);
  if (doc.id) {
    const updatedList = current.map(d => d.id === doc.id ? { ...d, ...doc } as LegalDocument : d);
    setLocalItem('documents', updatedList);
    return updatedList.find(d => d.id === doc.id)!;
  } else {
    const newDoc: LegalDocument = {
      id: `d-${Date.now()}`,
      title_en: doc.title_en || '',
      title_ur: doc.title_ur || '',
      description_en: doc.description_en || '',
      description_ur: doc.description_ur || '',
      category_en: doc.category_en || 'Certificate',
      category_ur: doc.category_ur || 'سند',
      file_url: doc.file_url || '',
      thumbnail_url: doc.thumbnail_url || '',
      issue_date: doc.issue_date || '',
      document_number: doc.document_number || '',
      is_public: doc.is_public ?? true,
      is_published: doc.is_published ?? true,
      display_order: doc.display_order ?? (current.length + 1),
      created_at: new Date().toISOString(),
    };
    const updatedList = [...current, newDoc];
    setLocalItem('documents', updatedList);
    return newDoc;
  }
}

export async function deleteLegalDocument(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('legal_documents').delete().eq('id', id);
    if (error) throw error;
    return;
  }
  const current = getLocalItem<LegalDocument[]>('documents', initialDocuments);
  setLocalItem('documents', current.filter(d => d.id !== id));
}

// 8. Admin Dashboard Aggregates
export async function getDashboardStats() {
  const [progs, probs, stats, acts, docs] = await Promise.all([
    getPrograms(true),
    getProblems(true),
    getStudentStatistics(true),
    getStudentActivities(true),
    getLegalDocuments(true),
  ]);

  return {
    totalPrograms: progs.length,
    publishedPrograms: progs.filter(p => p.is_published).length,
    totalProblems: probs.length,
    activeProblems: probs.filter(p => p.status === 'active' && p.is_published).length,
    totalStats: stats.length,
    totalActivities: acts.length,
    publishedActivities: acts.filter(a => a.is_published).length,
    totalDocuments: docs.length,
    publishedDocuments: docs.filter(d => d.is_published && d.is_public).length,
    isSupabaseLive: isSupabaseConfigured,
  };
}
