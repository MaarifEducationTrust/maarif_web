import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { StudentStatistic, StudentActivity, StaffMember } from '../types';
import { getStudentStatistics, getStudentActivities, getStaffMembers } from '../lib/db';
import { SafeImage } from '../components/common/SafeImage';
import { IconRenderer } from '../components/common/IconRenderer';
import { 
  Users, 
  Calendar, 
  Award, 
  ShieldCheck, 
  BookOpen, 
  Sparkles, 
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Heart,
  Home,
  Activity,
  Smile
} from 'lucide-react';

export const Students: React.FC = () => {
  const { t, getField, isRtl } = useLanguage();
  const [statistics, setStatistics] = useState<StudentStatistic[]>([]);
  const [activities, setActivities] = useState<StudentActivity[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [stats, acts, staffMembers] = await Promise.all([
          getStudentStatistics(false),
          getStudentActivities(false),
          getStaffMembers(false),
        ]);
        setStatistics(stats);
        setActivities(acts);
        setStaff(staffMembers);
      } catch (err) {
        console.error('Failed to load student data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const leadershipStaff = staff.filter(s => s.category === 'leadership');
  const teachingStaff = staff.filter(s => s.category === 'teaching');
  const supportStaff = staff.filter(s => s.category === 'support');

  return (
    <div className="py-12 sm:py-16 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-4 py-1.5 rounded-full border border-emerald-200/60 inline-flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>{t('nav_students')}</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
            {isRtl ? 'طلبہ، اساتذہ اور تعلیمی برادری' : 'Student Life & Educational Community'}
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            {isRtl 
              ? 'جامعہ کے زیرِ انتظام مقیم طلبہ کی دینی و عصری تعلیم، رہائشی کفالت، پرسکون تعلیمی ماحول اور تصدیق شدہ اساتذہ کی فہرست۔' 
              : 'Dedicated to fostering Quranic literacy, academic schooling, and holistic moral tarbiyah for all residential students.'}
          </p>

          {/* Privacy Disclaimer */}
          <div className="bg-emerald-50/80 border border-emerald-200/60 rounded-2xl p-4 text-emerald-950 text-xs flex items-start gap-2.5 text-left rtl:text-right max-w-2xl mx-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span className="leading-relaxed opacity-90">{t('student_privacy_note')}</span>
          </div>
        </div>

        {/* SECTION A: VERIFIED RESIDENTIAL STATISTICS */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
              {isRtl ? 'تصدیق شدہ ادارہ جاتی اعداد و شمار' : 'Verified Institutional Metrics'}
            </h2>
            <p className="text-xs text-stone-500">
              {isRtl ? 'حالیہ تعلیمی سیشن کے تصدیق شدہ کوائف' : 'Official confirmed records for the current session'}
            </p>
          </div>

          <div className={`mx-auto ${statistics.length === 1 ? 'max-w-md' : 'grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl'}`}>
            {statistics.map((stat) => {
              const label = getField(stat, 'label');
              const subtext = getField(stat, 'subtext');

              return (
                <div
                  key={stat.id}
                  className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-800/20 shadow-md flex flex-col items-center text-center space-y-3 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-1 group-hover:bg-emerald-800 group-hover:text-amber-400 transition-colors shadow-2xs">
                    <IconRenderer name={stat.icon_name} className="w-7 h-7" />
                  </div>
                  <span className="text-4xl sm:text-5xl font-extrabold text-emerald-950 font-sans tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-base font-bold text-stone-900">
                    {label}
                  </span>
                  {subtext && (
                    <p className="text-xs text-stone-600 leading-relaxed max-w-xs">
                      {subtext}
                    </p>
                  )}
                  {stat.year_or_period && (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full mt-2 border border-emerald-200/60">
                      {stat.year_or_period}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION B: RESIDENTIAL FACILITIES & COMPREHENSIVE CARE */}
        <section className="bg-stone-100/70 p-5 sm:p-8 md:p-12 rounded-3xl border border-stone-200 space-y-8">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-200/60">
              {isRtl ? 'رہائشی سہولیات اور کفالت' : 'Residential Facilities & Student Welfare'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {isRtl ? 'طلبہ کی مکمل کفالت اور پرسکون ماحول' : 'Complete Residential Boarding & Care'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              {isRtl 
                ? 'مدرسہ افضل المعارف اپنے تمام ۶۰ مقیم طلبہ کو معیاری تعلیم کے ساتھ مکمل آرام دہ رہائش اور دیکھ بھال فراہم کرتا ہے۔' 
                : 'Providing our 60 residential children with a safe, dignified, and loving atmosphere.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <span className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl inline-block">
                <Home className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-stone-900 text-base">
                {isRtl ? 'قیام و طعام اور لباس' : 'Accommodation & Daily Necessities'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isRtl 
                  ? 'طلبہ کے لیے آرام دہ رہائش، روزمرہ کا معیاری و غذائیت سے بھرپور طعام، مناسب لباس اور صفائی ستھرائی کی ضروریات کا مکمل انتظام۔' 
                  : 'Residential facilities include full accommodation, hygienic daily meals, appropriate clothing, and all essential day-to-day necessities.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <span className="p-2.5 bg-amber-50 text-amber-800 rounded-xl inline-block">
                <Smile className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-stone-900 text-base">
                {isRtl ? 'ہفتہ وار جیب خرچ' : 'Weekly Pocket Money'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isRtl 
                  ? 'بچوں کے وقار اور خود اعتمادی کو برقرار رکھنے کے لیے تمام طلبہ کو ہر ہفتے باقاعدگی سے جیب خرچ فراہم کیا جاتا ہے۔' 
                  : 'To support children with dignity and self-reliance, each student is provided with personal pocket money on a weekly basis.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <span className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl inline-block">
                <BookOpen className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-stone-900 text-base">
                {isRtl ? 'دینی و اسکول تعلیم کا امتزاج' : 'Religious & School Education'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isRtl 
                  ? 'قرآن کریم (قاعدہ، ناظرہ، حفظ) اور احادیث کے ساتھ ساتھ بنیادی اسکول کے مضامین: اردو، ہندی، انگریزی اور ریاضی کی باقاعدہ تدریس۔' 
                  : 'The Madrasa balances classical Quranic studies and Hadith with modern academic subjects: Urdu, Hindi, English, and Mathematics.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <span className="p-2.5 bg-rose-50 text-rose-800 rounded-xl inline-block">
                <Activity className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-stone-900 text-base">
                {isRtl ? 'طبی سہولیات اور ادویات' : 'Medical Assistance & Health'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isRtl 
                  ? 'کسی بھی طالب علم کی علالت کی صورت میں فوری طبی معائنہ، دیکھ بھال اور ضروری ادویات کا بروقت انتظام کیا جاتا ہے۔' 
                  : 'Prompt medical attention, doctor visits, and required medications are arranged whenever a student requires healthcare assistance.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <span className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl inline-block">
                <HeartHandshake className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-stone-900 text-base">
                {isRtl ? 'کھیل کود اور جسمانی نشوونما' : 'Outdoor Sports & Games'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isRtl 
                  ? 'طلبہ کو فارغ اوقات میں قریبی میدان میں لے جایا جاتا ہے جہاں وہ کھیل کود میں حصہ لے کر جسمانی صحت اور ٹیم ورک کو فروغ دیتے ہیں۔' 
                  : 'Students participate in outdoor games at a nearby playground during free time, encouraging physical fitness, teamwork, and vitality.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <span className="p-2.5 bg-amber-50 text-amber-800 rounded-xl inline-block">
                <Sparkles className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-stone-900 text-base">
                {isRtl ? 'اخلاقی و عملی تربیت (تربیت)' : 'Moral Tarbiyah & Ethics'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isRtl 
                  ? 'پانچوں نمازوں کی باجماعت پابندی، مسنون دعاؤں کا ورد، سچائی اور بزرگوں کے ادب کی عملی مشق روزانہ کے معمولات کا حصہ ہے۔' 
                  : 'Daily assemblies instill truthfulness, respect for elders, prayer adherence, modesty, and personal cleanliness.'}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION C: MADRASA LEADERSHIP & TEACHING STAFF */}
        <section className="space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-4 py-1.5 rounded-full border border-emerald-200/60 inline-flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{isRtl ? 'انتظامیہ و اساتذہ کرام' : 'Leadership & Faculty'}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {isRtl ? 'ادارہ کے مخلص اساتذہ اور نگران عملہ' : 'Madrasa Leadership & Teaching Staff'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
              {isRtl 
                ? 'قرآن و سنت کی روشنی میں نونہالانِ اسلام کی تعلیم و تربیت میں مصروف باعمل اساتذہ کرام اور نگراں حضرات۔' 
                : 'Dedicated scholars, teachers, and support personnel guiding our students daily.'}
            </p>
          </div>

          {/* Group 1: Leadership */}
          <div className="space-y-4">
            <div className="border-b border-stone-200 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{isRtl ? 'سرپرست و انتظامی قیادت' : 'Leadership'}</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {leadershipStaff.map((member) => (
                <div key={member.id} className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm">
                    {member.name_en.charAt(0)}
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">
                    {getField(member, 'name')}
                  </h4>
                  <p className="text-xs text-emerald-800 font-medium">
                    {getField(member, 'role')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Group 2: Teaching Staff */}
          <div className="space-y-4">
            <div className="border-b border-stone-200 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>{isRtl ? 'اساتذہ کرام (تعلیمی شعبہ جات)' : 'Teaching Staff'}</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {teachingStaff.map((member) => (
                <div key={member.id} className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-sm">
                    {member.name_en.charAt(0)}
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">
                    {getField(member, 'name')}
                  </h4>
                  <p className="text-xs text-stone-600 font-medium">
                    {getField(member, 'role')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Group 3: Support Staff */}
          <div className="space-y-4">
            <div className="border-b border-stone-200 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-stone-500" />
                <span>{isRtl ? 'معاون اور نگراں عملہ' : 'Support Staff'}</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              {supportStaff.map((member) => (
                <div key={member.id} className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-sm">
                    {member.name_en.charAt(0)}
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">
                    {getField(member, 'name')}
                  </h4>
                  <p className="text-xs text-stone-600 font-medium">
                    {getField(member, 'role')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION D: APPROVED STUDENT ACTIVITIES & EVENTS */}
        <section className="space-y-8">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-200/60 inline-flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>{isRtl ? 'سرگرمیاں و معمولات' : 'Events & Activities'}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {isRtl ? 'مدرسہ کی باقاعدہ تعلیمی و ہم نصابی سرگرمیاں' : 'Approved Educational Activities'}
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="w-6 h-6 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span className="text-xs text-stone-500">Loading activities...</span>
            </div>
          ) : activities.length === 0 ? (
            <p className="text-center text-xs text-stone-500 py-10">
              {t('no_activities')}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {activities.map((act) => {
                const title = getField(act, 'title');
                const desc = getField(act, 'description');
                const category = getField(act, 'category');

                return (
                  <div
                    key={act.id}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-200/80 hover:shadow-md transition-all flex flex-col justify-between group p-6 space-y-3"
                  >
                    <div>
                      {act.image_url && (
                        <div className="aspect-[16/10] overflow-hidden bg-stone-100 rounded-2xl mb-4">
                          <SafeImage
                            src={act.image_url}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                        <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                          {category}
                        </span>
                        {act.activity_date && (
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-stone-400" />
                            <span>{act.activity_date}</span>
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-lg text-stone-900 group-hover:text-emerald-800 transition-colors">
                        {title}
                      </h3>
                      <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mt-2">
                        {desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
