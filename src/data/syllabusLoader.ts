import { SyllabusPaper } from "../types";
import essay from "./essay.json";
import gs1 from "./gs1.json";
import gs2 from "./gs2.json";
import gs3 from "./gs3.json";
import gs4 from "./gs4.json";
import languages from "./languages.json";
import interview from "./interview.json";

export const ALL_PAPERS: SyllabusPaper[] = [
  essay as SyllabusPaper,
  gs1 as SyllabusPaper,
  gs2 as SyllabusPaper,
  gs3 as SyllabusPaper,
  gs4 as SyllabusPaper,
  languages as SyllabusPaper,
  interview as SyllabusPaper
];

export const ALL_ITEMS_MAP = (() => {
  const map = new Map<string, { paperId: string; subjectId: string; topicId: string }>();
  for (const paper of ALL_PAPERS) {
    for (const subject of paper.subjects) {
      for (const topic of subject.topics) {
        for (const item of topic.items) {
          map.set(item.id, {
            paperId: paper.id,
            subjectId: subject.id,
            topicId: topic.id
          });
        }
      }
    }
  }
  return map;
})();
