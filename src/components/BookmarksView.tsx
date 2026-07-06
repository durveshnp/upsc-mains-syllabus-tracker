import { useMemo } from "react";
import { ALL_PAPERS } from "../data/syllabusLoader";
import { SyllabusItem, UserItemState } from "../types";
import { SyllabusRow } from "./SyllabusRow";
import { Star, Award } from "lucide-react";

interface BookmarksViewProps {
  itemStates: Record<string, UserItemState>;
  onUpdateItem: (id: string, updates: Partial<Omit<UserItemState, "id">>) => void;
}

export function BookmarksView({ itemStates, onUpdateItem }: BookmarksViewProps) {
  // Collect all bookmarked items stably
  const bookmarkedItems = useMemo(() => {
    const list: Array<{ item: SyllabusItem; state: UserItemState; paperName: string; subjectName: string }> = [];
    
    for (const paper of ALL_PAPERS) {
      for (const subject of paper.subjects) {
        for (const topic of subject.topics) {
          for (const item of topic.items) {
            const uState = itemStates[item.id];
            if (uState?.bookmarked) {
              list.push({
                item,
                state: uState,
                paperName: paper.title,
                subjectName: subject.name
              });
            }
          }
        }
      }
    }
    return list;
  }, [itemStates]);

  if (bookmarkedItems.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center max-w-lg mx-auto mt-10">
        <div className="bg-amber-100 dark:bg-amber-950 p-4 rounded-full text-amber-500 dark:text-amber-400 w-16 h-10 flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 fill-transparent" />
        </div>
        <h3 className="font-sans font-bold text-lg text-slate-800 dark:text-slate-100">
          No Bookmarked Topics
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 leading-relaxed">
          Bookmark high-yield topics, complex subject lines, or areas needing special attention by clicking the star (★) button beside any syllabus topic. They will appear here for focused study sessions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Overview Head */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 md:p-6 flex justify-between items-center gap-4">
        <div className="flex gap-4 items-start">
          <div className="bg-amber-100 dark:bg-amber-950 p-2.5 rounded-lg text-amber-500 dark:text-amber-400 shrink-0">
            <Star className="w-5 h-5 fill-amber-500 dark:fill-amber-400" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-base text-slate-800 dark:text-slate-100">
              Personal Bookmarked Topics
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed max-w-xl">
              Focus on these complex topics. Un-bookmarking any item here will automatically remove it from this list.
            </p>
          </div>
        </div>
        <span className="font-mono text-xs font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 rounded-full shrink-0 border border-amber-100/50 dark:border-amber-950/50">
          ★ {bookmarkedItems.length} Pinned
        </span>
      </div>

      {/* Bookmarked Items List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
        {bookmarkedItems.map(({ item, state, paperName, subjectName }) => (
          <div key={item.id} className="relative group">
            {/* Tiny top indicator of paper context */}
            <div className="absolute top-2 left-4 z-10 text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1 select-none pointer-events-none">
              <span>{paperName}</span>
              <span>/</span>
              <span className="truncate max-w-[120px]">{subjectName}</span>
            </div>
            {/* The standard Row styled with padding-top offset for the paper label */}
            <div className="pt-2.5">
              <SyllabusRow 
                item={item}
                userState={state}
                onUpdate={onUpdateItem}
              />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
export default BookmarksView;
