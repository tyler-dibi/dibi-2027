import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import Box from "carbon-react/lib/components/box";
import Button from "carbon-react/lib/components/button/__next__";
import { Checkbox } from "carbon-react/lib/components/checkbox";
import Dialog from "carbon-react/lib/components/dialog";
import Icon from "carbon-react/lib/components/icon";
import Link from "carbon-react/lib/components/link";
import Message from "carbon-react/lib/components/message";
import Pill from "carbon-react/lib/components/pill";
import Portrait from "carbon-react/lib/components/portrait";
import Textarea from "carbon-react/lib/components/textarea";
import Textbox from "carbon-react/lib/components/textbox";
import { Tile } from "carbon-react/lib/components/tile";
import Typography from "carbon-react/lib/components/typography";
import useMediaQuery from "carbon-react/lib/hooks/useMediaQuery";

import {
  answers,
  durationSeconds,
  files,
  followUpMessage,
  items,
  matchQuestion,
  meeting,
  people,
  quoteAt,
  seconds,
  splitQuote,
  waveBars,
  type Evidence,
  type MatchedAnswer,
  type MeetingItem,
  type Person,
} from "./_team-05-data";

export const meta = {
  title: "Q4 Launch Sync",
};

type ItemStatus = "done" | "requested" | "resolved";

type QaEntry = {
  id: string;
  question: string;
  pending: boolean;
  answer?: string;
  evidence?: Evidence;
  jump?: string | null;
};

const accent = "var(--colorsActionMajor500)";
const amber = "var(--colorsSemanticCaution500)";
const grey = "var(--colorsUtilityMajor400)";

function dotColor(item: MeetingItem, status?: ItemStatus) {
  if (item.unclear && !status) return amber;
  if (item.group === "you") return accent;
  return grey;
}

export default function Team05Playground() {
  const wide = useMediaQuery("(min-width: 721px)");
  const timelineRef = useRef<HTMLDivElement>(null);
  const askRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const timer = useRef<number | null>(null);
  const toastTimer = useRef<number | null>(null);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const nextId = useRef(0);

  const [activeId, setActiveId] = useState("a1");
  const [playSeconds, setPlaySeconds] = useState(seconds("12:34"));
  const [looseQuote, setLooseQuote] = useState<Evidence | null>(null);
  const [status, setStatus] = useState<Record<string, ItemStatus>>({});
  const [thread, setThread] = useState<QaEntry[]>([]);
  const [question, setQuestion] = useState("");
  const [draftOpen, setDraftOpen] = useState(false);
  const [followUp, setFollowUp] = useState(followUpMessage);
  const [toast, setToast] = useState<string | null>(null);
  const [roster, setRoster] = useState<Person[]>(people);
  const [consent, setConsent] = useState(false);
  const [gateOpen, setGateOpen] = useState(true);
  const [creating, setCreating] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [summaryReady, setSummaryReady] = useState(false);
  const [downloadLabel, setDownloadLabel] = useState("Download deck and files");
  const [downloadBusy, setDownloadBusy] = useState(false);
  const [clipTime, setClipTime] = useState<string | null>(null);
  const [clipStep, setClipStep] = useState(0);
  const [clipDone, setClipDone] = useState(false);
  const clipTimer = useRef<number | null>(null);
  const clipTimeRef = useRef<string | null>(null);
  const createTimer = useRef<number | null>(null);
  const downloadTimer = useRef<number | null>(null);

  const active = items.find((item) => item.id === activeId);

  useEffect(() => {
    if (draftOpen) messageRef.current?.focus();
  }, [draftOpen]);

  useEffect(
    () => () => {
      if (clipTimer.current) window.clearInterval(clipTimer.current);
      if (createTimer.current) window.clearTimeout(createTimer.current);
      if (downloadTimer.current) window.clearTimeout(downloadTimer.current);
    },
    [],
  );

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  };

  const stopClip = (keepHead = false) => {
    if (clipTimer.current) window.clearInterval(clipTimer.current);
    clipTimer.current = null;
    if (!keepHead && clipTimeRef.current) setPlaySeconds(seconds(clipTimeRef.current));
    clipTimeRef.current = null;
    setClipTime(null);
    setClipStep(0);
    setClipDone(false);
  };

  const playClip = (time: string) => {
    if (clipTimeRef.current === time && clipTimer.current) {
      stopClip(false);
      return;
    }
    stopClip(true);
    const start = seconds(time);
    let step = 0;
    clipTimeRef.current = time;
    setClipTime(time);
    setClipStep(0);
    setClipDone(false);
    clipTimer.current = window.setInterval(() => {
      step += 1;
      const fraction = step / 50;
      setClipStep(step);
      setPlaySeconds(start + fraction * 5);
      if (step >= 50) {
        if (clipTimer.current) window.clearInterval(clipTimer.current);
        clipTimer.current = null;
        clipTimeRef.current = null;
        setClipDone(true);
      }
    }, 100);
  };

  const focusItem = (id: string) => {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;
    stopClip(true);
    setActiveId(id);
    setPlaySeconds(seconds(item.time));
    setLooseQuote(null);
  };

  const jumpTo = (time: string) => {
    const match = items.find((item) => item.time === time);
    if (match) focusItem(match.id);
    else {
      stopClip(true);
      setActiveId("");
      setPlaySeconds(seconds(time));
      setLooseQuote(quoteAt(time) ?? null);
    }
    timelineRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const ask = (matched: MatchedAnswer, typed?: string) => {
    const shown = (typed ?? matched.q).trim();
    if (!shown) return;
    nextId.current += 1;
    const id = `qa-${nextId.current}`;
    setQuestion("");
    setThread((prev) => [...prev, { id, question: shown, pending: true, jump: matched.jump }]);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setThread((prev) =>
        prev.map((entry) =>
          entry.id === id
            ? { ...entry, pending: false, answer: matched.a, evidence: matched.ev[0] }
            : entry,
        ),
      );
      if (matched.jump) jumpTo(matched.jump);
    }, 500);
  };

  const reset = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setThread([]);
    setQuestion("");
    inputRef.current?.focus();
  };

  const showCreating = () => {
    setCreating(true);
    setDeclined(false);
    if (createTimer.current) window.clearTimeout(createTimer.current);
    createTimer.current = window.setTimeout(() => {
      setGateOpen(false);
      setCreating(false);
      setSummaryReady(true);
      showToast("Summary created with approval from all 6 attendees");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1300);
  };

  const approve = () => {
    setRoster((prev) => prev.map((person) => (person.initials === "SP" ? { ...person, approved: true } : person)));
    showCreating();
  };

  const restart = () => {
    stopClip(true);
    if (timer.current) window.clearTimeout(timer.current);
    if (createTimer.current) window.clearTimeout(createTimer.current);
    if (downloadTimer.current) window.clearTimeout(downloadTimer.current);
    setStatus({});
    setActiveId("a1");
    setPlaySeconds(seconds("12:34"));
    setLooseQuote(null);
    setThread([]);
    setQuestion("");
    setDraftOpen(false);
    setFollowUp(followUpMessage);
    setDownloadBusy(false);
    setDownloadLabel("Download deck and files");
    setRoster(people.map((person) => ({ ...person })));
    setConsent(false);
    setCreating(false);
    setDeclined(false);
    setSummaryReady(false);
    setGateOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast("Demo restarted");
  };

  const downloadFiles = () => {
    if (downloadBusy) return;
    setDownloadBusy(true);
    setDownloadLabel("Preparing files…");
    if (downloadTimer.current) window.clearTimeout(downloadTimer.current);
    downloadTimer.current = window.setTimeout(() => {
      setDownloadBusy(false);
      setDownloadLabel("Download again");
      showToast("Q4-Launch-Sync-files.zip downloaded (3 files, 5.4 MB)");
    }, 1200);
  };

  const approvedCount = roster.filter((person) => person.approved).length;
  const detailWho = looseQuote?.who ?? (active ? splitQuote(active).who : "");
  const detailTime = looseQuote?.time ?? active?.time ?? "";

  const onDotKey = (event: KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>, index: number) => {
    const next =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? index + 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? index - 1
          : null;
    if (next === null) return;
    event.preventDefault();
    const clamped = Math.max(0, Math.min(items.length - 1, next));
    dotRefs.current[clamped]?.focus();
    focusItem(items[clamped].id);
  };

  return (
    <Box p={4} maxWidth="960px" display="flex" flexDirection="column" gap={3}>
      {toast && (
        <Message variant="success" open onDismiss={() => setToast(null)}>
          {toast}
        </Message>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h1" m={0}>
            {meeting.title}
          </Typography>
          <Typography variant="p" m={0} color="subtle">
            {meeting.when} · {meeting.duration} · {meeting.attendees} · {meeting.readTime}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
          <Button variantType="tertiary" size="small" onClick={restart}>
            ↺ Restart demo
          </Button>
          {summaryReady && <Pill variant="green">AI summary approved</Pill>}
          <Pill variant="orange">You missed this</Pill>
        </Box>
      </Box>

      {gateOpen && (
        <Tile orientation="vertical" borderVariant="caution" p={3}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
            <Box flex="1">
              <Typography variant="small" m={0} color="caution" textTransform="uppercase">
                Approval needed
              </Typography>
              <Typography variant="h2">Approve an AI summary of this meeting</Typography>
              <Typography variant="p" m={0} color="subtle">
                Before any AI summary is created, every attendee has to approve it. Once everyone has approved, the
                recording is processed to create your catch-up. The recording itself isn't shared any further.
              </Typography>
            </Box>
            <Box>
              <Typography variant="h2" m={0}>
                {approvedCount} of 6
              </Typography>
              <Typography variant="small" m={0} color="subtle">
                attendees approved
              </Typography>
            </Box>
          </Box>
          <Box display="grid" gridTemplateColumns={wide ? "1fr 1fr" : "1fr"} gap={1} mt={2}>
            {roster.map((person) => (
              <Box key={person.initials} display="flex" alignItems="center" gap={1} p={1}>
                <Portrait
                  size="S"
                  initials={person.initials}
                  alt={person.name}
                  variant={person.approved ? "green" : "orange"}
                />
                <Typography variant="p" m={0}>
                  {person.name}
                </Typography>
                <Typography variant="small" m={0} color={person.approved ? "positive" : "caution"}>
                  {person.approved ? "Approved" : "Waiting for you"}
                </Typography>
              </Box>
            ))}
          </Box>
          {creating && (
            <Typography variant="p" color="subtle" aria-live="polite">
              All 6 attendees have approved. Creating your summary…
            </Typography>
          )}
          {declined && !creating && (
            <Box mt={2}>
              <Typography variant="p" m={0} color="subtle">
                No AI summary will be created for this meeting. The other attendees won't see one either.
              </Typography>
              <Link onClick={() => setDeclined(false)}>Review again</Link>
            </Box>
          )}
          {!creating && !declined && (
            <Box mt={2}>
              <Checkbox
                id="consent"
                name="consent"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                label="I approve AI processing of the Q4 Launch Sync recording to create summaries, actions and decisions."
              />
              <Box display="flex" alignItems="center" flexWrap="wrap" gap={2} mt={2}>
                <Button variantType="primary" disabled={!consent} onClick={approve}>
                  Approve and create summary
                </Button>
                <Link
                  onClick={() => {
                    setDeclined(true);
                  }}
                >
                  Don't approve
                </Link>
              </Box>
            </Box>
          )}
        </Tile>
      )}

      {!gateOpen && (
      <Box display="flex" flexDirection="column" gap={3}>
      <Box>
        <Typography variant="small" m={0} color="positive" textTransform="uppercase">
          {meeting.eyebrow}
        </Typography>
        <Typography variant="h2">
          You now own the{" "}
          <Typography as="span" variant="strong" color="positive">
            Q4 launch deck
          </Typography>
          , due Friday, and the team chose{" "}
          <Typography as="span" variant="strong" color="positive">
            Option B
          </Typography>{" "}
          for pricing.
        </Typography>
        <Typography variant="p" m={0} color="subtle">
          {meeting.summary}
        </Typography>
      </Box>

      <Tile orientation="vertical" p={3}>
        <Box ref={askRef}>
          <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} mb={2}>
            <Typography variant="h3" m={0}>
              Ask about this meeting
            </Typography>
            {thread.length > 0 && (
              <Button variantType="subtle" size="small" onClick={reset}>
                Reset
              </Button>
            )}
          </Box>
          <Box aria-live="polite" display="flex" flexDirection="column" gap={2} mb={thread.length > 0 ? 2 : 0}>
            {thread.map((entry) => (
              <Box key={entry.id}>
                <Typography variant="strong" m={0}>
                  {entry.question}
                </Typography>
                {entry.pending ? (
                  <Typography variant="p" m={0} color="subtle">
                    Thinking…
                  </Typography>
                ) : (
                  <Box>
                    <Typography variant="p" m={0} color="subtle">
                      {entry.answer}
                    </Typography>
                    {entry.evidence && (
                      <Tile orientation="vertical" borderVariant="positive" p={2} mt={1}>
                        <Typography variant="small" m={0} color="subtle" textTransform="uppercase">
                          Evidence from the meeting
                        </Typography>
                        <Typography variant="em" m={0}>
                          “{entry.evidence.text}”
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} mt={1}>
                          <Typography variant="small" m={0} color="subtle">
                            {entry.evidence.who}
                          </Typography>
                          <Link onClick={() => jumpTo(entry.evidence?.time ?? "")}>{entry.evidence.time}</Link>
                        </Box>
                      </Tile>
                    )}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
            {answers.slice(0, 3).map((answer) => (
              <Button key={answer.q} variantType="tertiary" size="small" onClick={() => ask({ ...answer, jump: null })}>
                {answer.q}
              </Button>
            ))}
          </Box>
          <Box display="flex" alignItems="flex-end" gap={1}>
            <Box flex="1">
              <Textbox
                ref={inputRef}
                label="Ask a question about the meeting"
                placeholder="Ask a question about the meeting"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") ask(matchQuestion(question), question);
                }}
              />
            </Box>
            <Button
              variantType="subtle"
              aria-label="Ask"
              onClick={() => ask(matchQuestion(question), question)}
            >
              →
            </Button>
          </Box>
        </Box>
      </Tile>

      <Tile orientation="vertical" p={3}>
        <Box ref={timelineRef}>
          <Typography variant="h3">Meeting timeline</Typography>
          <Box overflowX="auto">
            <Box position="relative" height="48px" minWidth="520px" mx={1} role="group" aria-label="Meeting timeline from 0:00 to 45:00">
              <Box
                position="absolute"
                top="22px"
                left="0"
                width="100%"
                height="4px"
                bg="var(--colorsUtilityMajor100)"
                borderRadius="borderRadius100"
              />
              <Box
                position="absolute"
                top="8px"
                left={`${(playSeconds / durationSeconds) * 100}%`}
                width="2px"
                height="32px"
                bg="var(--colorsUtilityYin090)"
                aria-hidden="true"
              />
              {items.map((item, index) => (
                <Box
                  key={item.id}
                  position="absolute"
                  top="6px"
                  left={`calc(${(seconds(item.time) / durationSeconds) * 100}% - 18px)`}
                >
                  <Button
                    ref={(node) => {
                      dotRefs.current[index] = node instanceof HTMLButtonElement ? node : null;
                    }}
                    size="small"
                    variantType="tertiary"
                    aria-label={`${item.time}: ${item.title}`}
                    onClick={() => focusItem(item.id)}
                    onKeyDown={(event) => onDotKey(event, index)}
                  >
                    <Box
                      width="16px"
                      height="16px"
                      borderRadius="borderRadiusCircle"
                      bg={dotColor(item, status[item.id])}
                      aria-hidden="true"
                    />
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
          <Box display="flex" justifyContent="space-between" mx={1}>
            {["0:00", "15:00", "30:00", "45:00"].map((mark) => (
              <Typography key={mark} variant="small" m={0} color="subtle">
                {mark}
              </Typography>
            ))}
          </Box>
          <Box display="flex" flexWrap="wrap" gap={2} mt={1}>
            <Legend color={accent} label="Affects you" />
            <Legend color={grey} label="FYI" />
            <Legend color={amber} label="Needs clarifying" />
          </Box>
          <Box mt={2} p={2} bg="var(--colorsUtilityMajor025)" borderRadius="borderRadius050">
            {looseQuote ? (
              <Box>
                <Typography variant="strong" m={0}>
                  At {looseQuote.time}
                </Typography>
                <Quote who={looseQuote.who} text={looseQuote.text} time={looseQuote.time} onJump={jumpTo} />
                <ClipPlayer
                  time={detailTime}
                  who={detailWho}
                  playing={clipTime === detailTime && !clipDone}
                  done={clipDone && clipTime === detailTime}
                  step={clipTime === detailTime ? clipStep : 0}
                  onPlay={() => playClip(detailTime)}
                />
              </Box>
            ) : active ? (
              <Box>
                <Typography variant="strong" m={0}>
                  {active.title}
                </Typography>
                <Quote {...splitQuote(active)} onJump={jumpTo} />
                <ClipPlayer
                  time={detailTime}
                  who={detailWho}
                  playing={clipTime === detailTime && !clipDone}
                  done={clipDone && clipTime === detailTime}
                  step={clipTime === detailTime ? clipStep : 0}
                  onPlay={() => playClip(detailTime)}
                />
              </Box>
            ) : (
              <Typography variant="p" m={0}>
                Select a point on the timeline to see what happened.
              </Typography>
            )}
          </Box>
        </Box>
      </Tile>

      <Box display="grid" gridTemplateColumns={wide ? "1.25fr 1fr" : "1fr"} gap={2}>
        <Column
          title="Affects you"
          prominent
          group="you"
          activeId={activeId}
          status={status}
          onToggle={(id, checked) =>
            setStatus((prev) => {
              const next = { ...prev };
              if (checked) next[id] = "done";
              else delete next[id];
              return next;
            })
          }
          onJump={focusItem}
          onWhy={(which) => {
            ask(which === "option-b" ? { ...answers[1], jump: null } : { ...answers[3], jump: null });
            askRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
          onDraft={() => {
            setFollowUp(followUpMessage);
            setDraftOpen(true);
          }}
          onResolve={(id) => {
            setStatus((prev) => ({ ...prev, [id]: "resolved" }));
            showToast("Marked as resolved");
          }}
        />
        <Column
          title="FYI"
          group="fyi"
          activeId={activeId}
          status={status}
          onToggle={(id, checked) =>
            setStatus((prev) => {
              const next = { ...prev };
              if (checked) next[id] = "done";
              else delete next[id];
              return next;
            })
          }
          onJump={focusItem}
          onWhy={(which) => {
            ask(which === "option-b" ? { ...answers[1], jump: null } : { ...answers[3], jump: null });
            askRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
          onDraft={() => {
            setFollowUp(followUpMessage);
            setDraftOpen(true);
          }}
          onResolve={(id) => {
            setStatus((prev) => ({ ...prev, [id]: "resolved" }));
            showToast("Marked as resolved");
          }}
        />
      </Box>

      <Tile orientation="vertical" p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box flex="1">
            <Typography variant="h3">Meeting deck and resources</Typography>
            {files.map((file) => (
              <Box key={file.name} display="flex" alignItems="center" gap={1} mb={1}>
                <Pill variant="grey">{file.ext}</Pill>
                <Typography variant="p" m={0}>
                  {file.name}
                </Typography>
                <Typography variant="small" m={0} color="subtle">
                  {file.size}
                </Typography>
              </Box>
            ))}
          </Box>
          <Button variantType="primary" disabled={downloadBusy} onClick={downloadFiles}>
            {downloadLabel}
          </Button>
        </Box>
      </Tile>
      </Box>
      )}

      <Dialog
        open={draftOpen}
        onCancel={() => setDraftOpen(false)}
        title="Draft follow-up"
        subtitle="To Priya Shah, who ran the meeting"
        size="medium-small"
      >
        <Textarea
          ref={messageRef}
          label="Message"
          rows={5}
          value={followUp}
          onChange={(event) => setFollowUp(event.target.value)}
        />
        <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
          <Button variantType="tertiary" onClick={() => setDraftOpen(false)}>
            Cancel
          </Button>
          <Button
            variantType="primary"
            onClick={() => {
              setStatus((prev) => ({ ...prev, a2: "requested" }));
              setDraftOpen(false);
              showToast("Follow-up sent to Priya");
            }}
          >
            Send
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}

function ClipPlayer({
  time,
  who,
  playing,
  done,
  step,
  onPlay,
}: {
  time: string;
  who: string;
  playing: boolean;
  done: boolean;
  step: number;
  onPlay: () => void;
}) {
  const played = step / 50;
  return (
    <Box display="flex" alignItems="center" gap={1} mt={1}>
      <Button
        size="small"
        variantType="primary"
        aria-label={playing ? `Pause ${who}'s audio` : done ? `Replay ${who}'s audio from ${time}` : `Play ${who}'s audio from ${time}`}
        onClick={onPlay}
      >
        {playing ? "❚❚" : done ? "↺" : "▶"}
      </Button>
      <Box display="flex" alignItems="flex-end" gap="2px" flex="1" height="24px" aria-hidden="true">
        {waveBars.map((bar, index) => (
          <Box
            key={`${time}-${index}`}
            width="3px"
            height={`${bar + 4}px`}
            borderRadius="borderRadius025"
            bg={index / waveBars.length < played ? accent : grey}
          />
        ))}
      </Box>
      <Typography variant="small" m={0} color="subtle">
        0:0{Math.min(5, Math.floor(played * 5))} / 0:05
      </Typography>
    </Box>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Box width="10px" height="10px" borderRadius="borderRadiusCircle" bg={color} aria-hidden="true" />
      <Typography variant="small" m={0} color="subtle">
        {label}
      </Typography>
    </Box>
  );
}

function Quote({ who, text, time, onJump }: Evidence & { onJump: (time: string) => void }) {
  return (
    <Tile orientation="vertical" borderVariant="positive" p={2} mt={1}>
      <Typography variant="em" m={0}>
        “{text}”
      </Typography>
      <Box display="flex" alignItems="center" gap={1} mt={1}>
        <Portrait size="XS" initials={who.slice(0, 1)} alt={who} />
        <Typography variant="small" m={0} color="subtle">
          {who}
        </Typography>
        <Link onClick={() => onJump(time)}>{time}</Link>
      </Box>
    </Tile>
  );
}

function Column({
  title,
  prominent,
  group,
  activeId,
  status,
  onToggle,
  onJump,
  onWhy,
  onDraft,
  onResolve,
}: {
  title: string;
  prominent?: boolean;
  group: "you" | "fyi";
  activeId: string;
  status: Record<string, ItemStatus>;
  onToggle: (id: string, checked: boolean) => void;
  onJump: (id: string) => void;
  onWhy: (which: "option-b" | "november") => void;
  onDraft: () => void;
  onResolve: (id: string) => void;
}) {
  const actions = items.filter((item) => item.group === group && item.type === "action");
  const decisions = items.filter((item) => item.group === group && item.type === "decision");

  return (
    <Tile orientation="vertical" borderVariant={prominent ? "positive" : "default"} p={2}>
      <Typography variant="h3" color={prominent ? "positive" : "subtle"}>
        {title}
      </Typography>
      <Typography variant="small" m={0} color="subtle">
        Actions
      </Typography>
      {actions.map((item) => {
        const itemStatus = status[item.id];
        const done = itemStatus === "done";
        const open = Boolean(item.unclear) && !itemStatus;
        const spoken = splitQuote(item);
        return (
          <Tile
            key={item.id}
            orientation="vertical"
            borderVariant={item.id === activeId ? "selected" : item.unclear && !itemStatus ? "caution" : "default"}
            p={2}
            mt={1}
          >
            <Checkbox
              id={item.id}
              name={item.id}
              checked={done}
              onChange={(event) => onToggle(item.id, event.target.checked)}
              label={
                <Typography
                  variant="strong"
                  m={0}
                  color={done ? "subtle" : undefined}
                  textDecoration={done ? "line-through" : undefined}
                >
                  {item.title}
                </Typography>
              }
            />
            <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
              <Portrait
                size="XS"
                initials={item.owner ?? "?"}
                alt={item.ownerName ?? "No owner"}
                variant={item.owner ? "green" : "orange"}
              />
              <Typography variant="small" m={0} color="subtle">
                {item.ownerName ?? "No owner"} · Due {item.due}
              </Typography>
              <Link onClick={() => onJump(item.id)}>{item.time}</Link>
              {itemStatus === "requested" && <Pill variant="green">Clarification requested</Pill>}
              {itemStatus === "resolved" && <Pill variant="green">Resolved</Pill>}
              {open && <Pill variant="orange">Needs clarifying</Pill>}
            </Box>
            <Typography variant="em" m={0}>
              “{spoken.text}” — {spoken.who}
            </Typography>
            {open && (
              <Box mt={1}>
                <Typography variant="small" m={0} color="caution">
                  {item.unclear}
                </Typography>
                <Box display="flex" flexWrap="wrap" alignItems="center" gap={1} mt={1}>
                  <Button variantType="secondary" size="small" onClick={onDraft}>
                    Draft follow-up
                  </Button>
                  <Link onClick={() => onResolve(item.id)}>Mark as resolved</Link>
                </Box>
              </Box>
            )}
          </Tile>
        );
      })}
      <Box mt={2}>
        <Typography variant="small" m={0} color="subtle">
          Decisions
        </Typography>
      </Box>
      {decisions.map((item) => {
        const spoken = splitQuote(item);
        return (
          <Tile
            key={item.id}
            orientation="vertical"
            borderVariant={item.id === activeId ? "selected" : "default"}
            p={2}
            mt={1}
          >
            <Box display="flex" gap={1} alignItems="flex-start">
              <Icon type="tick" color={accent} aria-hidden />
              <Box flex="1">
                <Typography variant="strong" m={0}>
                  {item.title}
                </Typography>
                <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
                  <Typography variant="small" m={0} color="subtle">
                    Decided by {item.by}
                  </Typography>
                  <Link onClick={() => onJump(item.id)}>{item.time}</Link>
                  {item.why && <Link onClick={() => onWhy(item.why ?? "option-b")}>Why?</Link>}
                </Box>
                <Typography variant="em" m={0}>
                  “{spoken.text}” — {spoken.who}
                </Typography>
              </Box>
            </Box>
          </Tile>
        );
      })}
    </Tile>
  );
}
