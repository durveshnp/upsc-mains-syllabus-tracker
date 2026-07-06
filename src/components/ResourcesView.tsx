import resources from "../data/resources.json";
import { Book, Bookmark, Compass } from "lucide-react";

export function ResourcesView() {
  return (
    <div className="space-y-6 font-sans">
      
      {/* Welcome Banner */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 md:p-6">
        <div className="flex gap-4 items-start">
          <div className="bg-emerald-100 dark:bg-emerald-950 p-2.5 rounded-lg text-emerald-600 dark:text-emerald-400 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-base text-slate-800 dark:text-slate-100">
              Standard Books & Reference Resources
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed max-w-2xl">
              Reference lists containing foundational NCERT books, standard textbooks, administrative commission reports (e.g. 2nd ARC), and monthly current affairs strategies for each of the core Papers.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((paperRes) => (
          <div 
            key={paperRes.id} 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
          >
            {/* Paper Header */}
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex items-center gap-2">
              <Book className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                {paperRes.paper} Resources
              </h4>
            </div>

            {/* List of Material Categories */}
            <div className="p-5 space-y-4">
              {paperRes.materials.map((mat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <h5 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
                    {mat.category}
                  </h5>
                  <ul className="space-y-1 pl-4 list-disc text-xs text-slate-700 dark:text-slate-350 leading-relaxed marker:text-emerald-500">
                    {mat.resources.map((resName, rIdx) => (
                      <li key={rIdx}>{resName}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
export default ResourcesView;
