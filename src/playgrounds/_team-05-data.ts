export const meeting = {
  title: "Q4 Launch Sync",
  when: "Tue 29 Sep · 10:00",
  duration: "45 min",
  attendees: "6 attendees",
  readTime: "~1 min read",
  eyebrow: "What changed for you, Sam",
  summary:
    "The team agreed to launch on 12 November with the tiered pricing model (Option B). Marketing will lead the announcement, and design owns the launch assets. One task, the supplier review, was raised but nobody picked it up.",
};

export const durationSeconds = 45 * 60;

export type Evidence = { who: string; time: string; text: string };

export type MeetingItem = {
  id: string;
  type: "action" | "decision";
  group: "you" | "fyi";
  title: string;
  owner: string | null;
  ownerName?: string;
  due?: string;
  by?: string;
  time: string;
  quote: string;
  unclear?: string;
  why?: "option-b" | "november";
};

export const items: MeetingItem[] = [
  {
    id: "a1",
    type: "action",
    group: "you",
    title: "Build the Q4 launch deck",
    owner: "SP",
    ownerName: "Sam Patel",
    due: "Fri 2 Oct",
    time: "12:34",
    quote: "Priya: Sam's already got the brand files, so let's give the deck to Sam. Friday works.",
  },
  {
    id: "d1",
    type: "decision",
    group: "you",
    title: "Pricing goes with Option B (tiered)",
    owner: null,
    by: "Priya & Marcus",
    time: "21:10",
    quote: "Marcus: Option B tested better with SMB customers. Let's lock it in.",
    why: "option-b",
  },
  {
    id: "a2",
    type: "action",
    group: "fyi",
    title: "Supplier review for packaging",
    owner: null,
    due: "Not set",
    time: "28:45",
    unclear: "No owner or deadline agreed",
    quote: "Leo: Someone should really look into the supplier review before we commit.",
  },
  {
    id: "d2",
    type: "decision",
    group: "fyi",
    title: "Launch date set for 12 November",
    owner: null,
    by: "Whole team",
    time: "33:02",
    quote: "Priya: So we're agreed, 12 November it is.",
    why: "november",
  },
  {
    id: "a3",
    type: "action",
    group: "fyi",
    title: "Draft the press announcement",
    owner: "JM",
    ownerName: "Jess Moore",
    due: "Wed 7 Oct",
    time: "39:20",
    quote: "Jess: I'll take the announcement and share a draft by next Wednesday.",
  },
];

export const followUpMessage =
  "Hi Priya, quick check on the supplier review Leo raised in yesterday's Q4 sync. Who's taking it, and by when? Happy to help if it's useful. Thanks, Sam";

export const answers = [
  {
    q: "Did anyone disagree?",
    a: "Yes, twice. Leo pushed back on keeping the old roadmap slides in the deck, and Marcus and Jess briefly disagreed on pricing before the team settled on Option B.",
    ev: [
      { who: "Leo", time: "14:02", text: "I'd drop the old roadmap slides. They'll just raise questions." },
      { who: "Jess", time: "19:48", text: "I'm not sure tiers won't confuse smaller customers." },
    ],
  },
  {
    q: "Why Option B?",
    a: "Test results showed Option B converted better with small business customers, and it leaves room for an enterprise tier later.",
    ev: [
      { who: "Marcus", time: "20:31", text: "Option B converted about 18% better with SMB customers in the test." },
      { who: "Priya", time: "21:10", text: "And it gives us room for an enterprise tier. Let's lock it in." },
    ],
  },
  {
    q: "What do I do first?",
    a: "Start with an outline of the launch deck. Priya wants to review the story on Wednesday before you design it, and the final deck is due Friday.",
    ev: [
      { who: "Priya", time: "12:34", text: "Sam's got the brand files, so let's give the deck to Sam. Friday works." },
      { who: "Priya", time: "12:50", text: "Can Sam share an outline by Wednesday so I can check the story?" },
    ],
  },
  {
    q: "Why 12 November?",
    a: "It avoids the Black Friday rush and gives marketing four weeks after the deck is finished.",
    ev: [
      { who: "Jess", time: "32:15", text: "If we go after mid-November we're competing with Black Friday noise." },
      { who: "Priya", time: "33:02", text: "So we're agreed, 12 November it is." },
    ],
  },
] as const;

const unresolved = {
  a: "One thing was left open: the supplier review. Leo raised it, but nobody took it on and no deadline was set. You can draft a follow-up from the FYI list.",
  ev: [{ who: "Leo", time: "28:45", text: "Someone should really look into the supplier review before we commit." }],
};

export const fallbackAnswer =
  "I couldn't find that in this meeting. Try asking about the launch deck, pricing, the launch date, disagreements, or what's still unresolved.";

export type MatchedAnswer = {
  q: string;
  a: string;
  ev: readonly Evidence[];
  jump: string | null;
};

export function matchQuestion(raw: string): MatchedAnswer {
  const s = raw.toLowerCase();
  if (/disagree|argu|push ?back|conflict/.test(s)) return { ...answers[0], jump: null };
  if (/option b|pric|tier/.test(s)) {
    return { ...answers[1], jump: /skip|jump|part/.test(s) ? "21:10" : null };
  }
  if (/first|should i|my task|what do i|deck/.test(s)) return { ...answers[2], jump: null };
  if (/date|november|when.*launch|launch.*when/.test(s)) return { ...answers[3], jump: null };
  if (/unresolv|open|outstanding|supplier|left/.test(s)) return { q: "", a: unresolved.a, ev: unresolved.ev, jump: null };
  return { q: "", a: fallbackAnswer, ev: [], jump: null };
}

export function splitQuote(item: MeetingItem): Evidence {
  const splitAt = item.quote.indexOf(": ");
  return { who: item.quote.slice(0, splitAt), text: item.quote.slice(splitAt + 2), time: item.time };
}

export function seconds(time: string) {
  const [minutes, rest] = time.split(":").map(Number);
  return minutes * 60 + rest;
}

export type Person = { initials: string; name: string; approved: boolean };

export const people: Person[] = [
  { initials: "PS", name: "Priya Shah", approved: true },
  { initials: "MO", name: "Marcus Obi", approved: true },
  { initials: "JM", name: "Jess Moore", approved: true },
  { initials: "LW", name: "Leo Walsh", approved: true },
  { initials: "AK", name: "Aisha Khan", approved: true },
  { initials: "SP", name: "Sam Patel (you)", approved: false },
];

export const files = [
  { ext: "PPTX", name: "Q4 launch sync deck", size: "4.2 MB" },
  { ext: "PDF", name: "Pricing test results (Option A vs B)", size: "1.1 MB" },
  { ext: "TXT", name: "Full meeting transcript", size: "86 KB" },
];

export const waveBars = [4, 7, 11, 6, 14, 9, 16, 12, 8, 15, 10, 6, 13, 17, 9, 5, 12, 15, 8, 11, 14, 7, 10, 16, 9, 6, 12, 8, 5, 10];

export function quoteAt(time: string): Evidence | undefined {
  for (const answer of answers) {
    const found = answer.ev.find((entry) => entry.time === time);
    if (found) return found;
  }
  const item = items.find((entry) => entry.time === time);
  return item ? splitQuote(item) : undefined;
}
