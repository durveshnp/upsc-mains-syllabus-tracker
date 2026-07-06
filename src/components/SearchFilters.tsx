import { Search, SlidersHorizontal, Check, X } from "lucide-react";

interface SearchFiltersProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  activeFilter: string; // "all" | "completed" | "incomplete" | "bookmarked" | "revision" | "high"
  onFilterChange: (filter: string) => void;
  totalVisible: number;
}

export function SearchFilters({ searchText, onSearchChange, activeFilter, onFilterChange, totalVisible }: SearchFiltersProps) {
  const filterOptions = [
    { id: "all", label: "All Topics", color: "bg-slate-100 dark:bg-[#18181B] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#27272A]" },
    { id: "completed", label: "Completed", color: "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-100/50 dark:border-blue-950/50" },
    { id: "incomplete", label: "Incomplete", color: "bg-red-50 dark:bg-red-950/15 text-red-700 dark:text-red-400 border-red-100/50 dark:border-red-950/30" },
    { id: "bookmarked", label: "★ Bookmarked", color: "bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border-orange-100/50 dark:border-orange-950/30" },
    { id: "revision", label: "Pending Revision", color: "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-100/50 dark:border-blue-950/30" },
    { id: "high", label: "High Priority", color: "bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 border-orange-100/30 dark:border-orange-900/50" }
  ];

  return (
    <div className="space-y-4 bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#27272A] rounded-xl p-4 font-sans mb-6">
      
      {/* Search Input Panel */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 dark:text-[#71717A]">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search across topics, subtopics, study notes... (Press Esc to clear)"
            className="w-full text-sm pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] rounded-lg text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans font-medium"
            onKeyDown={(e) => {
              if (e.key === "Escape") onSearchChange("");
            }}
          />
          {searchText && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 dark:text-[#71717A] hover:text-slate-600 dark:hover:text-slate-350"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-[#71717A] flex items-center gap-1.5 mr-1.5 select-none">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </span>
          {filterOptions.map((opt) => {
            const isActive = activeFilter === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onFilterChange(opt.id)}
                className={`
                  text-xs px-3 py-1 rounded-full font-medium transition cursor-pointer border flex items-center gap-1
                  ${isActive 
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100" 
                    : `${opt.color} hover:opacity-85`
                  }
                `}
              >
                {isActive && <Check className="w-3.5 h-3.5 stroke-3" />}
                {opt.label}
              </button>
            );
          })}
        </div>
        
        {/* Count Indicator */}
        <span className="text-[11px] font-mono text-slate-400 dark:text-[#71717A] font-bold select-none self-end sm:self-center">
          {totalVisible} {totalVisible === 1 ? "topic match" : "topics matched"}
        </span>
      </div>

    </div>
  );
}
export default SearchFilters;
