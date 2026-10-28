export const heroHighlights = [
  "Built around the 9–1 grading scale",
  "Topic-by-topic revision",
  "Track progress to your target grade",
] as const;

export type Subject = {
  name: string;
  description: string;
};

export const subjects: Subject[] = [
  { name: "Maths", description: "Number, algebra, geometry and statistics." },
  { name: "English Language", description: "Reading, writing and exam technique." },
  { name: "English Literature", description: "Texts, themes and essay structure." },
  { name: "Biology", description: "Cells, organisms and ecosystems." },
  { name: "Chemistry", description: "Atoms, bonding and reactions." },
  { name: "Physics", description: "Forces, energy and waves." },
  { name: "History", description: "Sources, causes and consequences." },
  { name: "Geography", description: "Physical and human geography." },
];

export type FeatureKey = "revise" | "practise" | "progress" | "plan";

export type Feature = {
  key: FeatureKey;
  title: string;
  description: string;
  /** Spans two columns on large screens for a bento-style layout. */
  wide?: boolean;
};

export const features: Feature[] = [
  {
    key: "revise",
    title: "Revise by topic",
    description:
      "Clear, bite-sized revision organised the way your course is. Pick a topic, learn it, move on.",
    wide: true,
  },
  {
    key: "practise",
    title: "Practise exam-style questions",
    description: "Test yourself and get feedback while it still matters.",
  },
  {
    key: "progress",
    title: "See your progress",
    description: "Know your strong topics and the ones that need more time.",
  },
  {
    key: "plan",
    title: "Plan your revision",
    description:
      "Break the run-up to your exams into manageable weeks, so you can stay calm and consistent.",
    wide: true,
  },
];
