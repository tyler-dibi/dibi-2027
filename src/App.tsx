import { useState } from "react";

import Box from "carbon-react/lib/components/box";
import Button from "carbon-react/lib/components/button/__next__";
import { Checkbox } from "carbon-react/lib/components/checkbox";
import Dialog from "carbon-react/lib/components/dialog";
import Pill from "carbon-react/lib/components/pill";
import Typography from "carbon-react/lib/components/typography";

import { followUpMessage, items, meeting, questions, type MeetingItem, type Tone } from "./data";

const dotColor: Record<Tone, string> = {
  sam: "var(--colorsActionMajor500)",
  other: "var(--colorsUtilityMajor300)",
  unclear: "var(--colorsSemanticCaution500)",
};

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [draftOpen, setDraftOpen] = useState(false);
  const [clarificationRequested, setClarificationRequested] = useState(false);
  const [questionId, setQuestionId] = useState<string | null>(null);

  const selected = items.find((item) => item.id === selectedId);
  const answer = questions.find((question) => question.id === questionId);

  return (
    <Box p={4} maxWidth="960px" margin="0 auto">
      <Box display="flex" alignItems="center" flexWrap="wrap" gap={2} mb={3}>
        <Typography variant="h1" m={0}>
          {meeting.title}
        </Typography>
        <Typography variant="p" m={0}>
          {meeting.date}
        </Typography>
        <Pill variant="orange">Missed</Pill>
      </Box>

      <Box mb={3}>
        <Typography variant="h2">{meeting.hero}</Typography>
        <Typography variant="p">{meeting.summary}</Typography>
      </Box>

      <Timeline selectedId={selectedId} onSelect={setSelectedId} />
      <Typography variant="p" m={0}>
        {selected ? `${selected.time} — ${selected.summary}` : "Choose a dot to see that moment."}
      </Typography>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
          marginTop: 32,
        }}
      >
        <Column title="Affects you" items={items.filter((item) => item.column === "you")} done={done} setDone={setDone} clarificationRequested={clarificationRequested} onDraft={() => setDraftOpen(true)} />
        <Column title="FYI" items={items.filter((item) => item.column === "fyi")} done={done} setDone={setDone} clarificationRequested={clarificationRequested} onDraft={() => setDraftOpen(true)} />
      </div>

      <Box mt={4}>
        <Typography variant="h2">Ask about this meeting</Typography>
        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          {questions.map((question) => (
            <Pill key={question.id} onClick={() => setQuestionId(question.id)}>
              {question.label}
            </Pill>
          ))}
        </Box>
        {answer && (
          <Box>
            <Typography variant="p" m={0}>
              {answer.answer}
            </Typography>
            <Typography variant="small" m={0}>
              {answer.time}
            </Typography>
          </Box>
        )}
      </Box>

      <Dialog open={draftOpen} onCancel={() => setDraftOpen(false)} title="Draft follow-up" size="medium-small">
        <Typography variant="p">{followUpMessage}</Typography>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            variantType="primary"
            onClick={() => {
              setClarificationRequested(true);
              setDraftOpen(false);
            }}
          >
            Send
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}

function Timeline({ selectedId, onSelect }: { selectedId: string | null; onSelect: (id: string) => void }) {
  return (
    <div style={{ position: "relative", height: 32, margin: "8px 12px 16px" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          height: 4,
          transform: "translateY(-50%)",
          background: "var(--colorsUtilityMajor100)",
          borderRadius: 999,
        }}
      />
      {items.map((item) => {
        const selected = item.id === selectedId;
        return (
          <button
            key={item.id}
            type="button"
            aria-label={`${item.time}. ${item.summary}`}
            aria-pressed={selected}
            onClick={() => onSelect(item.id)}
            style={{
              position: "absolute",
              left: `${(item.seconds / meeting.durationSeconds) * 100}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 16,
              height: 16,
              padding: 0,
              borderRadius: "50%",
              border: selected ? "2px solid var(--colorsUtilityYin090)" : "2px solid var(--colorsUtilityYang100)",
              background: dotColor[item.tone],
              cursor: "pointer",
            }}
          />
        );
      })}
    </div>
  );
}

function Column({
  title,
  items: columnItems,
  done,
  setDone,
  clarificationRequested,
  onDraft,
}: {
  title: string;
  items: MeetingItem[];
  done: Record<string, boolean>;
  setDone: (next: Record<string, boolean>) => void;
  clarificationRequested: boolean;
  onDraft: () => void;
}) {
  const actions = columnItems.filter((item) => item.kind === "action");
  const decisions = columnItems.filter((item) => item.kind === "decision");

  return (
    <Box>
      <Typography variant="h3">{title}</Typography>
      {actions.map((item) => (
        <Box key={item.id} mb={2}>
          <Checkbox
            id={item.id}
            name={item.id}
            label={item.task ?? ""}
            checked={Boolean(done[item.id])}
            onChange={(event) => setDone({ ...done, [item.id]: event.target.checked })}
          />
          <Typography variant="small" m={0}>
            {item.owner ?? "No owner"}
            {item.due ? ` · Due ${item.due}` : ""}
          </Typography>
          {item.tone === "unclear" &&
            (clarificationRequested ? (
              <Box mt={1}>
                <Pill variant="blue">Clarification requested</Pill>
              </Box>
            ) : (
              <Box display="flex" flexWrap="wrap" alignItems="center" gap={1} mt={1}>
                <Pill variant="orange">Needs clarifying</Pill>
                <Button variantType="secondary" size="small" onClick={onDraft}>
                  Draft follow-up
                </Button>
              </Box>
            ))}
        </Box>
      ))}
      {decisions.map((item) => (
        <Typography key={item.id} variant="p">
          {item.statement}
        </Typography>
      ))}
    </Box>
  );
}
