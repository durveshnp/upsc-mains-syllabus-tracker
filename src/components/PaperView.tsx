import { useState, useMemo, useEffect } from "react";
import { SyllabusPaper, UserItemState, PriorityType, DifficultyType } from "../types";
import { SyllabusRow } from "./SyllabusRow";
import { 
  ChevronDown, ChevronRight, CheckSquare, ListTodo, Circle, Play, CheckCircle2,
  FolderClosed, FolderOpen, Layers, Award, ClipboardCheck
} from "lucide-react";

interface PaperViewProps {
  paper: SyllabusPaper;
  itemStates: Record<string, UserItemState>;
  onUpdateItem: (id: string, updates: Partial<Omit<UserItemState, "id">>) => void;
  searchText: string;
  activeFilter: string; // "all" | "completed" | "incomplete" | "bookmarked" | "revision" | "high"
  onMarkPaperComplete: (paperId: string, completed: boolean) => void;
  expandAllTrigger: number; // Incrementing triggers expand all
  collapseAllTrigger: number; // Incrementing triggers collapse all
}

export function PaperView({
  paper,
  itemStates,
  onUpdateItem,
  searchText,
  activeFilter,
  onMarkPaperComplete,
  expandAllTrigger,
  collapseAllTrigger
}: PaperViewProps) {
  
  // Track open topics (using stable topic IDs)
  const [openTopics, setOpenTopics] = useState<Record<string, boolean>>({});

  // Reset or force toggle expand/collapse states when triggers change
  useEffect(() => {
    if (expandAllTrigger > 0) {
      const allOpen: Record<string, boolean> = {};
      for (const subject of paper.subjects) {
        for (const topic of subject.topics) {
          allOpen[topic.id] = true;
        }
      }
      setOpenTopics(allOpen);
    }
  }, [expandAllTrigger, paper]);

  useEffect(() => {
    if (collapseAllTrigger > 0) {
      setOpenTopics({});
    }
  }, [collapseAllTrigger]);

  // Open any topic that contains matches when search text is entered
  useEffect(() => {
    if (searchText && searchText.trim().length > 0) {
      const query = searchText.toLowerCase();
      const nextOpen = { ...openTopics };
      for (const subject of paper.subjects) {
        for (const topic of subject.topics) {
          const matchFound = topic.items.some((item) => {
            const uState = itemStates[item.id];
            const textMatch = item.text.toLowerCase().includes(query);
            const noteMatch = uState?.note?.toLowerCase().includes(query);
            return textMatch || noteMatch;
          });
          if (matchFound) {
            nextOpen[topic.id] = true;
          }
        }
      }
      setOpenTopics(nextOpen);
    }
  }, [searchText]);

  // Toggle open state for single topic
  const toggleTopic = (topicId: string) => {
    setOpenTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  // Filter items in memory
  const filteredSyllabus = useMemo(() => {
    const query = searchText.toLowerCase().trim();
    
    return paper.subjects.map((subject) => {
      const filteredTopics = subject.topics.map((topic) => {
        const matchedItems = topic.items.filter((item) => {
          const uState = itemStates[item.id];
          
          // Match text query
          const matchesQuery = !query || 
            item.text.toLowerCase().includes(query) ||
            uState?.note?.toLowerCase().includes(query);
          
          if (!matchesQuery) return false;

          // Match active filter tags
          switch (activeFilter) {
            case "completed":
              return uState?.completed === true;
            case "incomplete":
              return uState?.completed !== true;
            case "bookmarked":
              return uState?.bookmarked === true;
            case "revision":
              return uState?.revisionLevel > 0;
            case "high":
              return uState?.importance === "High";
            default:
              return true;
          }
        });

        return { ...topic, items: matchedItems };
      }).filter((topic) => topic.items.length > 0); // Hide empty topics under search/filter

      return { ...subject, topics: filteredTopics };
    }).filter((subject) => subject.topics.length > 0); // Hide empty subjects under search/filter
  }, [paper, itemStates, searchText, activeFilter]);

  // Summary counts for this paper (unfiltered)
  const stats = useMemo(() => {
    let total = 0;
    let completed = 0;
    for (const subject of paper.subjects) {
      for (const topic of subject.topics) {
        for (const item of topic.items) {
          total++;
          if (itemStates[item.id]?.completed) {
            completed++;
          }
        }
      }
    }
    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [paper, itemStates]);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Sub-header paper info */}
      <div className="bg-slate-50 dark:bg-[#121214] border border-slate-200 dark:border-[#27272A] rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            {paper.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-lg leading-relaxed">
            {paper.subtitle}
          </p>
        </div>

        {/* Paper specific quick statistics block */}
        <div className="flex items-center gap-4 shrink-0 bg-white dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] p-4 rounded-xl">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 font-mono">
              PAPER COMPLETION
            </span>
            <span className="text-sm font-extrabold font-mono text-slate-700 dark:text-slate-200 mt-0.5">
              {stats.completed} / {stats.total} Topics done
            </span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-100 dark:border-[#27272A] flex items-center justify-center font-mono font-extrabold text-xs text-slate-700 dark:text-slate-200 select-none relative">
            {stats.percentage}%
            <svg className="absolute inset-0 w-full h-full transform -rotate-90 scale-105">
              <circle
                cx="24"
                cy="24"
                r="20"
                className="stroke-blue-600 dark:stroke-blue-500 fill-transparent"
                strokeWidth="4"
                strokeDasharray={2 * Math.PI * 20}
                strokeDashoffset={2 * Math.PI * 20 * (1 - stats.percentage / 100)}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Accordion List Content */}
      <div className="space-y-6">
        {filteredSyllabus.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 dark:bg-[#121214]/50 rounded-xl border border-slate-100 dark:border-[#27272A]">
            <ListTodo className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">
              No matching topics found in this paper.
            </span>
          </div>
        ) : (
          filteredSyllabus.map((subject) => (
            <div 
              key={subject.id} 
              className="bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#27272A] rounded-2xl overflow-hidden shadow-xs"
            >
              {/* Subject Title Block */}
              <div className="px-5 py-3.5 bg-slate-50/50 dark:bg-[#18181B]/55 border-b border-slate-200 dark:border-[#27272A] flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-blue-600 dark:text-blue-500 shrink-0" />
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                  {subject.name}
                </h3>
              </div>

              {/* Topics inside Subject */}
              <div className="divide-y divide-slate-100 dark:divide-[#27272A]">
                {subject.topics.map((topic) => {
                  const isOpen = openTopics[topic.id] || false;
                  
                  // Compute completed vs total for this collapsible topic row
                  const tTotal = topic.items.length;
                  const completedCount = topic.items.filter((itemObj) => itemStates[itemObj.id]?.completed).length;
                  const isAllDone = completedCount === tTotal;

                  return (
                    <div key={topic.id} className="transition">
                      
                      {/* Topic Trigger Button */}
                      <button
                        onClick={() => toggleTopic(topic.id)}
                        className={`
                          w-full flex items-center justify-between px-5 py-4 text-left transition select-none hover:bg-slate-50/30 dark:hover:bg-[#18181B]/30
                          ${isOpen ? "bg-slate-50/10 dark:bg-zinc-950/20" : ""}
                        `}
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-4">
                          {isOpen ? (
                            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                          )}
                          
                          {/* Folder icons based on status */}
                          {isAllDone ? (
                            <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                          ) : isOpen ? (
                            <FolderOpen className="w-4 h-4 text-blue-600/75 dark:text-blue-400/75 shrink-0" />
                          ) : (
                            <FolderClosed className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                          )}

                          <span className="font-bold text-sm text-slate-800 dark:text-slate-200 tracking-tight truncate">
                            {topic.name}
                          </span>
                        </div>

                        {/* Progress Fraction */}
                        <span className="font-mono text-xs text-slate-400 dark:text-slate-500 font-bold shrink-0">
                          {completedCount} / {tTotal} Complete
                        </span>
                      </button>

                      {/* syllabus item subtopics */}
                      {isOpen && (
                        <div className="bg-white dark:bg-[#121214]/60 divide-y divide-slate-100 dark:divide-[#27272A]/40 border-t border-slate-100 dark:border-[#27272A]/60 pl-2">
                          {topic.items.map((item) => (
                            <SyllabusRow
                              key={item.id}
                              item={item}
                              userState={itemStates[item.id] || {
                                id: item.id,
                                completed: false,
                                note: "",
                                revisionLevel: 0,
                                importance: (item.importance || "Medium") as PriorityType,
                                difficulty: (item.difficulty || "Medium") as DifficultyType,
                                bookmarked: false,
                                lastUpdatedDate: ""
                              }}
                              onUpdate={onUpdateItem}
                              searchTerm={searchText}
                            />
                          ))}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
export default PaperView;
