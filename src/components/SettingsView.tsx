import { useState, useRef, ChangeEvent } from "react";
import { UserSettings } from "../types";
import { 
  Settings, User, Moon, Sun, Download, Upload, AlertTriangle, 
  RefreshCw, CheckCircle, Sparkles
} from "lucide-react";

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (updates: Partial<UserSettings>) => void;
  onResetProgress: () => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
  onExportMarkdown: () => void;
  onImportJSON: (file: File) => Promise<boolean>;
}

export function SettingsView({
  settings,
  onUpdateSettings,
  onResetProgress,
  onExportJSON,
  onExportCSV,
  onExportMarkdown,
  onImportJSON
}: SettingsViewProps) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus("idle");
    const success = await onImportJSON(file);
    if (success) {
      setImportStatus("success");
      setTimeout(() => setImportStatus("idle"), 4000);
    } else {
      setImportStatus("error");
    }
  };

  const triggerImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    onResetProgress();
    setConfirmReset(false);
  };

  return (
    <div className="space-y-6 max-w-3xl font-sans">
      
      {/* Title */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 md:p-6">
        <div className="flex gap-4 items-start">
          <div className="bg-emerald-100 dark:bg-emerald-950 p-2.5 rounded-lg text-emerald-600 dark:text-emerald-400 shrink-0">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-base text-slate-800 dark:text-slate-100">
              System Settings & Data Control
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed max-w-xl">
              Configure your visual experience and manage backups. All data remains completely private inside your browser.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Themes */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sun className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
            UI Appearance Preference
          </h4>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={() => onUpdateSettings({ theme: "light" })}
            className={`
              flex-1 py-4 border rounded-xl flex flex-col items-center justify-center gap-2 transition
              ${settings.theme === "light" 
                ? "bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-400" 
                : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }
            `}
          >
            <Sun className="w-6 h-6" />
            <span className="text-xs font-bold font-sans">Light Mode</span>
          </button>

          <button
            onClick={() => onUpdateSettings({ theme: "dark" })}
            className={`
              flex-1 py-4 border rounded-xl flex flex-col items-center justify-center gap-2 transition
              ${settings.theme === "dark" 
                ? "bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-400" 
                : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }
            `}
          >
            <Moon className="w-6 h-6" />
            <span className="text-xs font-bold font-sans">Dark Mode</span>
          </button>
        </div>
      </div>

      {/* Data Backup */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
            Backup, Import & Export Studies
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
          
          {/* Left panel: Exports */}
          <div className="space-y-4 pb-6 md:pb-0">
            <h5 className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Export Progress Checklist
            </h5>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={onExportJSON}
                className="w-full flex items-center justify-between px-4 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition"
              >
                <span>Backup State (.JSON)</span>
                <Download className="w-3.5 h-3.5 text-slate-400" />
              </button>
              
              <button
                onClick={onExportCSV}
                className="w-full flex items-center justify-between px-4 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition"
              >
                <span>Spreadsheet Table (.CSV)</span>
                <Download className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={onExportMarkdown}
                className="w-full flex items-center justify-between px-4 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition"
              >
                <span>Markdown Document (.MD)</span>
                <Download className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Right panel: Import */}
          <div className="space-y-4 pt-6 md:pt-0 md:pl-6 flex flex-col justify-between">
            <div>
              <h5 className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Import Backup File
              </h5>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Upload your previously exported `.json` progress file to restore checklist completion, revisions, and notes.
              </p>
            </div>

            <div className="pt-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportFileChange}
                accept=".json"
                className="hidden"
              />
              <button
                onClick={triggerImportClick}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-950 hover:bg-slate-200/60 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 border-dashed rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition"
              >
                <Upload className="w-4 h-4 text-emerald-500" />
                <span>Select & Upload backup.json</span>
              </button>
              
              {/* Import notifications */}
              {importStatus === "success" && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-2.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>State restored successfully! All checklists updated.</span>
                </div>
              )}
              {importStatus === "error" && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-semibold mt-2.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Error parsing file. Ensure it is a valid backup.json file.</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50/20 dark:bg-red-950/5 border border-red-200/60 dark:border-red-950/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
          <h4 className="font-bold text-sm text-red-700 dark:text-red-400">
            Danger Zone
          </h4>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Reset All Study Progress
            </h5>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 max-w-md leading-relaxed">
              This completely clears your local checklist completions, notes, and revisions. There is no undo unless you have a backup JSON file.
            </p>
          </div>

          <div className="shrink-0">
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="bg-red-600 text-white text-xs px-4 py-2.5 rounded-lg font-bold hover:bg-red-700 transition"
              >
                Reset Progress...
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="bg-red-600 text-white text-xs px-3 py-2 rounded-lg font-bold hover:bg-red-700 transition"
                >
                  Yes, Clear All
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-350 text-xs px-3 py-2 rounded-lg font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
export default SettingsView;
