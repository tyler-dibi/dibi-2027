import { useState } from "react";

import Box from "carbon-react/lib/components/box";
import Button from "carbon-react/lib/components/button/__next__";
import { Checkbox } from "carbon-react/lib/components/checkbox";
import Divider from "carbon-react/lib/components/divider";
import {
  FlatTable,
  FlatTableBody,
  FlatTableCell,
  FlatTableHead,
  FlatTableHeader,
  FlatTableRow,
} from "carbon-react/lib/components/flat-table";
import Message from "carbon-react/lib/components/message";
import Pill from "carbon-react/lib/components/pill";
import Portrait from "carbon-react/lib/components/portrait";
import Textarea from "carbon-react/lib/components/textarea";
import Textbox from "carbon-react/lib/components/textbox";
import { Tile, TileContent } from "carbon-react/lib/components/tile";
import Typography from "carbon-react/lib/components/typography";

export const meta = {
  title: "Meeting catch-up",
};

type Answer = {
  title: string;
  text: string;
  variant: "ai" | "warning";
};

type Approval = "pending" | "approved" | "returned";

const oneMinute = {
  headline: "The October VAT return is on. Receipt capture is off. You have one email to review.",
  body: "The return goes out on 16 October. Live filing stays off until Finance signs off the HMRC sandbox. Receipt capture is paused until November, so it is out of this release. Your only job is to review the accountant email by Friday 2 October.",
};

const people = [
  { initials: "AK", name: "Amira Khan", role: "Finance lead", absent: false },
  { initials: "JB", name: "Jordan Blake", role: "Product", absent: false },
  { initials: "OH", name: "Owen Hughes", role: "Engineering", absent: false },
  { initials: "HC", name: "Helen Crowe", role: "Customer success", absent: false },
  { initials: "AM", name: "Alex Morgan", role: "You · Design", absent: true },
];

const summary = [
  "Finance walked through the October VAT return. It can still go out on 16 October if the sandbox tests and the accountant email land this week.",
  "Engineering has the HMRC sandbox connected. Live filing stays switched off until Amira signs it off.",
  "Three accountant practices asked for a plain-English note before the deadline. Jordan attached the draft in the Teams chat at 10:31.",
  "Owen demoed receipt capture. It fails on crumpled petrol receipts, so it moves out of the October release.",
];

const decisions = [
  {
    title: "Ship the October VAT return on Thursday 16 October",
    detail: "Agreed by Amira Khan. The date is fixed unless the sandbox fails.",
  },
  {
    title: "Keep live filing off until sandbox sign-off",
    detail: "Agreed by Owen Hughes. Customers will not be filed to HMRC before Amira approves the test pack.",
  },
  {
    title: "Pause receipt capture until the November release",
    detail: "Agreed by Jordan Blake. It is not a design rejection. The scan is not reliable enough for October.",
  },
];

const actions = [
  {
    id: "email",
    task: "Review the accountant email copy",
    owner: "You",
    due: "Fri 2 Oct",
    yours: true,
  },
  {
    id: "sandbox",
    task: "Complete the HMRC sandbox test pack",
    owner: "Amira Khan",
    due: "Wed 7 Oct",
    yours: false,
  },
  {
    id: "flag",
    task: "Remove receipt capture from the October flags",
    owner: "Owen Hughes",
    due: "Mon 5 Oct",
    yours: false,
  },
  {
    id: "practices",
    task: "Tell the three waiting practices that capture is paused",
    owner: "Helen Crowe",
    due: "Thu 8 Oct",
    yours: false,
  },
];

const suggestions = [
  "What do I need to do?",
  "Why was receipt capture paused?",
  "Is the VAT return still on track?",
];

const replies: { test: (q: string) => boolean; title: string; text: string }[] = [
  {
    test: (q) => q.includes("need to do") || q.includes("my action") || q.includes("assigned to me"),
    title: "Your action",
    text: "Review the accountant email by Friday 2 October. Amira wants plain English, the filing date of 16 October, and no mention of feature flags. Jordan attached the draft in the Teams chat at 10:31. Nothing else from this meeting is assigned to you.",
  },
  {
    test: (q) => q.includes("receipt") || q.includes("capture") || q.includes("paused") || q.includes("scan"),
    title: "Why receipt capture moved",
    text: "Owen demoed it at 10:18. It reads clean photos, but it fails on crumpled petrol receipts. Helen has three practices waiting, and Jordan said it is not ready for October. It moves to the November release. Nobody asked for design changes.",
  },
  {
    test: (q) => q.includes("vat") || q.includes("on track") || q.includes("filing") || q.includes("sandbox"),
    title: "The VAT return",
    text: "Yes. It ships on Thursday 16 October. Live filing stays switched off until Amira signs off the HMRC sandbox, which she is testing by Wednesday 7 October. Your email is for the accountants. It does not block the filing.",
  },
  {
    test: (q) => q.includes("miss") || q.includes("catch") || q.includes("summary"),
    title: "The one-minute version",
    text: "The October VAT return goes out on 16 October. Live filing stays off until Finance signs off the sandbox. Receipt capture is paused until November. Your only job is to review the accountant email by Friday 2 October.",
  },
];

const fallback =
  "This recording does not cover that. The standup was about the 16 October VAT return, pausing receipt capture, and the accountant email. Try one of the suggested questions.";

function replyFor(question: string): Answer {
  const q = question.toLowerCase().replace(/[?!.]/g, "").trim();
  if (!q) {
    return {
      variant: "warning",
      title: "Ask something",
      text: "Type a question, or pick one of the suggestions.",
    };
  }
  const found = replies.find((reply) => reply.test(q));
  if (!found) {
    return { variant: "ai", title: "Not in this recording", text: fallback };
  }
  return { variant: "ai", title: found.title, text: found.text };
}

/**
 * Playground: Team 07
 * One-minute catch-up for a missed Teams recording.
 */
export default function Team07Playground() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [approval, setApproval] = useState<Approval>("pending");
  const [legalNote, setLegalNote] = useState("");
  const [savedNote, setSavedNote] = useState("");
  const [noteNeeded, setNoteNeeded] = useState(false);

  const openCount = actions.filter((action) => !done[action.id]).length;
  const yoursDone = Boolean(done.email);
  const summaryReleased = approval === "approved";

  const ask = (next: string) => {
    setQuestion(next);
    if (!summaryReleased) {
      setAnswer({
        variant: "warning",
        title: "Waiting for Legal",
        text: "Legal has not approved the AI summary, so answers from the recording stay hidden.",
      });
      return;
    }
    setAnswer(replyFor(next));
  };

  const approveSummary = () => {
    setSavedNote(legalNote.trim());
    setNoteNeeded(false);
    setApproval("approved");
    setAnswer(null);
  };

  const sendBack = () => {
    const note = legalNote.trim();
    if (!note) {
      setNoteNeeded(true);
      return;
    }
    setSavedNote(note);
    setNoteNeeded(false);
    setApproval("returned");
    setAnswer(null);
  };

  const resubmit = () => {
    setLegalNote("");
    setNoteNeeded(false);
    setApproval("pending");
    setAnswer(null);
  };

  return (
    <Box p={4} display="flex" flexDirection="column" gap={3} maxWidth="880px">
      <Box display="flex" flexDirection="column" gap={1}>
        <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
          <Pill variant="orange">Missed</Pill>
          {summaryReleased ? <Pill variant="blue">1 minute read</Pill> : null}
          <Pill variant={approval === "approved" ? "green" : approval === "returned" ? "red" : "orange"}>
            {approval === "approved" ? "Approved by Legal" : approval === "returned" ? "Sent back by Legal" : "Awaiting legal approval"}
          </Pill>
          <Pill variant="green">3 decisions</Pill>
          <Pill variant={yoursDone ? "green" : "orange"}>{yoursDone ? "Your action is done" : "1 action for you"}</Pill>
        </Box>
        <Typography variant="h1" m={0}>
          Catch-up
        </Typography>
        <Typography m={0}>
          {summaryReleased
            ? "You missed the meeting. This is the one-minute version."
            : "You missed the meeting. The AI summary stays with Legal until it is approved."}
        </Typography>
        <Typography variant="strong" m={0}>
          Making Tax Digital standup
        </Typography>
        <Typography variant="small" color="subtle" m={0}>
          Tuesday 29 September 2026 · 10:00–10:42 · Teams recording
        </Typography>
      </Box>

      <Box display="flex" gap={3} flexWrap="wrap">
        {people.map((person) => (
          <Box key={person.initials} display="flex" gap={1} alignItems="center">
            <Portrait initials={person.initials} size="M" />
            <Box>
              <Typography variant="strong" display="block" m={0}>
                {person.name}
              </Typography>
              <Typography variant="small" color="subtle" display="block" m={0}>
                {person.role}
              </Typography>
            </Box>
            {person.absent ? <Pill variant="grey">Absent</Pill> : null}
          </Box>
        ))}
      </Box>

      <Tile orientation="vertical">
        <TileContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <Box display="flex" gap={2} alignItems="center" justifyContent="space-between" flexWrap="wrap">
              <Box display="flex" gap={1} alignItems="center">
                <Portrait initials="PN" size="M" />
                <Box>
                  <Typography variant="h2" display="block" m={0}>
                    Legal approval
                  </Typography>
                  <Typography variant="small" color="subtle" display="block" m={0}>
                    Priya Nair · Legal
                  </Typography>
                </Box>
              </Box>
              <Pill variant={approval === "approved" ? "green" : approval === "returned" ? "red" : "orange"}>
                {approval === "approved" ? "Approved" : approval === "returned" ? "Sent back" : "Awaiting approval"}
              </Pill>
            </Box>
            {summaryReleased ? (
              <Message variant="success" title="Legal approved this AI summary">
                Priya Nair approved it on 30 September 2026.
                {savedNote ? ` Note: ${savedNote}` : " The one-minute summary is now released."}
              </Message>
            ) : (
              <Message variant={approval === "returned" ? "error" : "warning"} title="Not released">
                Legal will not allow this AI summary until it has been approved. Decisions and action items stay
                available.
                {approval === "returned" ? ` Sent back: ${savedNote}` : ""}
              </Message>
            )}
            {summaryReleased ? (
              <Button
                variantType="tertiary"
                size="small"
                onClick={() => {
                  setApproval("pending");
                  setAnswer(null);
                }}
              >
                Remove approval
              </Button>
            ) : (
              <Box display="flex" flexDirection="column" gap={2}>
                <Box p={2} bg="var(--colorsUtilityMajor025)" borderRadius="borderRadius100" display="flex" flexDirection="column" gap={1}>
                  <Typography variant="small" color="subtle" display="block" m={0}>
                    Draft for review. Not released.
                  </Typography>
                  <Typography variant="strong" display="block" m={0}>
                    {oneMinute.headline}
                  </Typography>
                  <Typography display="block" m={0}>
                    {oneMinute.body}
                  </Typography>
                </Box>
                {approval === "returned" ? (
                  <Button variantType="primary" onClick={resubmit}>
                    Resubmit for approval
                  </Button>
                ) : (
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Textarea
                      label="Note for the team"
                      inputHint="Required if you send this back."
                      rows={3}
                      value={legalNote}
                      onChange={(event) => {
                        setLegalNote(event.target.value);
                        if (event.target.value.trim()) setNoteNeeded(false);
                      }}
                      error={noteNeeded ? "Add a note to explain what Legal needs changed." : undefined}
                    />
                    <Box display="flex" gap={1} flexWrap="wrap">
                      <Button variantType="primary" iconType="tick" onClick={approveSummary}>
                        Approve summary
                      </Button>
                      <Button variant="destructive" onClick={sendBack}>
                        Send back
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </TileContent>
      </Tile>

      {summaryReleased ? (
        <Box
          p={3}
          bg="var(--colorsActionMajor500)"
          borderRadius="borderRadius100"
          display="flex"
          flexDirection="column"
          gap={1}
        >
          <Typography variant="small" inverse m={0}>
            One minute
          </Typography>
          <Typography variant="h3" inverse m={0}>
            {oneMinute.headline}
          </Typography>
          <Typography inverse m={0}>
            {oneMinute.body}
          </Typography>
        </Box>
      ) : (
        <Message variant="warning" title="AI summary held">
          The one-minute summary is hidden until Priya Nair in Legal approves the draft above.
        </Message>
      )}

      <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap={3}>
        <Tile orientation="vertical">
          <TileContent>
            <Typography variant="h2" m={0}>
              Meeting summary
            </Typography>
            {summaryReleased ? (
              <Typography variant="ul">
                {summary.map((point) => (
                  <Typography as="li" key={point}>
                    {point}
                  </Typography>
                ))}
              </Typography>
            ) : (
              <Typography color="subtle" m={0}>
                Hidden until Legal approves the AI summary.
              </Typography>
            )}
          </TileContent>
        </Tile>

        <Tile orientation="vertical">
          <TileContent>
            <Typography variant="h2" m={0}>
              Decisions made
            </Typography>
            <Box display="flex" flexDirection="column" gap={2} mt={2}>
              {decisions.map((decision, index) => (
                <Box key={decision.title} display="flex" flexDirection="column" gap={2}>
                  {index > 0 ? <Divider /> : null}
                  <Box display="flex" flexDirection="column" gap={1} alignItems="flex-start">
                    <Pill variant="green">Decided</Pill>
                    <Typography variant="strong" display="block" m={0}>
                      {decision.title}
                    </Typography>
                    <Typography variant="small" color="subtle" display="block" m={0}>
                      {decision.detail}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </TileContent>
        </Tile>
      </Box>

      <Box display="flex" flexDirection="column" gap={2}>
        <Box>
          <Typography variant="h2" m={0}>
            Action items
          </Typography>
          <Typography variant="small" color="subtle" m={0}>
            {openCount} still open. Tick yours when the email review is done.
          </Typography>
        </Box>
        {yoursDone ? (
          <Message variant="success" title="You're caught up">
            The accountant email is marked done. Nothing else from this meeting needs you.
          </Message>
        ) : null}
        <FlatTable title="Action items" size="compact">
          <FlatTableHead>
            <FlatTableRow>
              <FlatTableHeader>Done</FlatTableHeader>
              <FlatTableHeader>Action</FlatTableHeader>
              <FlatTableHeader>Owner</FlatTableHeader>
              <FlatTableHeader>Due</FlatTableHeader>
            </FlatTableRow>
          </FlatTableHead>
          <FlatTableBody>
            {actions.map((action) => (
              <FlatTableRow key={action.id}>
                <FlatTableCell>
                  <Checkbox
                    id={`action-${action.id}`}
                    name={action.id}
                    label="Done"
                    checked={Boolean(done[action.id])}
                    onChange={(event) => setDone({ ...done, [action.id]: event.target.checked })}
                  />
                </FlatTableCell>
                <FlatTableCell>
                  <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                    <Typography m={0}>{action.task}</Typography>
                    {action.yours ? <Pill variant="blue">For you</Pill> : null}
                  </Box>
                </FlatTableCell>
                <FlatTableCell>{action.owner}</FlatTableCell>
                <FlatTableCell>{action.due}</FlatTableCell>
              </FlatTableRow>
            ))}
          </FlatTableBody>
        </FlatTable>
      </Box>

      <Tile orientation="vertical">
        <TileContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <Box>
              <Typography variant="h2" m={0}>
                Ask the recording
              </Typography>
              <Typography variant="small" color="subtle" m={0}>
                {summaryReleased
                  ? "One question, answered from the Teams transcript."
                  : "Questions stay closed until Legal approves the AI summary."}
              </Typography>
            </Box>
            {summaryReleased ? null : (
              <Message variant="warning" title="Waiting for Legal">
                Ask the recording after the summary is approved.
              </Message>
            )}
            <Textbox
              label="Your question"
              inputHint="Ask in your own words, or use a suggestion."
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              disabled={!summaryReleased}
            />
            <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
              <Button
                variant="gradient"
                variantType="primary"
                iconType="chat"
                onClick={() => ask(question)}
                disabled={!summaryReleased}
              >
                Ask
              </Button>
              {suggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variantType="tertiary"
                  size="small"
                  onClick={() => ask(suggestion)}
                  disabled={!summaryReleased}
                >
                  {suggestion}
                </Button>
              ))}
            </Box>
            {answer ? (
              <Message variant={answer.variant} title={answer.title}>
                {answer.text}
              </Message>
            ) : null}
          </Box>
        </TileContent>
      </Tile>
    </Box>
  );
}
