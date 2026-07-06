import { useMemo } from "react";
import { ALL_PAPERS } from "../data/syllabusLoader";
import { UserSettings, SyllabusPaper, SyllabusSubject } from "../types";
import { 
  BarChart2, Award, BookOpen, Flame, HelpCircle, FileText, Bookmark, 
  RotateCcw, Sparkles, TrendingUp
} from "lucide-react";

interface StatsViewProps {
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
    subjectCounts: Record<string, { total: number; completed: number }>;
  };
}

export function StatsView({ settings, stats }: StatsViewProps) {
  
  const getSubjectProgress = (subId: string) => {
    const sStats = stats.subjectCounts[subId];
    if (!stats || !sStats || sStats.total === 0) return 0;
    return Math.round((sStats.completed / stats.totalItems) * 100); // Wait, should be out of subject total!
  };

  const getSubjectPercentage = (subId: string) => {
    const sStats = stats.subjectCounts[subId];
    if (!sStats || sStats.total === 0) return 0;
    return Math.round((sStats.completed / sStats.total) * 100);
  };

  const paperLabels: Record<string, string> = {
    "essay": "Essay Paper",
    "gs1": "GS Paper I",
    "gs2": "GS Paper II",
    "gs3": "GS Paper III",
    "gs4": "GS Paper IV",
    "languages": "Compulsory Languages",
    "interview": "Interview (Personality Test)"
  };

  return (
    <div className="space-y-8" id="stats-dashboard-view">
      {/* High-level summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-mono text-gray-500 font-medium tracking-wide uppercase">Overall Completion</span>
          <div className="flex items-baseline space-x-1 mt-2">
            <span className="text-3xl font-sans font-bold text-slate-900 dark:text-white">{stats_percentage(stats)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-zinc-800 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                stats.overallPercentage < 33 ? "bg-red-500" : stats.overallPercentage < 75 ? "bg-amber-500" : "bg-emerald-500"
              }`}
              style={{ width: `${stats.overallPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-neutral-800">
          <div className="text-xs font-mono text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase mb-1">
            Active Study Streak
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Flame className="w-8 h-8 text-amber-500 shrink-0 animate-pulse" />
            <div>
              <span className="text-3xl font-sans font-extrabold text-slate-800 dark:text-slate-100">
                {settings.dailyStreak}
              </span>
              <span className="text-xs font-mono font-bold text-slate-400 ml-1">Days</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-3 leading-tight">
            Keep loading the applet daily to extend your streak.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-neutral-800">
          <div className="text-xs font-mono text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase mb-1">
            Micro-Notes Saved
          </div>
          <div className="flex items-center gap-2 mt-2">
            <FileText className="w-8 h-8 text-blue-500 shrink-0" />
            <span className="text-3xl font-sans font-extrabold text-slate-800 dark:text-slate-100">
              {stats.totalNotes}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-3 leading-tight">
            Drafted micro-summaries under syllabus checklines.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-neutral-800">
          <div className="text-xs font-mono text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase mb-1">
            Bookmarked Topics
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Bookmark className="w-8 h-8 text-amber-400 shrink-0" />
            <span className="text-3xl font-sans font-extrabold text-slate-800 dark:text-slate-100">
              {stats.totalBookmarks}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-3 leading-tight">
            Syllabus markers flagged for focused revisions.
          </p>
        </div>
      </div>

      {/* Progress deep analysis per paper & subject */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold font-mono tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-6 flex items-center gap-2 select-none">
          <RotateCcw className="w-4 h-4 text-emerald-500" />
          Syllabus Subject Completion Matrix
        </h3>

        <div className="space-y-8 divide-y divide-slate-100 dark:divide-slate-800">
          {ALL_PAPERS.map((paper, pIdx) => {
            const paperStats = stats.paperCounts[paper.id] || { total: 0, completed: 0 };
            const paperPercentage = paperStats.total > 0 ? Math.round((paperStats.completed / paperStats.total) * 100) : 0;
            
            return (
              <div key={paper.id} className={`${pIdx > 0 ? "pt-6" : ""}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100 tracking-tight leading-none">
                      {paperLabels[paper.id]}
                    </h4>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-1 block">
                      {paperStats.completed} of {paperStats.total} components checked
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                      {paperPercentage}% Paper Progress
                    </span>
                    <div className="w-24 bg-slate-200 dark:bg-slate-850 h-2 rounded-full overflow-hidden shrink-0">
                      <div className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full transition-all duration-300" style={{ width: `${paperPercentage}%` }} />
                    </div>
                  </div>
                </div>

                {/* Sub-subject matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {paper.subjects.map((subject) => {
                    const subStats = stats.subjectCounts[subject.id] || { total: 0, completed: 0 };
                    const subjectPercentage = getSubjectPercentage(subject.id);
                    
                    return (
                      <div 
                        key={subject.id}
                        className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/60 rounded-xl p-4 flex flex-col justify-between"
                      >
                        <div>
                          <h5 className="font-bold text-xs text-slate-700 dark:text-slate-200 tracking-wide line-clamp-1 leading-snug">
                            {subject.name}
                          </h5>
                          <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 mt-0.5 block">
                            {subStats.completed} / {subStats.total} Checked
                          </span>
                        </div>

                        <div className="mt-3">
                          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                            <div 
                              className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full transition-all duration-300"
                              style={{ width: `${subjectPercentage}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-400 mt-1 block text-right">
                            {subjectPercentage}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

// Wrapper calculation helpers safely
const stats_percentage = (statsObj: any) => statsObj.overallPercentage;

export default StatsView;
