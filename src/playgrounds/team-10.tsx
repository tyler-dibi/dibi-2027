import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import Box from "carbon-react/lib/components/box";
import Button from "carbon-react/lib/components/button/__next__";
import { ButtonToggle, ButtonToggleGroup } from "carbon-react/lib/components/button-toggle";
import Divider from "carbon-react/lib/components/divider";
import {
  FlatTable,
  FlatTableBody,
  FlatTableCell,
  FlatTableHead,
  FlatTableHeader,
  FlatTableRow,
  FlatTableRowHeader,
} from "carbon-react/lib/components/flat-table";
import Icon from "carbon-react/lib/components/icon";
import Loader from "carbon-react/lib/components/loader/__next__";
import Message from "carbon-react/lib/components/message";
import Pill from "carbon-react/lib/components/pill";
import Pagination from "carbon-react/lib/components/pager";
import Portrait from "carbon-react/lib/components/portrait";
import ProgressTracker from "carbon-react/lib/components/progress-tracker";
import Search from "carbon-react/lib/components/search";
import { Tile } from "carbon-react/lib/components/tile";
import Typography from "carbon-react/lib/components/typography";

export const meta = {
  title: "Door check-in",
};

type Ticket = "Full conference" | "Speaker" | "Workshop day" | "Exhibitor" | "Thursday workshop";

type Attendee = {
  id: string;
  name: string;
  initials: string;
  company: string;
  ticket: Ticket;
  order: string;
  checkedIn: boolean;
  checkedInAt?: string;
  door?: string;
  balance?: string;
  wrongDay?: boolean;
  hint?: string;
};

type Recent = { id: string; name: string; time: string; note: string; session?: boolean };
type Held = { id?: string; name: string; where: string; time: string };
type Notice = { variant: "info" | "success" | "warning"; title: string; body: string };

type Phase =
  | { name: "ready" }
  | { name: "reading"; event: string }
  | { name: "success"; id: string; time: string; flag?: string }
  | { name: "problem"; kind: "duplicate" | "unpaid" | "unknown" | "wrong-day"; id?: string }
  | { name: "lookup"; prompt: string };

const DOOR = "Door A";
const OPEN_MINUTE = 8 * 60;
const START_MINUTE = 9 * 60 + 15;
const KEYNOTE_MINUTE = 10 * 60 + 30;
const SUCCESS_HOLD_SECONDS = 8;
const LIST_SAVED_AT = "07:45";
const STORAGE_KEY = "team-10-door-a-v2";

type DoorSnapshot = {
  attendees: Attendee[];
  count: number;
  minute: number;
  recent: Recent[];
  held: Held[];
  queueIndex: number;
  pending: number;
};

const TICKET_VARIANT = {
  "Full conference": "blue",
  Speaker: "purple",
  "Workshop day": "teal",
  Exhibitor: "slate",
  "Thursday workshop": "orange",
} as const;

const NAMED: Attendee[] = [
  { id: "priya", name: "Priya Shah", initials: "PS", company: "Northwind Digital", ticket: "Full conference", order: "SS-10482", checkedIn: false },
  { id: "elena", name: "Elena Rossi", initials: "ER", company: "Rossi & Co", ticket: "Speaker", order: "SS-10014", checkedIn: false, hint: "Speaker. The green room is behind Hall 1." },
  { id: "james", name: "James Okonkwo", initials: "JO", company: "Harbour & Co", ticket: "Full conference", order: "SS-10220", checkedIn: true, checkedInAt: "08:12", door: "Door B" },
  { id: "hannah", name: "Hannah Cole", initials: "HC", company: "Bright Ledger", ticket: "Full conference", order: "SS-10601", checkedIn: false },
  { id: "amira", name: "Amira Khan", initials: "AK", company: "Khan Ceramics", ticket: "Workshop day", order: "SS-10844", checkedIn: false, balance: "£85" },
  { id: "tom", name: "Tom Adeyemi", initials: "TA", company: "Adeyemi Studio", ticket: "Full conference", order: "SS-10330", checkedIn: false },
  { id: "noah", name: "Noah Blake", initials: "NB", company: "Blake Freight", ticket: "Thursday workshop", order: "SS-10910", checkedIn: false, wrongDay: true },
  { id: "leila", name: "Leila Rahman", initials: "LR", company: "Field & Fern", ticket: "Exhibitor", order: "SS-10102", checkedIn: false, hint: "Exhibitor. Stand B12 is in Hall 2." },
  { id: "owen", name: "Owen Price", initials: "OP", company: "Price Legal", ticket: "Full conference", order: "SS-10555", checkedIn: false },
  { id: "grace", name: "Grace Adewale", initials: "GA", company: "Adewale Health", ticket: "Full conference", order: "SS-10771", checkedIn: false },
  { id: "ben", name: "Ben Carter", initials: "BC", company: "Carter Mills", ticket: "Full conference", order: "SS-10208", checkedIn: true, checkedInAt: "08:40", door: DOOR },
  { id: "sofia", name: "Sofia Mensah", initials: "SM", company: "Mensah Health", ticket: "Full conference", order: "SS-10440", checkedIn: true, checkedInAt: "09:11", door: DOOR },
  { id: "ravi", name: "Ravi Patel", initials: "RP", company: "Patel Analytics", ticket: "Speaker", order: "SS-10088", checkedIn: true, checkedInAt: "08:04", door: DOOR },
  { id: "meera", name: "Meera Doyle", initials: "MD", company: "Doyle Studio", ticket: "Workshop day", order: "SS-10690", checkedIn: false },
];

const QUEUE = ["priya", "elena", "james", "hannah", "amira", "unknown", "noah", "tom", "leila", "owen"];

const INITIAL_RECENT: Recent[] = [
  { id: "sofia", name: "Sofia Mensah", time: "09:11", note: "Full conference" },
  { id: "ben", name: "Ben Carter", time: "08:40", note: "Full conference" },
  { id: "ravi", name: "Ravi Patel", time: "08:04", note: "Speaker" },
];

function freshSnapshot(): DoorSnapshot {
  return {
    attendees: ATTENDEES.map((person) => ({ ...person })),
    count: START_COUNT,
    minute: START_MINUTE,
    recent: INITIAL_RECENT.map((item) => ({ ...item })),
    held: [],
    queueIndex: 0,
    pending: START_COUNT,
  };
}

function isSnapshot(value: unknown): value is DoorSnapshot {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as DoorSnapshot;
  return (
    Array.isArray(snapshot.attendees) &&
    Array.isArray(snapshot.recent) &&
    Array.isArray(snapshot.held) &&
    typeof snapshot.count === "number" &&
    typeof snapshot.minute === "number" &&
    typeof snapshot.queueIndex === "number" &&
    typeof snapshot.pending === "number"
  );
}

function loadSnapshot(): DoorSnapshot {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshSnapshot();
    const parsed: unknown = JSON.parse(raw);
    return isSnapshot(parsed) ? parsed : freshSnapshot();
  } catch {
    return freshSnapshot();
  }
}

function formatTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

const FIRST_NAMES = [
  "Amelia", "Arthur", "Aisha", "Benjamin", "Chloe", "Daniel", "Emily", "Farah", "George", "Harriet",
  "Ibrahim", "Isla", "Jack", "Jasmin", "Leo", "Maya", "Nathan", "Olivia", "Patrick", "Quinn",
  "Rosa", "Samuel", "Tara", "Usman", "Violet", "William", "Yasmin", "Zara", "Alice", "Callum",
  "Deepa", "Edward", "Freya", "Hugo", "Imogen", "Jacob", "Keira", "Louis", "Nadia", "Oscar",
];

const LAST_NAMES = [
  "Hughes", "Wright", "Thompson", "Evans", "Walker", "Green", "Hall", "Clarke", "Morris", "Wood",
  "Bell", "Murphy", "Bailey", "Cooper", "Richardson", "Cox", "Ward", "Foster", "Russell", "Griffin",
  "Hayes", "Bryant", "Shaw", "Armstrong", "Hunt", "Stone", "Fox", "Palmer", "Webb", "Bennett",
];

const COMPANIES = [
  "Northgate Studio", "Harbour Books", "Fieldwork Ltd", "Brightpath", "Oak & Co", "Lumen Health",
  "Pemberley Design", "Redkite Analytics", "Willow Goods", "Kindred Labs", "Marble Row", "Sable Finance",
];

const CROWD_TICKETS: Ticket[] = ["Full conference", "Full conference", "Full conference", "Workshop day", "Exhibitor"];

function buildExpected(named: Attendee[]): Attendee[] {
  const taken = new Set(named.map((person) => person.name));
  const namedIn = named.filter((person) => person.checkedIn).length;
  const extrasIn = 186 - namedIn;
  const extras: Attendee[] = [];
  let seed = 0;

  while (extras.length < 300 - named.length) {
    const first = FIRST_NAMES[seed % FIRST_NAMES.length];
    const last = LAST_NAMES[Math.floor(seed / FIRST_NAMES.length) % LAST_NAMES.length];
    seed += 1;
    const name = `${first} ${last}`;
    if (taken.has(name)) continue;
    taken.add(name);
    const arrived = extras.length < extrasIn;
    const index = extras.length + 1;
    extras.push({
      id: `guest-${String(index).padStart(3, "0")}`,
      name,
      initials: `${first.charAt(0)}${last.charAt(0)}`,
      company: COMPANIES[index % COMPANIES.length],
      ticket: CROWD_TICKETS[index % CROWD_TICKETS.length],
      order: `SS-${11000 + index}`,
      checkedIn: arrived,
      checkedInAt: arrived ? formatTime(OPEN_MINUTE + (index % 70)) : undefined,
      door: arrived ? (index % 7 === 0 ? "Door B" : DOOR) : undefined,
    });
  }

  return [...named, ...extras].sort((a, b) => a.name.localeCompare(b.name, "en-GB"));
}

const ATTENDEES = buildExpected(NAMED);
const START_COUNT = ATTENDEES.filter((person) => person.checkedIn).length;
const TARGET = ATTENDEES.length;

type ListFilter = "all" | "in" | "waiting" | "decision";

function listStatus(person: Attendee): { label: string; detail: string; variant: "green" | "red" | "orange" | "grey" } {
  if (person.checkedIn) {
    const when = person.checkedInAt ? `at ${person.checkedInAt}` : "today";
    const where = person.door ?? DOOR;
    const flag = person.balance ? ` ${person.balance} is still due.` : person.wrongDay ? " Thursday pass, let in today." : "";
    return { label: "Checked in", detail: `Checked in ${when}, ${where}.${flag}`, variant: "green" };
  }
  if (person.balance) return { label: "Payment due", detail: `${person.balance} still to pay. Not checked in.`, variant: "red" };
  if (person.wrongDay) return { label: "Not valid today", detail: "Thursday workshop pass. Not checked in.", variant: "orange" };
  return { label: "Not arrived", detail: "Expected today. Not checked in.", variant: "grey" };
}

function matchesListFilter(person: Attendee, filter: ListFilter) {
  const waiting = !person.checkedIn && !person.balance && !person.wrongDay;
  const decision = !person.checkedIn && (Boolean(person.balance) || Boolean(person.wrongDay));
  if (filter === "in") return person.checkedIn;
  if (filter === "waiting") return waiting;
  if (filter === "decision") return decision;
  return true;
}

function needsReview(person: Attendee) {
  return person.checkedIn || Boolean(person.balance) || Boolean(person.wrongDay);
}

function statusOf(person: Attendee): { label: string; variant: "green" | "red" | "orange" | "blue" } {
  if (person.checkedIn) return { label: "Already in", variant: "green" };
  if (person.balance) return { label: `${person.balance} due`, variant: "red" };
  if (person.wrongDay) return { label: "Not today", variant: "orange" };
  return { label: "Ready", variant: "blue" };
}

function PersonLine({ person }: { person: Attendee }) {
  return (
    <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
      <Portrait initials={person.initials} size="L" alt="" />
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h1" m={0}>
          {person.name}
        </Typography>
        <Typography variant="p" size="L" color="subtle" m={0}>
          {person.company}
        </Typography>
        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
          <Pill variant={TICKET_VARIANT[person.ticket]} fill>
            {person.ticket}
          </Pill>
          <Typography m={0}>{person.order}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

function Finder({
  people,
  query,
  onQuery,
  onPick,
}: {
  people: Attendee[];
  query: string;
  onQuery: (value: string) => void;
  onPick: (id: string) => void;
}) {
  const term = query.trim().toLowerCase();
  const matches =
    term.length < 2
      ? []
      : people.filter(
          (person) =>
            person.name.toLowerCase().includes(term) ||
            person.company.toLowerCase().includes(term) ||
            person.order.toLowerCase().includes(term),
        );
  const visible = matches.slice(0, 4);

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Search
        id="find-attendee"
        label="Find by name or order"
        inputHint="Surname, company or order number"
        aria-label="Find by name or order"
        value={query}
        onChange={(event) => onQuery(event.target.value)}
      />
      {term.length >= 2 && matches.length === 0 && (
        <Message variant="warning" title="No one on the saved list">
          Try another spelling, or send them to registration. The search is on this iPad.
        </Message>
      )}
      {visible.map((person) => {
        const status = statusOf(person);
        const action = needsReview(person) ? "Review" : "Check in";
        return (
          <Tile key={person.id} orientation="vertical" variant="grey" p={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} flexWrap="wrap">
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="h5" m={0}>
                  {person.name}
                </Typography>
                <Typography m={0} color="subtle">
                  {person.company} · {person.order}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} flexShrink={0}>
                <Pill variant={status.variant} fill>
                  {status.label}
                </Pill>
                <Button
                  size="medium"
                  variantType="primary"
                  aria-label={`${action} ${person.name}`}
                  onClick={() => onPick(person.id)}
                >
                  {action}
                </Button>
              </Box>
            </Box>
          </Tile>
        );
      })}
      {matches.length > visible.length && (
        <Typography m={0} color="subtle">
          {matches.length - visible.length} more. Keep typing to narrow it down.
        </Typography>
      )}
    </Box>
  );
}

export default function Team10Playground() {
  const [stored] = useState(loadSnapshot);
  const [attendees, setAttendees] = useState(stored.attendees);
  const [count, setCount] = useState(stored.count);
  const [minute, setMinute] = useState(stored.minute);
  const [recent, setRecent] = useState(stored.recent);
  const [held, setHeld] = useState(stored.held);
  const [queueIndex, setQueueIndex] = useState(stored.queueIndex);
  const [pending, setPending] = useState(stored.pending);
  const [query, setQuery] = useState("");
  const [listQuery, setListQuery] = useState("");
  const [listFilter, setListFilter] = useState<ListFilter>("all");
  const [listPage, setListPage] = useState(1);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [printed, setPrinted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(SUCCESS_HOLD_SECONDS);
  const [phase, setPhase] = useState<Phase>({ name: "ready" });

  const attendeesRef = useRef(attendees);
  const minuteRef = useRef(minute);

  useEffect(() => {
    attendeesRef.current = attendees;
  }, [attendees]);

  useEffect(() => {
    minuteRef.current = minute;
  }, [minute]);

  const takeTime = useCallback(() => {
    const time = formatTime(minuteRef.current);
    const next = minuteRef.current + 1;
    minuteRef.current = next;
    setMinute(next);
    return time;
  }, []);

  const checkIn = useCallback(
    (id: string, flag?: string) => {
      const person = attendeesRef.current.find((item) => item.id === id);
      if (!person || person.checkedIn) return;
      const time = takeTime();
      const next = attendeesRef.current.map((item) =>
        item.id === id ? { ...item, checkedIn: true, checkedInAt: time, door: DOOR } : item,
      );
      attendeesRef.current = next;
      setAttendees(next);
      setCount((value) => value + 1);
      setPending((value) => value + 1);
      setRecent((items) => [{ id, name: person.name, time, note: person.ticket, session: true }, ...items].slice(0, 5));
      setQuery("");
      setNotice(null);
      setSecondsLeft(SUCCESS_HOLD_SECONDS);
      setPhase({ name: "success", id, time, flag });
    },
    [takeTime],
  );

  const openPerson = useCallback(
    (id: string) => {
      const person = attendeesRef.current.find((item) => item.id === id);
      if (!person) return;
      setQuery("");
      setNotice(null);
      if (person.checkedIn) {
        setPhase({ name: "problem", kind: "duplicate", id });
        return;
      }
      if (person.balance) {
        setPhase({ name: "problem", kind: "unpaid", id });
        return;
      }
      if (person.wrongDay) {
        setPhase({ name: "problem", kind: "wrong-day", id });
        return;
      }
      checkIn(id);
    },
    [checkIn],
  );

  useEffect(() => {
    if (phase.name !== "reading") return;
    const event = phase.event;
    const timer = window.setTimeout(() => {
      if (event === "unknown") {
        setNotice(null);
        setPhase({ name: "problem", kind: "unknown" });
        return;
      }
      openPerson(event);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [phase, openPerson]);

  useEffect(() => {
    if (phase.name !== "success") return;
    const started = Date.now();
    const timer = window.setInterval(() => {
      const left = SUCCESS_HOLD_SECONDS - Math.floor((Date.now() - started) / 1000);
      if (left <= 0) {
        setSecondsLeft(0);
        setPhase({ name: "ready" });
        return;
      }
      setSecondsLeft(left);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    setPrinted(false);
  }, [phase]);

  useEffect(() => {
    const snapshot: DoorSnapshot = { attendees, count, minute, recent, held, queueIndex, pending };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      // This session still runs if the iPad cannot store any more.
    }
  }, [attendees, count, minute, recent, held, queueIndex, pending]);

  const remaining = Math.max(0, TARGET - count);
  const minutesToKeynote = Math.max(0, KEYNOTE_MINUTE - minute);
  const elapsed = Math.max(1, minute - OPEN_MINUTE);
  const expected = Math.round((TARGET * Math.min(elapsed, KEYNOTE_MINUTE - OPEN_MINUTE)) / (KEYNOTE_MINUTE - OPEN_MINUTE));
  const ahead = count >= expected;
  const queueLeft = QUEUE.length - queueIndex;
  const finderInStage = phase.name === "lookup" || (phase.name === "problem" && phase.kind === "unknown");

  const startScan = () => {
    if (phase.name === "reading") return;
    const event = QUEUE[queueIndex];
    if (!event) return;
    setQueueIndex((index) => index + 1);
    setNotice(null);
    setPhase({ name: "reading", event });
  };

  const backToScanner = () => setPhase({ name: "ready" });

  const sendAway = (where: "cash desk" | "registration", person?: Attendee) => {
    const time = takeTime();
    setHeld((items) => [{ id: person?.id, name: person?.name ?? "Unrecognised badge", where, time }, ...items]);
    setPending((value) => value + 1);
    setQuery("");
    setPhase({ name: "ready" });
    setNotice({
      variant: "info",
      title: person ? `${person.name} sent to ${where}` : `Sent to ${where}`,
      body: "Their name is saved on this iPad. Walk them to the desk, then scan the next badge.",
    });
  };

  const waveThrough = (person: Attendee) => {
    setPhase({ name: "ready" });
    setNotice({
      variant: "success",
      title: `${person.name} waved through`,
      body: "They were already checked in, so the count stays the same. Scan the next badge.",
    });
  };

  const undo = (id: string, time: string) => {
    const person = attendeesRef.current.find((item) => item.id === id);
    if (!person?.checkedIn) return;
    const next = attendeesRef.current.map((item) =>
      item.id === id ? { ...item, checkedIn: false, checkedInAt: undefined, door: undefined } : item,
    );
    attendeesRef.current = next;
    setAttendees(next);
    setCount((value) => Math.max(0, value - 1));
    setPending((value) => Math.max(0, value - 1));
    setRecent((items) => items.filter((item) => !(item.id === id && item.time === time)));
    setPhase({ name: "ready" });
    setNotice({
      variant: "warning",
      title: `Check-in cancelled for ${person.name}`,
      body: "Removed from this iPad. Scan them again when they're at the door.",
    });
  };

  const replay = () => {
    const fresh = ATTENDEES.map((person) => ({ ...person }));
    attendeesRef.current = fresh;
    minuteRef.current = START_MINUTE;
    setAttendees(fresh);
    setMinute(START_MINUTE);
    setCount(START_COUNT);
    setRecent(INITIAL_RECENT.map((item) => ({ ...item })));
    setHeld([]);
    setQueueIndex(0);
    setPending(START_COUNT);
    setQuery("");
    setListQuery("");
    setListFilter("all");
    setListPage(1);
    setNotice(null);
    setPrinted(false);
    setSecondsLeft(SUCCESS_HOLD_SECONDS);
    setPhase({ name: "ready" });
  };

  const arrivedCount = attendees.filter((person) => person.checkedIn).length;
  const decisionCount = attendees.filter((person) => !person.checkedIn && (person.balance || person.wrongDay)).length;
  const waitingCount = attendees.length - arrivedCount - decisionCount;
  const listSummary = `${attendees.length} people expected today. ${arrivedCount} checked in. ${waitingCount} not arrived. ${decisionCount} need a decision before they can enter.`;

  const filteredList = useMemo(() => {
    const term = listQuery.trim().toLowerCase();
    return attendees.filter((person) => {
      if (!matchesListFilter(person, listFilter)) return false;
      if (!term) return true;
      return (
        person.name.toLowerCase().includes(term) ||
        person.company.toLowerCase().includes(term) ||
        person.order.toLowerCase().includes(term) ||
        listStatus(person).label.toLowerCase().includes(term)
      );
    });
  }, [attendees, listFilter, listQuery]);

  const pageSize = 20;
  const pageCount = Math.max(1, Math.ceil(filteredList.length / pageSize));
  const currentListPage = Math.min(listPage, pageCount);
  const listRows = filteredList.slice((currentListPage - 1) * pageSize, currentListPage * pageSize);

  const latestSession = recent.find((item) => item.session);
  const activeId = phase.name === "success" || phase.name === "problem" ? phase.id : undefined;
  const active = attendees.find((person) => person.id === activeId);
  const earlierHandoff = active ? held.find((item) => item.id === active.id) : undefined;

  return (
    <Box p={4} display="flex" flexDirection="column" gap={3}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={3} flexWrap="wrap">
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="h2" m={0}>
            {DOOR} check-in
          </Typography>
          <Typography m={0} color="subtle">
            Sage Summit, London · Wednesday 30 September · Main entrance
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
            <Pill variant="slate" fill>
              Offline
            </Pill>
            <Pill variant={ahead ? "green" : "orange"} fill>
              {ahead ? "Ahead" : "Behind"}
            </Pill>
            <Typography variant="h3" m={0}>
              {count} of {TARGET}
            </Typography>
          </Box>
          <Typography m={0} color="subtle">
            {minutesToKeynote === 0
              ? "The 10:30 keynote has started. Keep checking people in."
              : `${remaining} to go · ${minutesToKeynote} minutes until the 10:30 keynote`}
          </Typography>
        </Box>
      </Box>

      <Message variant="info" title="No wifi. This door works from the iPad.">
        {`The list of ${TARGET} people was saved here at ${LIST_SAVED_AT}. Scanning and name search use that list. ${pending} updates are stored on this iPad and will upload when wifi is back.`}
      </Message>

      <ProgressTracker
        progress={Math.min(100, Math.round((count / TARGET) * 100))}
        description="Checked in today"
        currentProgressLabel={String(count)}
        maxProgressLabel={String(TARGET)}
        customValuePreposition="of"
        variant={ahead ? "success" : "warning"}
        size="medium"
      />

      {notice && (
        <Message variant={notice.variant} title={notice.title} onDismiss={() => setNotice(null)}>
          {notice.body}
        </Message>
      )}

      <Box aria-live="polite" aria-atomic="true">
        {phase.name === "ready" && (
          <Tile orientation="vertical" highlightVariant="info" borderVariant="info" p={4} width="100%">
            <Box display="flex" flexDirection="column" alignItems="center" gap={2} py={4}>
              <Icon type="scan" size="large" color="info" aria-hidden />
              <Typography variant="h1" m={0} textAlign="center">
                Ready for the next badge
              </Typography>
              <Typography m={0} color="subtle" textAlign="center">
                Hold the QR code to the reader. It checks the list on this iPad, so a good scan needs no wifi and no extra tap.
              </Typography>
              {recent[0] && (
                <Typography m={0} color="subtle">
                  Last through: {recent[0].name} at {recent[0].time}
                </Typography>
              )}
              <Box width="320px" mt={1}>
                {queueLeft > 0 ? (
                  <Button variantType="primary" size="large" fullWidth iconType="scan" onClick={startScan}>
                    Scan badge
                  </Button>
                ) : (
                  <Button variantType="primary" size="large" fullWidth iconType="replay" onClick={replay}>
                    Run the morning again
                  </Button>
                )}
              </Box>
              <Typography m={0} color="subtle" textAlign="center">
                {queueLeft > 0
                  ? "Green means wave them in. Anything else, take the staff action, then scan the next badge."
                  : "Everyone in this arrival run has been seen. Look someone up, or run the morning again."}
              </Typography>
            </Box>
          </Tile>
        )}

        {phase.name === "reading" && (
          <Tile orientation="vertical" highlightVariant="info" borderVariant="info" p={4} width="100%">
            <Box display="flex" flexDirection="column" alignItems="center" gap={2} py={5}>
              <Loader loaderType="ring" size="large" loaderLabel="Checking the saved list" showLabel />
              <Typography variant="h2" m={0}>
                Checking the saved list
              </Typography>
              <Typography m={0} color="subtle">
                Hold it still. This lookup stays on the iPad.
              </Typography>
            </Box>
          </Tile>
        )}

        {phase.name === "success" && active && (
          <Tile orientation="vertical" highlightVariant="success" borderVariant="positive" borderWidth="borderWidth200" p={4} width="100%">
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Icon type="tick_circle" size="large" color="positive" aria-hidden />
                <Pill variant="green" fill>
                  Checked in
                </Pill>
              </Box>
              <PersonLine person={active} />
              <Typography m={0} color="positive" weight="medium">
                Checked in at {phase.time} · {DOOR}
              </Typography>
              <Message variant="success" title="Saved on this iPad">
                Wave them through. The badge prints on the Door A printer beside you.
              </Message>
              {active.hint && (
                <Message variant="info" title="Also tell them">
                  {active.hint}
                </Message>
              )}
              {phase.flag && (
                <Message variant="warning" title="Flagged for the desk">
                  {phase.flag}
                </Message>
              )}
              <Button variantType="primary" size="large" fullWidth iconType="scan" onClick={backToScanner}>
                Next badge
              </Button>
              <Typography m={0} color="subtle">
                Scanner comes back in {secondsLeft} seconds, so the next person is not waiting on a tap.
              </Typography>
              <Button variantType="tertiary" size="small" iconType="undo" onClick={() => undo(active.id, phase.time)}>
                Undo this check-in
              </Button>
            </Box>
          </Tile>
        )}

        {phase.name === "problem" && phase.kind === "duplicate" && active && (
          <Tile orientation="vertical" highlightVariant="warning" borderVariant="caution" borderWidth="borderWidth200" p={4} width="100%">
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Icon type="warning" size="large" color="caution" aria-hidden />
                <Pill variant="orange" fill>
                  Already checked in
                </Pill>
              </Box>
              <PersonLine person={active} />
              <Typography m={0}>
                Checked in at {active.checkedInAt} at {active.door ?? DOOR}. A second scan would count them twice.
              </Typography>
              {active.balance && <Typography m={0}>{active.balance} is still outstanding on this order.</Typography>}
              {active.wrongDay && <Typography m={0}>This Thursday pass was let in today.</Typography>}
              <Typography m={0} weight="medium">
                Say: "You're already in. Straight on through."
              </Typography>
              <Typography variant="h5" m={0}>
                Staff action
              </Typography>
              <Button variantType="primary" size="large" fullWidth iconType="tick" onClick={() => waveThrough(active)}>
                Wave through
              </Button>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Button variantType="secondary" size="medium" iconType="print" onClick={() => setPrinted(true)}>
                  {printed ? "Print again" : "Reprint badge"}
                </Button>
                <Button
                  variantType="tertiary"
                  size="medium"
                  iconType="search"
                  onClick={() => {
                    setQuery("");
                    setPhase({
                      name: "lookup",
                      prompt: "The badge belongs to someone else. Search the person standing here.",
                    });
                  }}
                >
                  Wrong person
                </Button>
              </Box>
              {printed && (
                <Message variant="success" title="Sent to the printer beside you">
                  The Door A printer does not use wifi. Hand the badge over, then wave them through.
                </Message>
              )}
            </Box>
          </Tile>
        )}

        {phase.name === "problem" && phase.kind === "unpaid" && active?.balance && (
          <Tile orientation="vertical" highlightVariant="error" borderVariant="negative" borderWidth="borderWidth200" p={4} width="100%">
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Icon type="error" size="large" color="negative" aria-hidden />
                <Pill variant="red" fill>{`${active.balance} still due`}</Pill>
              </Box>
              <PersonLine person={active} />
              <Typography m={0}>This pass is not valid until the balance is paid. Don't let them into the hall yet.</Typography>
              {earlierHandoff && (
                <Message variant="warning" title="Already handed off">
                  Sent to {earlierHandoff.where} at {earlierHandoff.time}. Only send them again if they are back at the door.
                </Message>
              )}
              <Typography m={0} weight="medium">
                Say: "There's {active.balance} left on this pass. The cash desk is on your right."
              </Typography>
              <Typography variant="h5" m={0}>
                Staff action
              </Typography>
              <Button variantType="primary" size="large" fullWidth iconType="arrow_right" onClick={() => sendAway("cash desk", active)}>
                Send to cash desk
              </Button>
              <Button
                variantType="secondary"
                size="medium"
                iconType="tick"
                onClick={() =>
                  checkIn(
                    active.id,
                    `${active.balance} is still due. Saved on this iPad. Tell the cash desk in person.`,
                  )
                }
              >
                Check in and flag the {active.balance}
              </Button>
            </Box>
          </Tile>
        )}

        {phase.name === "problem" && phase.kind === "wrong-day" && active && (
          <Tile orientation="vertical" highlightVariant="warning" borderVariant="caution" borderWidth="borderWidth200" p={4} width="100%">
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Icon type="warning" size="large" color="caution" aria-hidden />
                <Pill variant="orange" fill>
                  Not valid today
                </Pill>
              </Box>
              <PersonLine person={active} />
              <Typography m={0}>This pass is for Thursday's workshop. Today is the main conference.</Typography>
              {earlierHandoff && (
                <Message variant="warning" title="Already handed off">
                  Sent to {earlierHandoff.where} at {earlierHandoff.time}.
                </Message>
              )}
              <Typography m={0} weight="medium">
                Say: "This pass is for Thursday. Registration can sort a day pass. They're on your left."
              </Typography>
              <Typography variant="h5" m={0}>
                Staff action
              </Typography>
              <Button
                variantType="primary"
                size="large"
                fullWidth
                iconType="arrow_right"
                onClick={() => sendAway("registration", active)}
              >
                Send to registration
              </Button>
              <Button
                variantType="secondary"
                size="medium"
                iconType="tick"
                onClick={() =>
                  checkIn(
                    active.id,
                    "Thursday pass used today. Saved on this iPad. Tell registration in person, on your left.",
                  )
                }
              >
                Check in on today's list
              </Button>
            </Box>
          </Tile>
        )}

        {phase.name === "problem" && phase.kind === "unknown" && (
          <Tile orientation="vertical" highlightVariant="error" borderVariant="negative" borderWidth="borderWidth200" p={4} width="100%">
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Icon type="error" size="large" color="negative" aria-hidden />
                <Pill variant="red" fill>
                  Badge not recognised
                </Pill>
              </Box>
              <Typography variant="h1" m={0}>
                This code isn't on today's list
              </Typography>
              <Typography m={0}>
                It may be damaged, a photo of a badge, or from another event. Nothing on the saved list matches this code.
              </Typography>
              <Typography m={0} weight="medium">
                Say: "I can't read this one. What's the name on the badge?"
              </Typography>
            </Box>
          </Tile>
        )}

        {phase.name === "lookup" && (
          <Tile orientation="vertical" highlightVariant="info" borderVariant="info" borderWidth="borderWidth200" p={4} width="100%">
            <Box display="flex" flexDirection="column" gap={2}>
              <Pill variant="blue" fill>
                Manual check-in
              </Pill>
              <Typography variant="h1" m={0}>
                Who is at the door?
              </Typography>
              <Typography m={0}>{phase.prompt}</Typography>
            </Box>
          </Tile>
        )}
      </Box>

      {finderInStage && (
        <Tile orientation="vertical" p={3} width="100%">
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="h5" m={0}>
              Staff action
            </Typography>
            <Finder people={attendees} query={query} onQuery={setQuery} onPick={openPerson} />
            <Box display="flex" gap={2} flexWrap="wrap">
              {phase.name === "problem" && phase.kind === "unknown" && (
                <Button variantType="secondary" size="medium" iconType="arrow_right" onClick={() => sendAway("registration")}>
                  Send to registration
                </Button>
              )}
              <Button variantType="tertiary" size="medium" onClick={backToScanner}>
                Back to scanner
              </Button>
            </Box>
          </Box>
        </Tile>
      )}

      <Box display="flex" flexWrap="wrap" gap={3}>
        <Box flex="1" minWidth="280px" display="flex" flexDirection="column" gap={2}>
          <Typography variant="h4" m={0}>
            {finderInStage ? "Look-up is open above" : "Badge failed? Find them"}
          </Typography>
          {finderInStage ? (
            <Typography m={0} color="subtle">
              Search is on the main panel so you can finish this person without leaving the queue.
            </Typography>
          ) : (
            <Finder people={attendees} query={query} onQuery={setQuery} onPick={openPerson} />
          )}
        </Box>

        <Box flex="1" minWidth="280px" display="flex" flexDirection="column" gap={2}>
          <Typography variant="h4" m={0}>
            Last through {DOOR}
          </Typography>
          <Tile orientation="vertical" variant="grey" p={2}>
            <Box display="flex" flexDirection="column" gap={2}>
              {recent.map((item, index) => (
                <Box key={`${item.id}-${item.time}`} display="flex" flexDirection="column" gap={2}>
                  {index > 0 && <Divider />}
                  <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
                    <Box display="flex" flexDirection="column" gap={0}>
                      <Typography variant="strong" m={0}>
                        {item.name}
                      </Typography>
                      <Typography m={0} color="subtle">
                        {item.note}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1} flexShrink={0}>
                      <Typography m={0} color="subtle">
                        {item.time}
                      </Typography>
                      {item.session && item.id === latestSession?.id && item.time === latestSession.time && (
                        <Button
                          variantType="tertiary"
                          size="small"
                          iconType="undo"
                          aria-label={`Undo check-in for ${item.name}`}
                          onClick={() => undo(item.id, item.time)}
                        >
                          Undo
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Tile>

          {held.length > 0 && (
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography variant="h4" m={0}>
                Sent out of the queue
              </Typography>
              {held.map((item) => (
                <Box key={`${item.name}-${item.time}`} display="flex" justifyContent="space-between" gap={2}>
                  <Typography m={0}>
                    {item.name} · {item.where}
                  </Typography>
                  <Typography m={0} color="subtle">
                    {item.time}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          <Button variantType="tertiary" size="small" iconType="replay" onClick={replay}>
            Run the morning again
          </Button>
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="h3" m={0}>
          Expected participants
        </Typography>
        <Typography id="expected-list-summary" m={0}>
          {listSummary}
        </Typography>
        <ButtonToggleGroup
          id="expected-status-filter"
          label="Show"
          inputHint="Filters the list below. Status is also written in each row."
          value={listFilter}
          onChange={(_event, value) => {
            if (value === "all" || value === "in" || value === "waiting" || value === "decision") {
              setListFilter(value);
              setListPage(1);
            }
          }}
        >
          <ButtonToggle value="all">{`All, ${attendees.length}`}</ButtonToggle>
          <ButtonToggle value="in">{`Checked in, ${arrivedCount}`}</ButtonToggle>
          <ButtonToggle value="waiting">{`Not arrived, ${waitingCount}`}</ButtonToggle>
          <ButtonToggle value="decision">{`Needs a decision, ${decisionCount}`}</ButtonToggle>
        </ButtonToggleGroup>
        <Search
          id="expected-list-search"
          label="Search the expected list"
          inputHint="Name, company, order number or status"
          aria-label="Search the expected list by name, company, order number or status"
          value={listQuery}
          onChange={(event) => {
            setListQuery(event.target.value);
            setListPage(1);
          }}
        />
        {filteredList.length === 0 ? (
          <Message variant="info" title="No one matches">
            Try another name, or choose a different status.
          </Message>
        ) : (
          <FlatTable
            caption="Expected participants and their check-in status"
            ariaDescribedby="expected-list-summary"
            hasStickyHead
            isZebra
            size="medium"
          >
            <FlatTableHead>
              <FlatTableRow>
                <FlatTableHeader>Name</FlatTableHeader>
                <FlatTableHeader>Company</FlatTableHeader>
                <FlatTableHeader>Ticket</FlatTableHeader>
                <FlatTableHeader>Order</FlatTableHeader>
                <FlatTableHeader>Check-in status</FlatTableHeader>
              </FlatTableRow>
            </FlatTableHead>
            <FlatTableBody>
              {listRows.map((person) => {
                const status = listStatus(person);
                return (
                  <FlatTableRow key={person.id}>
                    <FlatTableRowHeader>{person.name}</FlatTableRowHeader>
                    <FlatTableCell>{person.company}</FlatTableCell>
                    <FlatTableCell>{person.ticket}</FlatTableCell>
                    <FlatTableCell>{person.order}</FlatTableCell>
                    <FlatTableCell>
                      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                        <Pill variant={status.variant} fill>
                          {status.label}
                        </Pill>
                        <Typography m={0}>{status.detail}</Typography>
                      </Box>
                    </FlatTableCell>
                  </FlatTableRow>
                );
              })}
            </FlatTableBody>
          </FlatTable>
        )}
        {filteredList.length > 0 && (
          <Pagination
            aria-label="Expected participants pages"
            currentPage={currentListPage}
            pageSize={pageSize}
            totalRecords={filteredList.length}
            onPagination={(nextPage) => setListPage(nextPage)}
          />
        )}
      </Box>
    </Box>
  );
}
