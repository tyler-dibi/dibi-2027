export const meeting = {
  title: "Q4 Launch Sync",
  date: "Tue 29 Sep 2026",
  durationSeconds: 45 * 60,
  hero: "You now own the Q4 launch deck, due Friday",
  summary:
    "The team chose Option B for pricing: a £19 starter plan with onboarding included, and they left the enterprise rate unchanged. Your deck has to show that price by Friday, and the supplier review still has no owner.",
};

export type Tone = "sam" | "other" | "unclear";
export type Column = "you" | "fyi";

export type MeetingItem = {
  id: string;
  kind: "action" | "decision";
  column: Column;
  time: string;
  seconds: number;
  summary: string;
  tone: Tone;
  task?: string;
  owner?: string;
  due?: string;
  statement?: string;
};

export const items: MeetingItem[] = [
  {
    id: "deck",
    kind: "action",
    column: "you",
    time: "4:40",
    seconds: 280,
    tone: "sam",
    task: "Own the Q4 launch deck",
    owner: "Sam Patel",
    due: "Fri 2 Oct",
    summary: "Priya asks you to own the Q4 launch deck, due Friday.",
  },
  {
    id: "enterprise",
    kind: "decision",
    column: "fyi",
    time: "11:30",
    seconds: 690,
    tone: "other",
    statement: "The enterprise rate stays the same.",
    summary: "Riley says finance can support the new price if the enterprise rate stays put.",
  },
  {
    id: "option-b",
    kind: "decision",
    column: "you",
    time: "14:05",
    seconds: 845,
    tone: "other",
    statement: "The team chose Option B: £19 starter, with onboarding included.",
    summary: "With no objections, the team chooses Option B for pricing.",
  },
  {
    id: "pricing-page",
    kind: "action",
    column: "fyi",
    time: "16:20",
    seconds: 980,
    tone: "other",
    task: "Update the pricing page copy",
    owner: "Alex Chen",
    due: "Wed 30 Sep",
    summary: "Alex will update the pricing page copy by Wednesday.",
  },
  {
    id: "supplier",
    kind: "action",
    column: "fyi",
    time: "24:30",
    seconds: 1470,
    tone: "unclear",
    task: "Look into the supplier review",
    summary: "Priya says someone should look into the supplier review, but nobody takes it.",
  },
];

export const followUpMessage =
  "Hi Priya, quick check: who's taking the supplier review, and by when?";

export const questions = [
  {
    id: "disagree",
    label: "Did anyone disagree with me?",
    time: "14:05",
    answer:
      "No one disagreed with you. Priya asked if anyone objected to Option B at 14:05, and the room stayed quiet.",
  },
  {
    id: "option-b",
    label: "Why Option B?",
    time: "14:05",
    answer:
      "Jordan suggested a £19 starter price with onboarding included. Riley confirmed the margin still works if the enterprise rate stays the same, so the team picked Option B.",
  },
  {
    id: "first",
    label: "What do I do first?",
    time: "4:40",
    answer:
      "Finish the Q4 launch deck first. Priya gave it to you at 4:40 and it is due on Friday.",
  },
] as const;
