import { useState, useEffect, useRef } from "react";
import { ALL_PAPERS } from "./data/syllabusLoader";
import { useTrackerState } from "./hooks/useTrackerState";
import { Sidebar } from "./components/Sidebar";
import { QuoteBox } from "./components/QuoteBox";
import { StatsDashboard } from "./components/StatsDashboard";
import { SearchFilters } from "./components/SearchFilters";
import { PaperView } from "./components/PaperView";
import { BookmarksView } from "./components/BookmarksView";
import { StatsView } from "./components/StatsView";
import { ResourcesView } from "./components/ResourcesView";
import { SettingsView } from "./components/SettingsView";
import { 
  CheckCircle, RefreshCw, Layers, Award, Sparkles, BookOpen, 
  HelpCircle, Printer, Maximize2, Minimize2, Search, Settings
} from "lucide-react";

export default function App() {
  const {
    itemStates,
    settings,
    stats,
    updateItem,
    updateSettings,
    resetProgress,
    markPaperComplete,
    exportJSON,
    exportCSV,
    exportMarkdown,
    importJSON
  } = useTrackerState();

  // Navigation and search states
  const [currentSection, setCurrentSection] = useState("home");
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Accordion trigger counters
  const [expandAllTrigger, setExpandAllTrigger] = useState(0);
  const [collapseAllTrigger, setCollapseAllTrigger] = useState(0);

  // Search input ref to handle Ctrl+F focusing
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync theme with HTML document element
  useEffect(() => {
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.theme]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + D -> Toggle Dark Mode
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        updateSettings({ theme: settings.theme === "dark" ? "light" : "dark" });
      }

      // Ctrl + F -> Focus search if on a paper view
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        const isPaperView = ALL_PAPERS.some(p => p.id === currentSection);
        if (isPaperView) {
          e.preventDefault();
          // Find input via selector or react ref (we will also bind standard inputs)
          const searchInput = document.querySelector('input[placeholder*="Search across topics"]') as HTMLInputElement;
          searchInput?.focus();
        }
      }

      // Ctrl + E -> Expand All
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "e") {
        e.preventDefault();
        setExpandAllTrigger(prev => prev + 1);
      }

      // Ctrl + Shift + R -> Reset Progress (prompts confirmation)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "r") {
        e.preventDefault();
        const conf = window.confirm("Are you sure you want to RESET all syllabus progress? This cannot be undone.");
        if (conf) {
          resetProgress();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [settings.theme, currentSection, resetProgress]);

  // Handle direct navigation to papers from Dashboard cards
  const handleNavigateToPaper = (paperId: string) => {
    setCurrentSection(paperId);
    updateSettings({ lastOpenedSection: paperId });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Find active paper if currentSection is a paper ID
  const activePaper = ALL_PAPERS.find(p => p.id === currentSection);

  // Print function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#09090B] text-slate-800 dark:text-[#E4E4E7] flex flex-col md:flex-row transition-colors duration-200">
      
      {/* Persistent Navigation Sidebar */}
      <Sidebar 
        currentSection={currentSection}
        onSectionChange={(sec) => {
          setCurrentSection(sec);
          if (ALL_PAPERS.some(p => p.id === sec)) {
            updateSettings({ lastOpenedSection: sec });
          }
        }}
        settings={settings}
        paperStats={stats.paperCounts}
      />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full min-h-screen print:ml-0 print:p-0">
        
        {/* Print-Only Page Header Branding */}
        <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-slate-900">UPSC Civil Services Mains Examination Tracker</h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Overall Progress: {stats.overallPercentage}% Done ({stats.completedItems}/{stats.totalItems} Topics Checked)
          </p>
        </div>

        {/* Global Toolbar Header (Quick Actions) */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#27272A] pb-4 print:hidden mt-10 md:mt-0">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-blue-600 dark:text-blue-500 shrink-0" />
            <div>
              <h1 className="font-extrabold text-xl md:text-2xl text-slate-800 dark:text-slate-100 tracking-tight">
                {currentSection === "home" && "UPSC Mains Syllabus Tracker"}
                {currentSection === "bookmarks" && "Bookmarked Topics"}
                {currentSection === "stats" && "Deep-Dive Statistics"}
                {currentSection === "resources" && "Recommended Reference Books"}
                {currentSection === "settings" && "System Settings"}
                {activePaper && activePaper.title}
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-mono font-medium mt-0.5">
                {currentSection === "home" && "Structured Civil Services Study Dashboard"}
                {currentSection === "bookmarks" && "Flagged and High-Yield Micro-Topics"}
                {currentSection === "stats" && "Paper-by-Paper Progress Analytics"}
                {currentSection === "resources" && "Standard NCERTs, Handbooks & Reports"}
                {currentSection === "settings" && "Personalize settings and offline backup controls"}
                {activePaper && `Micro-topic syllabus checkpoints for study targeting`}
              </p>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Quick Actions for active papers */}
            {activePaper && (
              <>
                <button
                  onClick={() => setExpandAllTrigger(prev => prev + 1)}
                  className="bg-white dark:bg-[#121214] text-slate-700 dark:text-slate-300 text-xs px-3 py-1.5 rounded-lg font-bold border border-slate-200 dark:border-[#27272A] hover:bg-slate-50 dark:hover:bg-[#1C1C1F] transition flex items-center gap-1.5"
                  title="Expand all accordion folders"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Expand All</span>
                </button>
                <button
                  onClick={() => setCollapseAllTrigger(prev => prev + 1)}
                  className="bg-white dark:bg-[#121214] text-slate-700 dark:text-slate-300 text-xs px-3 py-1.5 rounded-lg font-bold border border-slate-200 dark:border-[#27272A] hover:bg-slate-50 dark:hover:bg-[#1C1C1F] transition flex items-center gap-1.5"
                  title="Collapse all accordion folders"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Collapse All</span>
                </button>
                <button
                  onClick={() => markPaperComplete(activePaper.id, true)}
                  className="bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 text-xs px-3 py-1.5 rounded-lg font-extrabold border border-blue-200 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition flex items-center gap-1.5"
                  title="Mark all topics in this paper as complete"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Mark All Done</span>
                </button>
              </>
            )}

            {/* Global Actions */}
            <button
              onClick={handlePrint}
              className="bg-white dark:bg-[#121214] text-slate-700 dark:text-slate-300 text-xs px-3 py-1.5 rounded-lg font-bold border border-slate-200 dark:border-[#27272A] hover:bg-slate-50 dark:hover:bg-[#1C1C1F] transition flex items-center gap-1.5"
              title="Print current sheet"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Sheet</span>
            </button>
          </div>
        </header>

        {/* View Router switcher */}
        <div className="space-y-6">
          
          {currentSection === "home" && (
            <>
              {/* Daily Quote Banner */}
              <QuoteBox />
              
              {/* Core Analytics Hub */}
              <StatsDashboard 
                settings={settings}
                stats={stats}
                onNavigateToPaper={handleNavigateToPaper}
              />
            </>
          )}

          {currentSection === "bookmarks" && (
            <BookmarksView 
              itemStates={itemStates}
              onUpdateItem={updateItem}
            />
          )}

          {currentSection === "stats" && (
            <StatsView 
              settings={settings}
              stats={stats}
            />
          )}

          {currentSection === "resources" && (
            <ResourcesView />
          )}

          {currentSection === "settings" && (
            <SettingsView 
              settings={settings}
              onUpdateSettings={updateSettings}
              onResetProgress={resetProgress}
              onExportJSON={exportJSON}
              onExportCSV={exportCSV}
              onExportMarkdown={exportMarkdown}
              onImportJSON={importJSON}
            />
          )}

          {/* Active Syllabus Checklist View */}
          {activePaper && (
            <>
              {/* Search and Filters Hub */}
              <SearchFilters 
                searchText={searchText}
                onSearchChange={setSearchText}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                totalVisible={stats.paperCounts[activePaper.id]?.total || 0}
              />

              {/* Collapsible Syllabus Trees */}
              <PaperView 
                paper={activePaper}
                itemStates={itemStates}
                onUpdateItem={updateItem}
                searchText={searchText}
                activeFilter={activeFilter}
                onMarkPaperComplete={markPaperComplete}
                expandAllTrigger={expandAllTrigger}
                collapseAllTrigger={collapseAllTrigger}
              />
            </>
          )}

        </div>

        {/* Keyboard Shortcut Guidelines in Footer */}
        <footer className="pt-12 pb-4 text-center text-[10px] font-mono text-slate-400 dark:text-slate-500 font-bold select-none border-t border-slate-200/50 dark:border-slate-800/50 print:hidden space-y-1">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span>⌨️ Keyboard Shortcuts:</span>
            <span><kbd className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">Ctrl+F</kbd> Search</span>
            <span><kbd className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">Ctrl+D</kbd> Theme</span>
            <span><kbd className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">Ctrl+E</kbd> Expand All</span>
            <span><kbd className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">Ctrl+Shift+R</kbd> Reset</span>
          </div>
          <div>
            Built with extreme dedication for UPSC CSE Aspirants. Everything runs locally in your browser offline.
          </div>
        </footer>

      </main>

    </div>
  );
}
