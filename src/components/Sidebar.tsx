import { useState } from "react";
import { 
  BookOpen, FileText, Bookmark, BarChart2, Book, Settings, Award, HelpCircle, 
  Menu, X, CheckSquare, Award as AwardIcon, Star, User
} from "lucide-react";
import { ALL_PAPERS } from "../data/syllabusLoader";
import { SyllabusPaper, UserSettings } from "../types";

interface SidebarProps {
  currentSection: string; // "home" | "bookmarks" | "stats" | "resources" | "settings" | paperId
  onSectionChange: (section: string) => void;
  settings: UserSettings;
  paperStats: Record<string, { total: number; completed: number }>;
}

export function Sidebar({ currentSection, onSectionChange, settings, paperStats }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getPaperProgress = (id: string) => {
    const stats = paperStats[id];
    if (!stats || stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  };

  const getPaperLabel = (paper: SyllabusPaper) => {
    return paper.title;
  };

  const menuItems = [
    { id: "home", label: "Dashboard", icon: BookOpen },
    { id: "bookmarks", label: "Bookmarked Topics", icon: Bookmark },
    { id: "stats", label: "Deep-Dive Statistics", icon: BarChart2 },
    { id: "resources", label: "Recommended Resources", icon: Book },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 transition"
          aria-label="Toggle Navigation Sidebar"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-50 dark:bg-[#121214] border-r border-slate-200 dark:border-[#27272A] 
        transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-200 ease-in-out
        flex flex-col h-screen select-none font-sans
      `}>
        
        {/* Header Branding */}
        <div className="p-6 border-b border-slate-200 dark:border-[#27272A] flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-1">
            <CheckSquare className="w-6 h-6 text-blue-600 dark:text-blue-500" />
            <span className="font-sans font-bold text-lg text-slate-800 dark:text-white tracking-tight">
              UPSC Tracker
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-[#71717A] font-semibold font-mono">
            IAS Preparation Engine
          </span>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
          
          {/* Main Controls Section */}
          <div>
            <h3 className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#71717A] font-mono">
              Main Dashboard
            </h3>
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSectionChange(item.id);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition
                      ${isActive 
                        ? "bg-blue-50 dark:bg-[#27272A] text-blue-700 dark:text-white border border-blue-100 dark:border-[#3F3F46]" 
                        : "text-slate-600 dark:text-[#A1A1AA] hover:bg-slate-100 dark:hover:bg-[#1C1C1F] hover:text-slate-900 dark:hover:text-white"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Syllabus Section */}
          <div>
            <h3 className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#71717A] font-mono">
              Mains Syllabus Papers
            </h3>
            <div className="space-y-1">
              {ALL_PAPERS.map((paper) => {
                const isActive = currentSection === paper.id;
                const progress = getPaperProgress(paper.id);
                return (
                  <button
                    key={paper.id}
                    onClick={() => {
                      onSectionChange(paper.id);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full flex flex-col px-3 py-2 rounded-lg text-sm font-medium transition text-left
                      ${isActive 
                        ? "bg-blue-50 dark:bg-[#27272A] text-blue-700 dark:text-white border border-blue-100 dark:border-[#3F3F46]" 
                        : "text-slate-600 dark:text-[#A1A1AA] hover:bg-slate-100 dark:hover:bg-[#1C1C1F] hover:text-slate-900 dark:hover:text-white"
                      }
                    `}
                  >
                    <div className="w-full flex items-center justify-between">
                      <span className="truncate">{getPaperLabel(paper)}</span>
                      <span className="font-mono text-xs text-slate-400 dark:text-blue-400">
                        {progress}%
                      </span>
                    </div>
                    {/* Micro Progress Bar */}
                    <div className="w-full bg-slate-200 dark:bg-[#27272A] h-1 rounded-full mt-1.5 overflow-hidden">
                      <div 
                        className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info: Streak tracker */}
        <div className="p-4 border-t border-slate-200 dark:border-[#27272A] bg-slate-100/50 dark:bg-slate-950/20">
          <div className="flex items-center gap-3 bg-white dark:bg-[#121214] p-3 rounded-lg border border-slate-200 dark:border-[#27272A]">
            <AwardIcon className="w-5 h-5 text-orange-500 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-slate-800 dark:text-white">
                Daily Study Streak
              </div>
              <div className="text-[11px] font-mono text-slate-500 dark:text-[#A1A1AA] font-bold">
                🔥 {settings.dailyStreak} {settings.dailyStreak === 1 ? "Day" : "Days"} Active
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
export default Sidebar;
