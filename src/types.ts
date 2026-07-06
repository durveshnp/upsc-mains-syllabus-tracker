export type PriorityType = "High" | "Medium" | "Low";
export type DifficultyType = "Easy" | "Medium" | "Hard";

export interface SyllabusItem {
  id: string;
  text: string;
  importance?: PriorityType;
  difficulty?: DifficultyType;
}

export interface SyllabusTopic {
  id: string;
  name: string;
  items: SyllabusItem[];
}

export interface SyllabusSubject {
  id: string;
  name: string;
  topics: SyllabusTopic[];
}

export interface SyllabusPaper {
  id: string;
  title: string;
  subtitle: string;
  subjects: SyllabusSubject[];
}

export interface UserItemState {
  id: string;
  completed: boolean;
  note: string; // Max 200 characters
  revisionLevel: number; // 0 to 5
  importance: PriorityType; // Custom override or default
  difficulty: DifficultyType; // Custom override or default
  bookmarked: boolean;
  lastUpdatedDate: string;
}

export interface UserSettings {
  theme: "light" | "dark";
  lastOpenedSection: string; // Paper ID
  customOptionalSubjectName: string;
  dailyStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
}

export interface Quote {
  text: string;
  author: string;
}
