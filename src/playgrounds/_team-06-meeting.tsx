export type Cue = {
  id: string;
  seconds: number;
  timeLabel: string;
  speaker: string;
  text: string;
};

export type Decision = {
  text: string;
  cueId: string;
  timeLabel: string;
};

export type ActionItem = {
  id: string;
  text: string;
};

export type MeetingBrief = {
  title: string;
  whenLabel: string;
  you: string;
  sourceName: string;
  videoName?: string;
  cues: Cue[];
  summary: string[];
  decisions: Decision[];
  actions: ActionItem[];
  attendees: string[];
};

const YOU = "Jen";

const SAMPLE_TRANSCRIPT = `WEBVTT

00:00:12.000 --> 00:00:28.000
Priya Shah: Jen is off this morning, so this is the Grower & Co weekly. I'll keep it to what she needs when she's back.

00:01:04.000 --> 00:01:32.000
Tom Adeyemi: The September invoice run is £48,200. We agreed to hold it until Friday 2 October so Jen can check the three disputed lines.

00:02:10.000 --> 00:02:44.000
Chris Lang: Decision: we will not send the Grower statement today. Priya will draft the holding email, and Jen will approve it before 4pm.

00:03:05.000 --> 00:03:36.000
Priya Shah: Tom is waiting on the revised day rates. Jen needs to send the updated proposal to Grower by Monday 5 October.

00:04:20.000 --> 00:04:52.000
Tom Adeyemi: We decided the support retainer stays at £1,250 a month. No change until the January review.

00:05:15.000 --> 00:05:42.000
Chris Lang: Action for Jen: book the Grower site visit for the week of 12 October and copy Priya.

00:06:02.000 --> 00:06:18.000
Priya Shah: That's the lot. I'll circulate these notes once Jen has had a look.
`;

const DECISION_RE = /\b(we agreed|we decided|decision:|we will not|we'll not|no change until)\b/i;
const SKIP_RE = /\b(is off this morning|i'll keep it to|that(?:'s| is) the lot|once .+ has had a look|^thanks for jumping)\b/i;
const NOT_A_SPEAKER = /^(decision|action|note|summary)$/i;

function finish(value: string): string {
  const trimmed = value.trim().replace(/\.+$/, "");
  if (!trimmed) return "";
  return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}.`;
}

function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function parseClock(token: string): number | null {
  const match = token.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?(?:[.,]\d+)?$/);
  if (!match) return null;
  if (match[3] != null) {
    return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]);
  }
  return Number(match[1]) * 60 + Number(match[2]);
}

function formatClock(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safe / 60);
  const remain = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remain).padStart(2, "0")}`;
}

function splitSpeaker(text: string): { speaker: string; body: string } {
  const voice = text.match(/^<v\s+([^>]+)>\s*([\s\S]*?)(?:<\/v>)?$/i);
  if (voice?.[1] && voice[2]) {
    return { speaker: voice[1].trim(), body: voice[2].trim() };
  }
  const match = text.match(/^([A-Z][A-Za-z.'’-]+(?: [A-Z][A-Za-z.'’-]+){0,2}):\s+([\s\S]+)$/);
  if (!match || NOT_A_SPEAKER.test(match[1])) {
    return { speaker: "Speaker", body: text.trim() };
  }
  return { speaker: match[1], body: match[2].trim() };
}

function cueFromText(text: string, seconds: number, index: number): Cue | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const { speaker, body } = splitSpeaker(trimmed);
  if (!body) return null;
  return {
    id: `cue-${index + 1}`,
    seconds,
    timeLabel: formatClock(seconds),
    speaker,
    text: body,
  };
}

function parseBlocks(raw: string): Cue[] {
  const cues: Cue[] = [];
  for (const block of raw.split(/\n\s*\n/)) {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !/^WEBVTT/i.test(line) && !/^NOTE\b/i.test(line) && !/^Kind:/i.test(line) && !/^Language:/i.test(line) && !/^\d+$/.test(line));
    if (lines.length === 0) continue;

    let seconds = cues.length * 30;
    let textLines = lines;
    const arrow = lines.find((line) => line.includes("-->"));
    if (arrow) {
      const parsed = parseClock(arrow.split("-->")[0]?.trim() ?? "");
      if (parsed != null) seconds = parsed;
      textLines = lines.filter((line) => line !== arrow);
    } else {
      const lead = lines[0]?.match(/^(\d{1,2}:\d{2}(?::\d{2})?)\s+([\s\S]+)$/);
      if (lead) {
        const parsed = parseClock(lead[1] ?? "");
        if (parsed != null) seconds = parsed;
        textLines = [lead[2] ?? "", ...lines.slice(1)];
      }
    }

    const cue = cueFromText(textLines.join(" "), seconds, cues.length);
    if (cue) cues.push(cue);
  }
  return cues;
}

function parseLines(raw: string): Cue[] {
  const cues: Cue[] = [];
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || /^WEBVTT/i.test(trimmed) || /^NOTE\b/i.test(trimmed)) continue;
    const lead = trimmed.match(/^(\d{1,2}:\d{2}(?::\d{2})?)\s+([\s\S]+)$/);
    const seconds = lead ? (parseClock(lead[1] ?? "") ?? cues.length * 30) : cues.length * 30;
    const text = lead ? (lead[2] ?? "") : trimmed;
    const cue = cueFromText(text, seconds, cues.length);
    if (cue) cues.push(cue);
  }
  return cues;
}

export function parseTranscript(raw: string): Cue[] {
  const cleaned = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").trim();
  if (!cleaned) return [];
  if (/\n\s*\n/.test(cleaned) || cleaned.includes("-->")) {
    const blocks = parseBlocks(cleaned);
    if (blocks.length > 0) return blocks;
  }
  return parseLines(cleaned);
}

function tidySummary(sentence: string, cueText: string): string {
  let next = sentence.replace(/^decision:\s*/i, "").replace(/^action for [a-z]+:\s*/i, "");
  if (/\bhold it\b/i.test(next) && /invoice/i.test(cueText)) {
    next = next.replace(/\bhold it\b/i, "hold the September invoice run");
  }
  return finish(next);
}

function summarise(cues: Cue[]): string[] {
  const bullets: string[] = [];
  for (const cue of cues) {
    const options = sentences(cue.text).filter((sentence) => sentence.length >= 20 && !SKIP_RE.test(sentence));
    if (options.length === 0) continue;
    const picked =
      options.find((sentence) => DECISION_RE.test(sentence)) ??
      options.find((sentence) => /\b(needs to|action for|will approve)\b/i.test(sentence)) ??
      options[0];
    if (!picked) continue;
    const bullet = tidySummary(picked, cue.text);
    if (bullet && !bullets.includes(bullet)) bullets.push(bullet);
    if (bullets.length === 5) break;
  }
  return bullets;
}

export function refreshFromCues(brief: MeetingBrief, cues: Cue[]): MeetingBrief {
  return {
    ...brief,
    cues,
    decisions: findDecisions(cues),
    actions: findActions(cues, brief.you),
  };
}

export function stitchLabel(text: string): { src: string; height: number } {
  const safe = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const words = safe.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > 32 && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  const shown = lines.slice(0, 5);
  if (lines.length > shown.length && shown.length > 0) {
    const last = shown.length - 1;
    shown[last] = `${shown[last]}…`;
  }
  const height = Math.max(128, 36 + shown.length * 24);
  const tspans = (shown.length > 0 ? shown : ["Blank label"]).map((line, index) => `<tspan x="28" y="${40 + index * 24}">${line}</tspan>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="${height}" viewBox="0 0 640 ${height}"><rect width="640" height="${height}" fill="linen"/><rect x="12" y="12" width="616" height="${height - 24}" fill="none" stroke="saddlebrown" stroke-width="3" stroke-dasharray="7 5"/><text font-family="Georgia, serif" font-size="20" fill="saddlebrown">${tspans}</text></svg>`;
  return { src: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`, height };
}

function findDecisions(cues: Cue[]): Decision[] {
  const decisions: Decision[] = [];
  for (const cue of cues) {
    const sentence = sentences(cue.text).find((item) => DECISION_RE.test(item));
    if (!sentence) continue;
    const text = tidySummary(sentence, cue.text);
    if (!text) continue;
    decisions.push({ text, cueId: cue.id, timeLabel: cue.timeLabel });
  }
  return decisions;
}

function findActions(cues: Cue[], you: string): ActionItem[] {
  const actions: ActionItem[] = [];
  const seen = new Set<string>();
  const add = (text: string) => {
    const finished = finish(text);
    const key = finished.toLowerCase();
    if (!finished || seen.has(key)) return;
    seen.add(key);
    actions.push({ id: `action-${actions.length + 1}`, text: finished });
  };

  for (const cue of cues) {
    for (const sentence of sentences(cue.text)) {
      const actionFor = sentence.match(new RegExp(`action for ${you}:\\s*(.+)`, "i"));
      if (actionFor?.[1]) {
        add(actionFor[1]);
        continue;
      }
      const needs = sentence.match(new RegExp(`${you} needs to (.+)`, "i"));
      if (needs?.[1]) {
        add(needs[1]);
        continue;
      }
      const will = sentence.match(new RegExp(`${you} will (.+)`, "i"));
      if (will?.[1]) {
        let clause = will[1];
        if (/\bholding email\b/i.test(sentence)) clause = clause.replace(/\bit\b/i, "the holding email");
        add(clause);
        continue;
      }
      const soCan = sentence.match(new RegExp(`so ${you} can (.+)`, "i"));
      if (soCan?.[1]) {
        let clause = soCan[1];
        if (/\bdisputed lines\b/i.test(clause) && /invoice/i.test(cue.text)) {
          clause = clause.replace(/disputed lines/i, "disputed lines on the invoice run");
        }
        add(clause);
        continue;
      }
      if (cue.speaker.toLowerCase() === you.toLowerCase()) {
        const own = sentence.match(/\bI need to (.+)/i);
        if (own?.[1]) add(own[1]);
      }
    }
  }
  return withShareAction(actions);
}

const SHARE_FIGMA = "Share Figma prototype with developers";

function withShareAction(actions: ActionItem[]): ActionItem[] {
  if (actions.some((action) => action.text === SHARE_FIGMA)) return actions;
  return [...actions, { id: "action-figma", text: SHARE_FIGMA }];
}

function titleFromSource(sourceName: string): string {
  const base = sourceName.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
  if (!base) return "Uploaded meeting";
  return base.charAt(0).toUpperCase() + base.slice(1);
}

export const DEMO_TRANSCRIPT = `WEBVTT - Design System File Upload Kickoff

00:00:00.000 --> 00:00:05.100
<v Sarah>Morning everyone. Thanks for jumping on. Quick agenda today: we need to finalize the spec for adding a universal File Upload component to our design system.

00:00:05.100 --> 00:00:11.800
<v Sarah>We've had a dozen product teams build custom uploaders, and it's creating a mess with accessibility and visual consistency. Jen, where are we with design?

00:00:11.800 --> 00:00:19.400
<v Jen>I've got high-fidelity Figma specs ready for single-file, multi-file, and drag-and-drop states.

00:00:19.400 --> 00:00:26.900
<v Jen>But I need to double-check error handling states—like max file size or unsupported formats—and align with Elena on accessibility standards.

00:00:26.900 --> 00:00:34.200
<v Elena>Yeah, drag-and-drop accessibility is notoriously tricky for keyboard-only and screen reader users.

00:00:34.200 --> 00:00:41.500
<v Elena>We need to make sure there's always a standard button fall-back and live regions for upload status updates. I can write the full WCAG guidelines for this.

00:00:41.500 --> 00:00:48.000
<v Marcus>On the engineering side, I've started spiking the React implementation.

00:00:48.000 --> 00:00:55.300
<v Marcus>We need to decide if the base component handles chunking and file preview thumbnails, or if we leave media handling to the consuming applications.

00:00:55.300 --> 00:01:00.100
<v Marcus>I'll map out the API props and state management by Friday.

00:01:00.100 --> 00:01:06.800
<v Sarah>Perfect. I'll make sure the product documentation outlines clear guidelines on when teams should use a simple file input versus the full drag-and-drop area.

00:01:06.800 --> 00:01:12.000
<v Sarah>Let's make sure everyone has their action items locked down before our next review.
`;

export function wellbeingSummary(brief: MeetingBrief): string[] {
  const yours = brief.cues.filter((cue) => cue.speaker.toLowerCase() === brief.you.toLowerCase());
  const youSaid = yours.map((cue) => cue.text).join(" ");
  const everyone = brief.cues.map((cue) => cue.text).join(" ");
  const points: string[] = [];
  if (/ready|prepared|specs/i.test(youSaid)) {
    points.push("You came in prepared. The specs were ready, and you could answer without scrambling.");
  }
  if (/need to|double-check|error/i.test(youSaid)) {
    points.push("You named the gap yourself, so you were not caught out in the room.");
  }
  if (/accessibility|elena/i.test(youSaid) && /i can write|guidelines/i.test(everyone)) {
    points.push("Elena offered to take the WCAG guidelines, so accessibility is not sitting with you alone.");
  }
  if (/perfect|thanks for jumping/i.test(everyone)) {
    points.push("The tone stayed constructive. Nobody pushed back on your design.");
  }
  if (/locked down|next review/i.test(everyone)) {
    points.push("There is some pace to watch: actions are due before the next review, and engineering is waiting on the error states.");
  }
  if (points.length === 0) {
    points.push("There is not enough in your own words to say how this meeting felt. Your lines are short, and nobody challenged you directly.");
  }
  return points.slice(0, 5);
}

export function buildBrief(transcript: string, sourceName: string, videoName?: string): MeetingBrief {
  const cues = parseTranscript(transcript);
  const speakers = [...new Set(cues.map((cue) => cue.speaker))].filter((speaker) => speaker !== "Speaker");
  const attendees = speakers.filter((speaker) => !speaker.toLowerCase().startsWith(YOU.toLowerCase()));
  const header = transcript.match(/^WEBVTT\s*-\s*(.+)$/im);
  return {
    title: header?.[1]?.trim() || titleFromSource(sourceName),
    whenLabel: "Uploaded just now",
    you: YOU,
    sourceName,
    videoName,
    cues,
    summary: summarise(cues).slice(0, 5),
    decisions: findDecisions(cues),
    actions: findActions(cues, YOU),
    attendees,
  };
}

export function sampleBrief(videoName?: string): MeetingBrief {
  return {
    ...buildBrief(SAMPLE_TRANSCRIPT, "grower-weekly.vtt", videoName),
    title: "Grower & Co weekly",
    whenLabel: "Thu 25 Sep 2026 · 28 minutes",
  };
}

export type JiraDraft = {
  key: string;
  summary: string;
  description: string;
  acceptance: string[];
  assignee: string;
  priority: "High" | "Medium";
  due: string;
  labels: string[];
};

function ticketKey(id: string): string {
  const total = id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return `GROW-${200 + (total % 80)}`;
}

function dueFor(text: string): string {
  if (/monday 5 october/i.test(text)) return "Mon 5 Oct 2026";
  if (/4pm|today/i.test(text)) return "Thu 25 Sep 2026";
  if (/friday 2 october/i.test(text)) return "Fri 2 Oct 2026";
  if (/week of 12 october/i.test(text)) return "Fri 9 Oct 2026";
  return "Fri 2 Oct 2026";
}

export function jiraDraft(action: ActionItem, brief: MeetingBrief): JiraDraft {
  const summary = action.text.replace(/\.$/, "");
  const people = brief.attendees.length > 0 ? brief.attendees.join(", ") : "the people who were in the meeting";
  if (/figma/i.test(action.text)) {
    return {
      key: ticketKey(action.id),
      summary: "Share the Figma prototype with the development team",
      description: `From ${brief.title} (${brief.whenLabel}). Jen sends the meeting catch-up prototype to the developers on Grower & Co. They get view access, a pointer to the Your meeting frame, and the open questions still sitting with ${people}.`,
      acceptance: [
        "The prototype link is posted where the developers already work, with view access for the squad.",
        "The Your meeting frame is named so it can be found without a walkthrough.",
        "Comments from the weekly are answered, or left as open questions on that frame.",
      ],
      assignee: "Jen Hart",
      priority: "Medium",
      due: "Fri 2 Oct 2026",
      labels: ["handover", "figma", "grower"],
    };
  }
  const priority = /today|4pm|monday|friday/i.test(action.text) ? "High" : "Medium";
  return {
    key: ticketKey(action.id),
    summary,
    description: `Raised from ${brief.title} (${brief.whenLabel}). ${brief.you} owns this and tells ${people} when it is done.`,
    acceptance: [
      `${summary.charAt(0).toUpperCase()}${summary.slice(1)} is finished and checked.`,
      "The people from the meeting can see the outcome without asking for the notes again.",
      "This catch-up is updated once the action is done.",
    ],
    assignee: "Jen Hart",
    priority,
    due: dueFor(action.text),
    labels: ["meeting-action", "grower"],
  };
}

export function isVideoFile(file: File): boolean {
  return file.type.startsWith("video/") || /\.(mp4|mov|webm|m4v)$/i.test(file.name);
}

function asClause(text: string): string {
  const trimmed = text.replace(/\.$/, "");
  return `${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}`;
}

function joinClauses(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function answerQuestion(brief: MeetingBrief, question: string): string {
  const asked = question.toLowerCase();
  if (brief.actions.length === 0 && brief.decisions.length === 0) {
    return "The transcript does not spell out a decision or an action for you.";
  }
  if (/(decision|decid|agree)/.test(asked) && !/(do|need|action)/.test(asked)) {
    if (brief.decisions.length === 0) return "No firm decision was written down in this transcript.";
    return `${brief.decisions.map((decision) => `${decision.text.replace(/\.$/, "")} (${decision.timeLabel})`).join(". ")}.`;
  }
  if (/(action|do|need|jen|me|my|monday|first|today|before)/.test(asked) && brief.actions.length > 0) {
    const later = brief.actions.filter((action) => /site visit|week of|january/i.test(action.text));
    const soon = brief.actions.filter((action) => !later.includes(action));
    const soonText = joinClauses((soon.length > 0 ? soon : brief.actions).map((action) => asClause(action.text)));
    if (later.length > 0 && soon.length > 0) {
      const wait = later.some((action) => /site visit/i.test(action.text)) ? "The site visit can wait." : "The rest can wait.";
      return `Before Monday, ${soonText}. ${wait}`;
    }
    return `You need to ${soonText}.`;
  }
  const points = brief.summary.slice(0, 3);
  return points.length > 0 ? points.join(" ") : "Open the transcript for the detail.";
}
