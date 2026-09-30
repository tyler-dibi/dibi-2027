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

  const openCount = actions.filter((action) => !done[action.id]).length;
  const yoursDone = Boolean(done.email);

  const ask = (next: string) => {
    setQuestion(next);
    setAnswer(replyFor(next));
  };

  return (
    <Box p={4} display="flex" flexDirection="column" gap={3} maxWidth="880px">
      <Box display="flex" flexDirection="column" gap={1}>
        <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
          <Pill variant="orange">Missed</Pill>
          <Pill variant="blue">1 minute read</Pill>
          <Pill variant="green">3 decisions</Pill>
          <Pill variant={yoursDone ? "green" : "orange"}>{yoursDone ? "Your action is done" : "1 action for you"}</Pill>
        </Box>
        <Typography variant="h1" m={0}>
          Catch-up
        </Typography>
        <Typography m={0}>You missed the meeting. This is the one-minute version.</Typography>
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
              <Typography variant="strong" m={0}>
                {person.name}
              </Typography>
              <Typography variant="small" color="subtle" m={0}>
                {person.role}
              </Typography>
            </Box>
            {person.absent ? <Pill variant="grey">Absent</Pill> : null}
          </Box>
        ))}
      </Box>

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
          The October VAT return is on. Receipt capture is off. You have one email to review.
        </Typography>
        <Typography inverse m={0}>
          The return goes out on 16 October. Live filing stays off until Finance signs off the HMRC sandbox. Receipt
          capture is paused until November, so it is out of this release. Your only job is to review the accountant
          email by Friday 2 October.
        </Typography>
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap={3}>
        <Tile orientation="vertical">
          <TileContent>
            <Typography variant="h2" m={0}>
              Meeting summary
            </Typography>
            <Typography variant="ul">
              {summary.map((point) => (
                <Typography as="li" key={point}>
                  {point}
                </Typography>
              ))}
            </Typography>
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
                  <Box display="flex" justifyContent="space-between" gap={2} alignItems="flex-start">
                    <Box>
                      <Typography variant="strong" m={0}>
                        {decision.title}
                      </Typography>
                      <Typography variant="small" color="subtle" m={0}>
                        {decision.detail}
                      </Typography>
                    </Box>
                    <Pill variant="green">Decided</Pill>
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
                One question, answered from the Teams transcript.
              </Typography>
            </Box>
            <Textbox
              label="Your question"
              inputHint="Ask in your own words, or use a suggestion."
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
            />
            <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
              <Button variant="gradient" variantType="primary" iconType="chat" onClick={() => ask(question)}>
                Ask
              </Button>
              {suggestions.map((suggestion) => (
                <Button key={suggestion} variantType="tertiary" size="small" onClick={() => ask(suggestion)}>
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
