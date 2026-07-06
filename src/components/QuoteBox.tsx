import { useMemo } from "react";
import { MOTIVATIONAL_QUOTES } from "../data/quotes";
import { Sparkles } from "lucide-react";

export function QuoteBox() {
  const dailyQuote = useMemo(() => {
    // Choose a quote stably based on the day of the year
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const quoteIndex = dayOfYear % MOTIVATIONAL_QUOTES.length;
    return MOTIVATIONAL_QUOTES[quoteIndex];
  }, []);

  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-[#121214] border border-slate-200 dark:border-[#27272A] rounded-xl p-5 md:p-6 mb-6">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex gap-4 items-start relative z-10">
        <div className="bg-blue-100 dark:bg-blue-950/40 p-2.5 rounded-lg text-blue-600 dark:text-blue-400 shrink-0">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h4 className="text-xs font-bold font-mono tracking-widest text-slate-400 dark:text-[#71717A] uppercase mb-1">
            DAILY INSPIRATION
          </h4>
          <blockquote className="text-sm font-medium text-slate-700 dark:text-slate-200 italic mb-2 leading-relaxed">
            "{dailyQuote.text}"
          </blockquote>
          <cite className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 not-italic">
            — {dailyQuote.author}
          </cite>
        </div>
      </div>
    </div>
  );
}
export default QuoteBox;
