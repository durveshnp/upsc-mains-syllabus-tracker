import { useState, useEffect, useMemo } from "react";
import { ALL_PAPERS } from "../data/syllabusLoader";
import { UserItemState, UserSettings, PriorityType, DifficultyType } from "../types";

const LOCAL_STORAGE_KEY_STATE = "upsc_tracker_state";
const LOCAL_STORAGE_KEY_SETTINGS = "upsc_tracker_settings";

export function useTrackerState() {
  // Initialize state map
  const [itemStates, setItemStates] = useState<Record<string, UserItemState>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_STATE);
      const parsed = saved ? JSON.parse(saved) : {};
      
      // Seed missing items with defaults
      const states: Record<string, UserItemState> = { ...parsed };
      for (const paper of ALL_PAPERS) {
        for (const subject of paper.subjects) {
          for (const topic of subject.topics) {
            for (const item of topic.items) {
              if (!states[item.id]) {
                states[item.id] = {
                  id: item.id,
                  completed: false,
                  note: "",
                  revisionLevel: 0,
                  importance: item.importance || "Medium",
                  difficulty: item.difficulty || "Medium",
                  bookmarked: false,
                  lastUpdatedDate: ""
                };
              } else {
                // Ensure defaults are solid if fields are missing in saved
                if (states[item.id].importance === undefined) states[item.id].importance = item.importance || "Medium";
                if (states[item.id].difficulty === undefined) states[item.id].difficulty = item.difficulty || "Medium";
                if (states[item.id].note === undefined) states[item.id].note = "";
                if (states[item.id].revisionLevel === undefined) states[item.id].revisionLevel = 0;
                if (states[item.id].bookmarked === undefined) states[item.id].bookmarked = false;
              }
            }
          }
        }
      }
      return states;
    } catch (e) {
      console.error("Error reading LocalStorage state", e);
      return {};
    }
  });

  // Settings state
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
      const todayStr = new Date().toISOString().split("T")[0];
      
      if (saved) {
        const parsed: UserSettings = JSON.parse(saved);
        // Manage streak
        let streak = parsed.dailyStreak || 0;
        let lastDate = parsed.lastActiveDate || "";
        
        if (lastDate && lastDate !== todayStr) {
          const lastDateObj = new Date(lastDate);
          const todayObj = new Date(todayStr);
          const diffTime = Math.abs(todayObj.getTime() - lastDateObj.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            // Consecutive day
            streak += 1;
          } else if (diffDays > 1) {
            // Broke streak
            streak = 1;
          }
        } else if (!lastDate) {
          streak = 1;
        }

        return {
          ...parsed,
          dailyStreak: streak,
          lastActiveDate: todayStr
        };
      } else {
        return {
          theme: "dark",
          lastOpenedSection: "essay",
          customOptionalSubjectName: "Sociology",
          dailyStreak: 1,
          lastActiveDate: todayStr
        };
      }
    } catch (e) {
      console.error("Error loading settings", e);
      return {
        theme: "dark",
        lastOpenedSection: "essay",
        customOptionalSubjectName: "Sociology",
        dailyStreak: 1,
        lastActiveDate: new Date().toISOString().split("T")[0]
      };
    }
  });

  // Save states
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_STATE, JSON.stringify(itemStates));
  }, [itemStates]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Update a single item
  const updateItem = (id: string, updates: Partial<Omit<UserItemState, "id">>) => {
    setItemStates((prev) => {
      const current = prev[id] || {
        id,
        completed: false,
        note: "",
        revisionLevel: 0,
        importance: "Medium",
        difficulty: "Medium",
        bookmarked: false,
        lastUpdatedDate: ""
      };
      return {
        ...prev,
        [id]: {
          ...current,
          ...updates,
          lastUpdatedDate: new Date().toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric"
          })
        }
      };
    });
  };

  // Helper to update settings
  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  // Global calculations
  const stats = useMemo(() => {
    let totalItems = 0;
    let completedItems = 0;
    let totalRevisions = 0;
    let totalBookmarks = 0;
    let totalNotes = 0;
    let revisionPending = 0;

    const paperCounts: Record<string, { total: number; completed: number }> = {};
    const subjectCounts: Record<string, { total: number; completed: number }> = {};

    for (const paper of ALL_PAPERS) {
      paperCounts[paper.id] = { total: 0, completed: 0 };
      
      for (const subject of paper.subjects) {
        subjectCounts[subject.id] = { total: 0, completed: 0 };
        
        for (const topic of subject.topics) {
          for (const item of topic.items) {
            totalItems++;
            const uState = itemStates[item.id];
            const isCompleted = uState?.completed || false;
            
            if (isCompleted) {
              completedItems++;
            }
            if (uState?.revisionLevel > 0) {
              totalRevisions += uState.revisionLevel;
            } else if (isCompleted) {
              // Completed but 0 revisions
              revisionPending++;
            }
            if (uState?.bookmarked) {
              totalBookmarks++;
            }
            if (uState?.note && uState.note.trim().length > 0) {
              totalNotes++;
            }

            // Paper specific
            paperCounts[paper.id].total++;
            if (isCompleted) paperCounts[paper.id].completed++;

            // Subject specific
            subjectCounts[subject.id].total++;
            if (isCompleted) subjectCounts[subject.id].completed++;
          }
        }
      }
    }

    return {
      totalItems,
      completedItems,
      remainingItems: totalItems - completedItems,
      overallPercentage: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0,
      totalRevisions,
      totalBookmarks,
      totalNotes,
      revisionPending,
      paperCounts,
      subjectCounts
    };
  }, [itemStates]);

  // Reset progress
  const resetProgress = () => {
    const freshStates: Record<string, UserItemState> = {};
    for (const paper of ALL_PAPERS) {
      for (const subject of paper.subjects) {
        for (const topic of subject.topics) {
          for (const item of topic.items) {
            freshStates[item.id] = {
              id: item.id,
              completed: false,
              note: "",
              revisionLevel: 0,
              importance: item.importance || "Medium",
              difficulty: item.difficulty || "Medium",
              bookmarked: false,
              lastUpdatedDate: ""
            };
          }
        }
      }
    }
    setItemStates(freshStates);
  };

  // Mark all completed in current visible paper or category
  const markPaperComplete = (paperId: string, completed = true) => {
    setItemStates((prev) => {
      const next = { ...prev };
      const paper = ALL_PAPERS.find((p) => p.id === paperId);
      if (!paper) return prev;

      for (const subject of paper.subjects) {
        for (const topic of subject.topics) {
          for (const item of topic.items) {
            if (next[item.id]) {
              next[item.id] = {
                ...next[item.id],
                completed,
                lastUpdatedDate: new Date().toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })
              };
            }
          }
        }
      }
      return next;
    });
  };

  // Export progress as JSON
  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ itemStates, settings }));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `upsc_mains_progress_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export progress as CSV
  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Syllabus Item ID,Syllabus Text,Completed,Note,Revision Count,Importance,Difficulty,Bookmarked,Last Updated\n";

    for (const paper of ALL_PAPERS) {
      for (const subject of paper.subjects) {
        for (const topic of subject.topics) {
          for (const item of topic.items) {
            const uState = itemStates[item.id];
            const completed = uState?.completed ? "YES" : "NO";
            const noteClean = (uState?.note || "").replace(/"/g, '""');
            const revisions = uState?.revisionLevel || 0;
            const importance = uState?.importance || item.importance || "Medium";
            const difficulty = uState?.difficulty || item.difficulty || "Medium";
            const bookmarked = uState?.bookmarked ? "YES" : "NO";
            const lastUpdated = uState?.lastUpdatedDate || "N/A";
            
            const lineText = `"${item.id}","${item.text.replace(/"/g, '""')}",${completed},"${noteClean}",${revisions},"${importance}","${difficulty}",${bookmarked},"${lastUpdated}"`;
            csvContent += lineText + "\n";
          }
        }
      }
    }

    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", encodeURI(csvContent));
    downloadAnchor.setAttribute("download", `upsc_mains_checklist_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export progress as Markdown Checklist
  const exportMarkdown = () => {
    let markdown = `# UPSC Civil Services Mains Examination - Syllabus Progress Checklist\n\n`;
    markdown += `Generated on: ${new Date().toLocaleDateString("en-IN")} | Overall Completion: **${stats.overallPercentage}%** (${stats.completedItems}/${stats.totalItems} items completed)\n\n`;

    for (const paper of ALL_PAPERS) {
      const pPercent = stats.paperCounts[paper.id] 
        ? Math.round((stats.paperCounts[paper.id].completed / stats.paperCounts[paper.id].total) * 100) 
        : 0;
      markdown += `## ${paper.title} (${pPercent}% Complete)\n`;
      markdown += `> ${paper.subtitle}\n\n`;

      for (const subject of paper.subjects) {
        markdown += `### ${subject.name}\n\n`;
        
        for (const topic of subject.topics) {
          markdown += `#### ${topic.name}\n\n`;
          
          for (const item of topic.items) {
            const uState = itemStates[item.id];
            const checkbox = uState?.completed ? "[x]" : "[ ]";
            const bookmarkMark = uState?.bookmarked ? " ⭐" : "";
            const revisionMark = uState?.revisionLevel > 0 ? ` (Revised x${uState.revisionLevel})` : "";
            const impMark = ` [Priority: ${uState?.importance || item.importance || "Medium"}]`;
            
            markdown += `- ${checkbox} ${item.text}${bookmarkMark}${revisionMark}${impMark}\n`;
            if (uState?.note) {
              markdown += `  - *Note:* ${uState.note}\n`;
            }
          }
          markdown += `\n`;
        }
      }
      markdown += `---\n\n`;
    }

    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(markdown);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `upsc_mains_syllabus_checklist_${new Date().toISOString().split("T")[0]}.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import progress from JSON
  const importJSON = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          if (parsed && typeof parsed === "object") {
            if (parsed.itemStates) {
              setItemStates(parsed.itemStates);
            }
            if (parsed.settings) {
              setSettings((prev) => ({
                ...prev,
                ...parsed.settings,
                // keep current theme / streak or override depending on imported values
                lastActiveDate: new Date().toISOString().split("T")[0]
              }));
            }
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (error) {
          console.error("Error parsing imported file", error);
          resolve(false);
        }
      };
      reader.onerror = () => resolve(false);
      reader.readAsText(file);
    });
  };

  return {
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
  };
}
export type TrackerState = ReturnType<typeof useTrackerState>;
