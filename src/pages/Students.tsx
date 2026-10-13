import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { StudentStatistic, StudentActivity } from '../types';
import { getStudentStatistics, getStudentActivities } from '../lib/db';
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
  ArrowRight
} from 'lucide-react';

export const Students: React.FC = () => {
  const { t, getField, isRtl } = useLanguage();
  const [statistics, setStatistics] = useState<StudentStatistic[]>([]);
  const [activities, setActivities] = useState<StudentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [stats, acts] = await Promise.all([
          getStudentStatistics(false),
          getStudentActivities(false),
        ]);
        setStatistics(stats);
        setActivities(acts);
      } catch (err) {
        console.error('Failed to load student data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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
              ? 'جامعہ کے زیرِ انتظام طلبہ کی ہمہ جہت دینی و اخلاقی نشوونما، پرسکون تعلیمی ماحول اور تصدیق شدہ اعداد و شمار۔' 
              : 'Dedicated to fostering Quranic literacy, intellectual discipline, and holistic moral tarbiyah in every enrolled child.'}
          </p>

          {/* Privacy Disclaimer */}
          <div className="bg-emerald-50/80 border border-emerald-200/60 rounded-2xl p-4 text-emerald-950 text-xs flex items-start gap-2.5 text-left rtl:text-right max-w-2xl mx-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span className="leading-relaxed opacity-90">{t('student_privacy_note')}</span>
          </div>
        </div>

        {/* SECTION A: VERIFIED STATISTICS */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
              {isRtl ? 'ادارہ جاتی تصدیق شدہ اعداد و شمار' : 'Verified Educational Metrics'}
            </h2>
            <p className="text-xs text-stone-500">
              {isRtl ? 'حالیہ تعلیمی سیشن کے تازہ ترین کوائف' : 'Official records updated for the current session'}
            </p>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {statistics.map((stat) => {
              const label = getField(stat, 'label');
              const subtext = getField(stat, 'subtext');

              return (
                <div
                  key={stat.id}
                  className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-2 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-1 group-hover:bg-emerald-800 group-hover:text-amber-400 transition-colors">
                    <IconRenderer name={stat.icon_name} className="w-6 h-6" />
                  </div>
                  <span className="text-3xl sm:text-4xl font-extrabold text-emerald-950 font-sans tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-sm font-bold text-stone-800">
                    {label}
                  </span>
                  {subtext && (
                    <span className="text-[11px] text-stone-500 leading-tight">
                      {subtext}
                    </span>
                  )}
                  {stat.year_or_period && (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-md mt-1">
                      {stat.year_or_period}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION B: LEARNING ENVIRONMENT & VALUES */}
        <section className="bg-stone-100/70 p-5 sm:p-8 md:p-12 rounded-3xl border border-stone-200 space-y-8">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {isRtl ? 'طرزِ تعلیم اور تربیتی ماحول' : 'Disciplined Learning Environment'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              {isRtl 
                ? 'کلامِ الٰہی کے نور کے ساتھ ساتھ سنتِ نبوی کے مطابق پاکیزہ عادات اور باوقار طرزِ زندگی' 
                : 'A safe, supportive residential atmosphere where spirituality and hygiene go hand in hand.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <span className="p-2 bg-emerald-50 text-emerald-800 rounded-xl inline-block">
                <BookOpen className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-stone-900 text-base">
                {isRtl ? 'فرد بہ فرد نگرانی و حفظ' : 'Methodical Daily Revisions'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isRtl 
                  ? 'ہر طالب علم کو استاد کی مکمل توجہ حاصل ہوتی ہے، جس میں روزانہ سبق کے علاوہ سبقی اور منزل کا پختہ دور شامل ہے۔' 
                  : 'Structured daily reviews guarantee that memorized portions remain permanently preserved in heart and mind.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <span className="p-2 bg-amber-50 text-amber-800 rounded-xl inline-block">
                <Sparkles className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-stone-900 text-base">
                {isRtl ? 'اخلاقی و روحانی تربیت' : 'Moral Conduct & Tarbiyah'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isRtl 
                  ? 'نماز باجماعت کی پابندی، سچائی، مسنون دعاؤں اور بزرگوں کے احترام کی مستقل عملی مشق کرائی جاتی ہے۔' 
                  : 'Daily assemblies instill truthfulness, respect for parents and elders, modesty, and personal hygiene.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <span className="p-2 bg-emerald-50 text-emerald-800 rounded-xl inline-block">
                <HeartHandshake className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-stone-900 text-base">
                {isRtl ? 'یتیم و نادار طلبہ کی دیکھ بھال' : 'Welfare & Equal Care'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isRtl 
                  ? 'کسی بھی طالب علم میں غربت کی بنیاد پر کوئی امتیاز نہیں برتا جاتا۔ تمام طلبہ کو یکساں طعام اور محبت فراہم کی جاتی ہے۔' 
                  : 'All students are treated with uniform dignity. Needy and orphan learners receive complete lodging and nutrition.'}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION C: STUDENT ACTIVITIES & ACHIEVEMENTS */}
        <section className="space-y-8">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-200/60 inline-flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>{isRtl ? 'سرگرمیاں و کامیابیاں' : 'Events & Milestones'}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {isRtl ? 'سالانہ تعلیمی و تربیتی سرگرمیاں' : 'Approved Educational Activities'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {activities.map((act) => {
                const title = getField(act, 'title');
                const desc = getField(act, 'description');
                const category = getField(act, 'category');

                return (
                  <div
                    key={act.id}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-200/80 hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {act.image_url && (
                        <div className="aspect-[16/10] overflow-hidden bg-stone-100">
                          <SafeImage
                            src={act.image_url}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-6 space-y-3">
                        <div className="flex items-center justify-between text-xs text-stone-500">
                          <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
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
                        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                          {desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center pt-2 sm:pt-4">
            <Link
              to="/activities"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <span>{t('view_all_activities')}</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
