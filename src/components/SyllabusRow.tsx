import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Star, MessageSquare, Plus, CheckCircle, Clock } from "lucide-react";
import { SyllabusItem, UserItemState, PriorityType, DifficultyType } from "../types";

interface SyllabusRowProps {
  key?: string;
  item: SyllabusItem;
  userState: UserItemState;
  onUpdate: (id: string, updates: Partial<Omit<UserItemState, "id">>) => void;
  searchTerm?: string;
}

export function SyllabusRow({ item, userState, onUpdate, searchTerm }: SyllabusRowProps) {
  const [noteOpen, setNoteOpen] = useState(!!userState.note);
  const [localNote, setNote] = useState(userState.note || "");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state if it changes from outside (e.g. on Reset/Import)
  useEffect(() => {
    setNote(userState.note || "");
    if (userState.note) {
      setNoteOpen(true);
    }
  }, [userState.note]);

  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    onUpdate(item.id, { completed: e.target.checked });
  };

  const handleBookmark = () => {
    onUpdate(item.id, { bookmarked: !userState.bookmarked });
  };

  const handleNoteChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.slice(0, 200); // cap at 200 chars
    setNote(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onUpdate(item.id, { note: val });
    }, 500);
  };

  const handlePriorityCycle = () => {
    const priorities: PriorityType[] = ["Low", "Medium", "High"];
    const nextIdx = (priorities.indexOf(userState.importance) + 1) % priorities.length;
    onUpdate(item.id, { importance: priorities[nextIdx] });
  };

  const handleDifficultyCycle = () => {
    const difficulties: DifficultyType[] = ["Easy", "Medium", "Hard"];
    const nextIdx = (difficulties.indexOf(userState.difficulty) + 1) % difficulties.length;
    onUpdate(item.id, { difficulty: difficulties[nextIdx] });
  };

  const handleRevisionToggle = (level: number) => {
    // If they click the active revision level, toggle it off/down by 1, else set to this level
    const newLevel = userState.revisionLevel === level ? level - 1 : level;
    onUpdate(item.id, { revisionLevel: newLevel });
  };

  // Helper to highlight searched text
  const renderHighlightedText = (text: string, query: string) => {
    if (!query || !query.trim()) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi"));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() 
            ? <mark key={i} className="bg-yellow-200 text-slate-900 rounded-sm px-0.5">{part}</mark> 
            : part
        )}
      </span>
    );
  };

  return (
    <div className={`
      border-b border-slate-100 dark:border-[#27272A]/50 p-4 hover:bg-slate-50/50 dark:hover:bg-[#1C1C1F] transition duration-150
      ${userState.completed ? "bg-slate-50/20 dark:bg-zinc-950/20" : ""}
    `}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Core Checkbox + Text */}
        <div className="flex items-start gap-3 flex-1">
          <label className="relative flex items-center justify-center shrink-0 cursor-pointer mt-1">
            <input
              type="checkbox"
              checked={userState.completed}
              onChange={handleCheckbox}
              className="peer sr-only"
            />
            {/* Custom styled checkbox with transition */}
            <div className={`
              w-5 h-5 rounded border-2 transition-all flex items-center justify-center
              peer-checked:bg-blue-600 peer-checked:border-blue-600 peer-checked:scale-105
              border-slate-300 dark:border-[#27272A] bg-white dark:bg-[#121214]
              peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500
            `}>
              {userState.completed && (
                <svg className="w-3.5 h-3.5 text-white stroke-current stroke-3 fill-transparent" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </label>

          <div className="space-y-1 min-w-0">
            <span className={`
              text-sm font-medium transition leading-relaxed block
              ${userState.completed 
                ? "text-slate-400 dark:text-slate-500 line-through decoration-slate-300 dark:decoration-slate-700" 
                : "text-slate-800 dark:text-slate-100"
              }
            `}>
              {renderHighlightedText(item.text, searchTerm || "")}
            </span>
            
            {/* Inline Note Preview when folded */}
            {!noteOpen && userState.note && (
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono italic max-w-lg line-clamp-1">
                Note: {userState.note}
              </p>
            )}
          </div>
        </div>

        {/* Action Widgets & Badges */}
        <div className="flex flex-wrap items-center gap-3 sm:shrink-0">
          
          {/* Priority Tag */}
          <button
            onClick={handlePriorityCycle}
            className={`
              text-xs px-2 py-0.5 rounded-full font-semibold border transition font-mono
              ${userState.importance === "High" 
                ? "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/50" 
                : userState.importance === "Medium"
                ? "bg-blue-55/10 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/50"
                : "bg-slate-100 dark:bg-[#18181B] text-slate-655 dark:text-[#A1A1AA] border-slate-200 dark:border-[#27272A]"
              }
            `}
          >
            {userState.importance}
          </button>

          {/* Difficulty Tag */}
          <button
            onClick={handleDifficultyCycle}
            className={`
              text-xs px-2 py-0.5 rounded-full font-semibold border transition font-mono
              ${userState.difficulty === "Hard" 
                ? "bg-purple-55/10 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-900/50" 
                : userState.difficulty === "Medium"
                ? "bg-blue-55/10 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/50"
                : "bg-green-55/10 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-100 dark:border-green-900/50"
              }
            `}
          >
            {userState.difficulty}
          </button>

          {/* Revisions Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#18181B] p-0.5 rounded-lg border border-slate-200 dark:border-[#27272A]">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#71717A] font-mono px-1.5 select-none">
              Rev
            </span>
            {[1, 2, 3, 4, 5].map((lvl) => {
              const active = userState.revisionLevel >= lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => handleRevisionToggle(lvl)}
                  title={`Revision ${lvl}`}
                  className={`
                    w-5 h-5 rounded text-[10px] font-bold font-mono transition flex items-center justify-center
                    ${active 
                      ? "bg-blue-600 text-white" 
                      : "text-slate-400 dark:text-[#71717A] hover:bg-slate-200 dark:hover:bg-[#27272A] hover:text-slate-700 dark:hover:text-white"
                    }
                  `}
                >
                  {lvl}
                </button>
              );
            })}
          </div>

          {/* Note toggle */}
          <button
            onClick={() => setNoteOpen(!noteOpen)}
            className={`
              p-1.5 rounded-lg border transition
              ${noteOpen 
                ? "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50" 
                : "bg-white dark:bg-[#18181B] text-slate-400 dark:text-[#71717A] border-slate-200 dark:border-[#27272A] hover:text-slate-600 dark:hover:text-white"
              }
            `}
            title="Write study notes"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmark}
            className={`
              p-1.5 rounded-lg border transition
              ${userState.bookmarked 
                ? "bg-orange-50 dark:bg-orange-950/20 text-orange-500 dark:text-orange-400 border-orange-200 dark:border-orange-900/50" 
                : "bg-white dark:bg-[#18181B] text-slate-400 dark:text-[#71717A] border-slate-200 dark:border-[#27272A] hover:text-slate-600 dark:hover:text-white"
              }
            `}
            title="Bookmark this topic"
          >
            <Star className={`w-4 h-4 ${userState.bookmarked ? "fill-orange-500 dark:fill-orange-400" : ""}`} />
          </button>

        </div>

      </div>

      {/* Expandable Note Editor */}
      {noteOpen && (
        <div className="mt-3 pl-8">
          <div className="relative">
            <input
              type="text"
              value={localNote}
              onChange={handleNoteChange}
              placeholder="Add notes (e.g. focus areas, standard readings, core cases...) - Max 200 chars"
              className="w-full text-xs py-2 pl-3 pr-16 bg-slate-50 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
            />
            {/* Note text counter */}
            <span className="absolute right-3 top-2.5 text-[10px] font-mono font-bold text-slate-400 dark:text-[#71717A] select-none">
              {localNote.length}/200
            </span>
          </div>
          {/* Last updated info */}
          {userState.lastUpdatedDate && (
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-[#71717A] font-mono mt-1.5 pl-1">
              <Clock className="w-3 h-3" />
              <span>Last updated: {userState.lastUpdatedDate}</span>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
export default SyllabusRow;
