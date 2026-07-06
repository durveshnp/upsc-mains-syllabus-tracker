import { useMemo } from "react";
import { ALL_PAPERS } from "../data/syllabusLoader";
import { UserSettings, SyllabusPaper } from "../types";
import { 
  CheckCircle2, BookOpen, Star, FileSpreadsheet, Award, Flame, Hourglass, 
  TrendingUp, Layers, CheckSquare
} from "lucide-react";

interface StatsDashboardProps {
  settings: UserSettings;
  stats: {
    totalItems: number;
    completedItems: number;
    remainingItems: number;
    overallPercentage: number;
    totalRevisions: number;
    totalBookmarks: number;
    totalNotes: number;
    revisionPending: number;
    paperCounts: Record<string, { total: number; completed: number }>;
  };
  onNavigateToPaper: (paperId: string) => void;
}

export function StatsDashboard({ settings, stats, onNavigateToPaper }: StatsDashboardProps) {
  const paperLabels = useMemo(() => {
    const labels: Record<string, string> = {};
    for (const paper of ALL_PAPERS) {
      labels[paper.id] = paper.title;
    }
    return labels;
  }, []);

  const statsItems = [
    {
      title: "Completed Topics",
      value: stats.completedItems,
      total: stats.totalItems,
      desc: `${stats.remainingItems} Topics Remaining`,
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-950/50",
      icon: CheckCircle2
    },
    {
      title: "Total Revisions Done",
      value: stats.totalRevisions,
      desc: `${stats.revisionPending} Completed Needs Revision`,
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-950/50",
      icon: TrendingUp
    },
    {
      title: "Bookmarked Items",
      value: stats.totalBookmarks,
      desc: "Pinned for Special Focus",
      color: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-950/50",
      icon: Star
    },
    {
      title: "Saved Study Notes",
      value: stats.totalNotes,
      desc: "Micro-summaries stored",
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-950/50",
      icon: FileSpreadsheet
    }
  ];

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header and Hero Ring Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Progress Ring Widget */}
        <div className="lg:col-span-1 bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#27272A] rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400" />
          
          <span className="text-xs font-bold font-mono tracking-widest text-slate-400 dark:text-[#71717A] uppercase mb-4">
            OVERALL CSE MAINS PROGRESS
          </span>

          <div className="relative flex items-center justify-center w-40 h-40">
            {/* SVG Circle progress */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="68"
                className="stroke-slate-100 dark:stroke-slate-800 fill-transparent"
                strokeWidth="12"
              />
              <circle
                cx="80"
                cy="80"
                r="68"
                className="stroke-blue-600 dark:stroke-blue-500 fill-transparent stroke-linecap-round transition-all duration-1000"
                strokeWidth="12"
                strokeDasharray={2 * Math.PI * 68}
                strokeDashoffset={2 * Math.PI * 68 * (1 - stats.overallPercentage / 100)}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold font-mono text-slate-800 dark:text-slate-100 tracking-tight">
                {stats.overallPercentage}%
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-[#71717A] font-mono mt-0.5">
                {stats.completedItems} / {stats.totalItems} done
              </span>
            </div>
          </div>
        </div>

        {/* Welcome and Streak Dashboard Banner */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#121214] via-[#09090B] to-[#121214] text-white rounded-2xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden border border-slate-200 dark:border-[#27272A] shadow-xl">
          {/* Ambient graphics */}
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-10 right-20 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-500/25 text-blue-300 border border-blue-500/30 text-xs px-2.5 py-1 rounded-full font-semibold">
                CSE Mains Examination Tracker
              </span>
              <span className="bg-slate-850 dark:bg-[#18181B] border dark:border-[#27272A] text-slate-300 text-xs px-2.5 py-1 rounded-full font-mono font-semibold">
                V1.0
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
              Stay Consistent. Clear UPSC Mains.
            </h1>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              Analyze every micro-topic, draft quick summaries, flag difficulty zones, and coordinate revisions. Track your syllabus just like TakeUForward tracker tracks DSA sheets.
            </p>
          </div>

          <div className="flex gap-6 mt-6 border-t border-slate-200 dark:border-[#27272A] pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-2.5 rounded-xl text-blue-400">
                <Flame className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#71717A] font-mono tracking-wider">
                  STUDY STREAK
                </div>
                <div className="text-lg font-mono font-extrabold text-white">
                  🔥 {settings.dailyStreak} {settings.dailyStreak === 1 ? "Day" : "Days"} Active
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-2.5 rounded-xl text-blue-400">
                <CheckSquare className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#71717A] font-mono tracking-wider">
                  REMAINING LOAD
                </div>
                <div className="text-lg font-mono font-extrabold text-white">
                  ⏳ {stats.remainingItems} Topics Left
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bento Grid Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <div 
              key={i} 
              className={`p-5 rounded-xl border flex flex-col justify-between ${item.color} shadow-sm`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {item.title}
                </span>
                <div className="p-1.5 rounded-lg bg-white/60 dark:bg-black/10 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-slate-100">
                  {item.value}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {item.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Paper-by-Paper Progress Table */}
      <div className="bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#27272A] rounded-2xl p-6">
        <h3 className="text-sm font-bold font-mono tracking-wider text-slate-400 dark:text-[#71717A] uppercase mb-4">
          PAPER-WISE PROGRESS MAP
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ALL_PAPERS.map((paper) => {
            const pStats = stats.paperCounts[paper.id] || { total: 0, completed: 0 };
            const percentage = pStats.total > 0 ? Math.round((pStats.completed / pStats.total) * 100) : 0;
            
            // Generate progress bar colors dynamically based on percentage
            let barColor = "bg-slate-400";
            if (percentage > 75) barColor = "bg-blue-600 dark:bg-blue-500";
            else if (percentage > 40) barColor = "bg-blue-500 dark:bg-blue-400";
            else if (percentage > 15) barColor = "bg-amber-500 dark:bg-amber-400";
            else if (percentage > 0) barColor = "bg-blue-500 dark:bg-blue-400";

            return (
              <div 
                key={paper.id}
                onClick={() => onNavigateToPaper(paper.id)}
                className="group border border-slate-100 dark:border-[#27272A] rounded-xl p-4 bg-slate-50/50 dark:bg-[#121214] hover:bg-slate-100/50 dark:hover:bg-[#1C1C1F] cursor-pointer transition flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-snug">
                      {paperLabels[paper.id]}
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5 leading-snug">
                      {paper.subtitle}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-extrabold text-slate-600 dark:text-slate-300 ml-4 shrink-0 bg-white dark:bg-[#18181B] px-2 py-0.5 rounded border border-slate-200 dark:border-[#27272A]">
                    {percentage}%
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1 font-mono font-medium">
                    <span>{pStats.completed} / {pStats.total} Complete</span>
                    <span>{pStats.total - pStats.completed} Left</span>
                  </div>
                  {/* Progress Line */}
                  <div className="h-2 w-full bg-slate-200 dark:bg-[#27272A] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

export default StatsDashboard;
