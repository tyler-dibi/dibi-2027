import { useState } from "react";

import { Accordion } from "carbon-react/lib/components/accordion";
import Box from "carbon-react/lib/components/box";
import Button from "carbon-react/lib/components/button/__next__";
import { Checkbox } from "carbon-react/lib/components/checkbox";
import Dialog from "carbon-react/lib/components/dialog";
import FileInput from "carbon-react/lib/components/file-input";
import Icon from "carbon-react/lib/components/icon";
import Image from "carbon-react/lib/components/image";
import Link from "carbon-react/lib/components/link";
import Loader from "carbon-react/lib/components/loader/__next__";
import { MenuFullscreen, MenuItem } from "carbon-react/lib/components/menu";
import Message from "carbon-react/lib/components/message";
import Pill from "carbon-react/lib/components/pill";
import Textarea from "carbon-react/lib/components/textarea";
import Textbox from "carbon-react/lib/components/textbox";
import { Tile } from "carbon-react/lib/components/tile";
import Typography from "carbon-react/lib/components/typography";

import {
  answerQuestion,
  buildBrief,
  isVideoFile,
  refreshFromCues,
  sampleBrief,
  stitchLabel,
  type ActionItem,
  type MeetingBrief,
} from "./_team-06-meeting";

export const meta = {
  title: "Your meeting",
};

function scrollToId(id: string) {
  window.setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 80);
}

export default function Team06Playground() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [phase, setPhase] = useState<"upload" | "reading" | "ready">("upload");
  const [uploadKey, setUploadKey] = useState(0);
  const [error, setError] = useState("");
  const [videoName, setVideoName] = useState("");
  const [brief, setBrief] = useState<MeetingBrief | null>(null);
  const [summary, setSummary] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [activeCue, setActiveCue] = useState("");
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asked, setAsked] = useState(false);
  const [circulateOpen, setCirculateOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [printAction, setPrintAction] = useState<ActionItem | null>(null);
  const [queued, setQueued] = useState<Record<string, boolean>>({});

  const reset = () => {
    setPhase("upload");
    setUploadKey((key) => key + 1);
    setError("");
    setVideoName("");
    setBrief(null);
    setSummary([]);
    setEditing(false);
    setTranscriptOpen(false);
    setActiveCue("");
    setDone({});
    setQuestion("");
    setAnswer("");
    setAsked(false);
    setCirculateOpen(false);
    setSent(false);
    setPrintAction(null);
    setQueued({});
  };

  const showBrief = (next: MeetingBrief) => {
    setBrief(next);
    setSummary(next.summary);
    setEditing(false);
    setTranscriptOpen(false);
    setActiveCue("");
    setDone({});
    setQuestion("");
    setAnswer("");
    setAsked(false);
    setSent(false);
    setPrintAction(null);
    setQueued({});
    setError("");
    setPhase("ready");
  };

  const updateCue = (cueId: string, text: string) => {
    setBrief((current) => {
      if (!current) return current;
      const cues = current.cues.map((cue) => (cue.id === cueId ? { ...cue, text } : cue));
      return refreshFromCues(current, cues);
    });
  };

  const readTranscript = (file: File, attachedVideo?: string) => {
    setPhase("reading");
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      window.setTimeout(() => {
        const next = buildBrief(text, file.name, attachedVideo);
        if (next.cues.length === 0) {
          setPhase("upload");
          setError("That file had no transcript text. Try a .txt or .vtt file.");
          return;
        }
        showBrief(next);
      }, 700);
    };
    reader.onerror = () => {
      setPhase("upload");
      setError("That file could not be read. Try a .txt or .vtt transcript.");
    };
    reader.readAsText(file);
  };

  const onFiles = (files: FileList) => {
    const file = files.item(0);
    if (!file) return;
    if (isVideoFile(file)) {
      setVideoName(file.name);
      setError("");
      return;
    }
    readTranscript(file, videoName || undefined);
  };

  const openCue = (cueId: string) => {
    setActiveCue(cueId);
    setTranscriptOpen(true);
    window.setTimeout(() => {
      document.getElementById(cueId)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, transcriptOpen ? 60 : 280);
  };

  const ask = () => {
    if (!brief || asked || !question.trim()) return;
    setAnswer(answerQuestion(brief, question.trim()));
    setAsked(true);
  };

  const saveSummary = () => {
    setSummary(summary.map((item) => item.trim()).filter(Boolean).slice(0, 5));
    setEditing(false);
  };

  const closeMenu = () => setMenuOpen(false);

  const attendees = brief?.attendees ?? [];
  const recipientList = attendees.length > 0 ? attendees.join(", ") : "everyone who was in the meeting";

  return (
    <Box bg="var(--colorsUtilityMajor025)" display="flex" justifyContent="center" minHeight="100%">
      <Box
        width="100%"
        maxWidth="440px"
        bg="var(--colorsUtilityYang100)"
        boxSizing="border-box"
        boxShadow="boxShadow050"
        p={3}
        display="flex"
        flexDirection="column"
        gap={3}
      >
        <Box display="flex" justifyContent="flex-end">
          <Button aria-label="Open menu" iconType="list_view" variantType="tertiary" onClick={() => setMenuOpen(true)} />
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Icon type="people" size="large" aria-hidden />
          <Typography variant="h1" m={0}>
            YOUR MEETING
          </Typography>
        </Box>

        {brief ? (
          <Box>
            <Typography variant="strong" m={0}>
              {brief.title}
            </Typography>
            <Typography color="subtle" m={0}>
              {brief.whenLabel}. Actions below are for Jen.
            </Typography>
          </Box>
        ) : (
          <Typography color="subtle" m={0}>
            I missed the meeting. Catch me up in one minute.
          </Typography>
        )}

        {sent && (
          <Message variant="success" title="Catch-up sent" onDismiss={() => setSent(false)}>
            Circulated to {recipientList}.
          </Message>
        )}

        {phase !== "ready" && (
          <Tile orientation="vertical" p={3} width="100%">
            <Box display="flex" flexDirection="column" gap={2}>
              <Typography variant="h3" m={0}>
                Start with a recording
              </Typography>
              <Typography m={0}>
                Upload a transcript, or a video and then its transcript. The summary, decisions and your actions are built from that file.
              </Typography>
              {videoName && (
                <Message variant="info" title="Video attached">
                  {videoName} is ready. Add the transcript to turn it into actions.
                </Message>
              )}
              {error && <Message variant="error">{error}</Message>}
              {phase === "reading" ? (
                <Loader variant="ai" loaderLabel="Reading the transcript" showLabel />
              ) : (
                <FileInput
                  key={uploadKey}
                  label="Upload a transcript or video"
                  inputHint="TXT, VTT or SRT transcript, or an MP4 recording."
                  accept=".txt,.vtt,.srt,.md,text/plain,video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
                  buttonText="Choose file"
                  dragAndDropText="or drop it here"
                  isVertical
                  onChange={onFiles}
                />
              )}
              <Button
                variantType="secondary"
                fullWidth
                iconType="play"
                onClick={() => showBrief(sampleBrief(videoName || undefined))}
              >
                Use the Grower sample
              </Button>
            </Box>
          </Tile>
        )}

        {brief && phase === "ready" && (
          <>
            <Box id="summary">
              <Tile orientation="vertical" p={3} width="100%">
                <Box display="flex" flexDirection="column" gap={2}>
                  <Typography variant="h3" m={0}>
                    Summary
                  </Typography>
                  {editing ? (
                    <Box display="flex" flexDirection="column" gap={2}>
                      {summary.map((item, index) => (
                        <Textarea
                          key={`summary-${index}`}
                          label={`Point ${index + 1}`}
                          value={item}
                          rows={3}
                          onChange={(event) => {
                            const next = [...summary];
                            next[index] = event.target.value;
                            setSummary(next);
                          }}
                        />
                      ))}
                      <Button variantType="primary" fullWidth onClick={saveSummary}>
                        Save summary
                      </Button>
                    </Box>
                  ) : summary.length > 0 ? (
                    <Typography variant="ul" m={0}>
                      {summary.map((item) => (
                        <Typography key={item} as="li" mb={1}>
                          {item}
                        </Typography>
                      ))}
                    </Typography>
                  ) : (
                    <Typography m={0}>Nothing in that transcript could be summarised in five points.</Typography>
                  )}
                </Box>
              </Tile>
            </Box>

            <Box id="transcript">
              <Accordion
                title={brief.videoName ? "Full transcript and video" : "Full transcript"}
                subTitle={brief.videoName ? `${brief.videoName} · ${brief.cues.length} parts` : `${brief.cues.length} parts`}
                expanded={transcriptOpen}
                onChange={(_event, isExpanded) => setTranscriptOpen(isExpanded)}
              >
                <Box display="flex" flexDirection="column" gap={2}>
                  <Typography color="subtle" m={0}>
                    Edit any part. Key decisions and Jen&apos;s actions update as you type.
                  </Typography>
                  {brief.videoName && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Icon type="video" aria-hidden />
                      <Typography m={0}>{brief.videoName}</Typography>
                    </Box>
                  )}
                  {brief.cues.map((cue) => (
                    <Box key={cue.id} id={cue.id}>
                      <Tile
                        orientation="vertical"
                        p={2}
                        width="100%"
                        borderVariant={activeCue === cue.id ? "selected" : "default"}
                      >
                        <Textarea
                          label={`${cue.timeLabel} · ${cue.speaker}`}
                          value={cue.text}
                          rows={3}
                          onChange={(event) => updateCue(cue.id, event.target.value)}
                        />
                      </Tile>
                    </Box>
                  ))}
                </Box>
              </Accordion>
            </Box>

            <Box id="decisions">
              <Tile orientation="vertical" p={3} width="100%">
                <Box display="flex" flexDirection="column" gap={2}>
                  <Typography variant="h3" m={0}>
                    Key decisions
                  </Typography>
                  <Typography color="subtle" m={0}>
                    Each decision opens the moment it was made in the transcript.
                  </Typography>
                  {brief.decisions.length > 0 ? (
                    <Typography variant="ul" m={0}>
                      {brief.decisions.map((decision) => (
                        <Typography key={decision.cueId} as="li" mb={2}>
                          <Link
                            href={`#${decision.cueId}`}
                            onClick={(event) => {
                              event.preventDefault();
                              openCue(decision.cueId);
                            }}
                          >
                            {decision.text}
                          </Link>
                          <Typography color="subtle" m={0}>
                            {decision.timeLabel} in the transcript
                          </Typography>
                        </Typography>
                      ))}
                    </Typography>
                  ) : (
                    <Typography m={0}>No decision was spelled out in this transcript.</Typography>
                  )}
                </Box>
              </Tile>
            </Box>

            <Box id="embroidery">
              <Tile orientation="vertical" p={3} width="100%">
                <Box display="flex" flexDirection="column" gap={2}>
                  <Typography variant="h3" m={0}>
                    Printing the main points
                  </Typography>
                  <Typography m={0}>
                    An embroidery machine cannot take a sentence the way a printer takes a page. Each main point has to become stitches first.
                  </Typography>
                  <Typography variant="ul" m={0}>
                    <Typography as="li" mb={1}>
                      Shorten the point to about 30 characters so it fits a hoop.
                    </Typography>
                    <Typography as="li" mb={1}>
                      Digitise that line into a stitch file, usually DST or PES, with software such as Hatch, Wilcom or Ink/Stitch.
                    </Typography>
                    <Typography as="li" mb={1}>
                      Send the file to a machine that accepts a network job or a watched folder. Many shop machines only take a USB stick.
                    </Typography>
                    <Typography as="li">
                      Someone still loads the hoop, thread and fabric. This screen only previews the words.
                    </Typography>
                  </Typography>
                </Box>
              </Tile>
            </Box>

            <Box id="actions">
              <Tile orientation="vertical" p={3} width="100%">
                <Box display="flex" flexDirection="column" gap={2}>
                  <Typography variant="h3" m={0}>
                    Your actions
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="strong" m={0}>
                      Jen
                    </Typography>
                    <Pill variant="blue">You</Pill>
                  </Box>
                  <Typography color="subtle" m={0}>
                    Each label is dummy text in an image. Print queues a preview, not a real stitch file.
                  </Typography>
                  {brief.actions.length > 0 ? (
                    brief.actions.map((action) => {
                      const label = stitchLabel(action.text);
                      return (
                        <Box key={action.id} display="flex" flexDirection="column" gap={1}>
                          <Checkbox
                            name={action.id}
                            label={action.text}
                            checked={Boolean(done[action.text])}
                            onChange={(event) => setDone({ ...done, [action.text]: event.target.checked })}
                          />
                          <Image src={label.src} alt={action.text} width="100%" height={`${label.height}px`} />
                          {queued[action.text] && <Pill variant="green">Queued</Pill>}
                          <Button variantType="secondary" iconType="print" fullWidth onClick={() => setPrintAction(action)}>
                            Print
                          </Button>
                        </Box>
                      );
                    })
                  ) : (
                    <Typography m={0}>Nothing in this transcript is assigned to Jen.</Typography>
                  )}
                </Box>
              </Tile>
            </Box>

            <Box id="ask">
              <Tile orientation="vertical" p={3} width="100%">
                <Box display="flex" flexDirection="column" gap={2}>
                  <Typography variant="h3" m={0}>
                    Ask one thing
                  </Typography>
                  {asked ? (
                    <Message variant="ai" title="Catch-up">
                      {answer}
                    </Message>
                  ) : (
                    <>
                      <Typography color="subtle" m={0}>
                        One question about this meeting, then the answer stays on the page.
                      </Typography>
                      <Pill
                        variant="teal"
                        onClick={() => setQuestion("What do I need to do before Monday?")}
                      >
                        What do I need to do before Monday?
                      </Pill>
                      <Textbox
                        label="Your question"
                        value={question}
                        onChange={(event) => setQuestion(event.target.value)}
                      />
                      <Button variantType="primary" fullWidth iconType="chat" disabled={!question.trim()} onClick={ask}>
                        Ask
                      </Button>
                    </>
                  )}
                </Box>
              </Tile>
            </Box>

            <Box display="flex" flexDirection="column" gap={2}>
              <Button variantType="primary" fullWidth iconType="email" onClick={() => setCirculateOpen(true)}>
                Circulate to all
              </Button>
              <Typography textAlign="center" m={0}>
                or
              </Typography>
              <Button
                variantType="secondary"
                fullWidth
                iconType="edit"
                onClick={() => {
                  setEditing(true);
                  scrollToId("summary");
                }}
              >
                Edit
              </Button>
            </Box>
          </>
        )}
      </Box>

      <MenuFullscreen isOpen={menuOpen} onClose={closeMenu} startPosition="right" aria-label="Meeting menu">
        <MenuItem
          icon="upload"
          onClick={() => {
            closeMenu();
            reset();
          }}
        >
          Upload a recording
        </MenuItem>
        {brief && phase === "ready" && (
          <>
            <MenuItem
              icon="bullet_list"
              onClick={() => {
                closeMenu();
                scrollToId("summary");
              }}
            >
              Summary
            </MenuItem>
            <MenuItem
              icon="document_vertical_lines"
              onClick={() => {
                closeMenu();
                setTranscriptOpen(true);
                scrollToId("transcript");
              }}
            >
              Full transcript
            </MenuItem>
            <MenuItem
              icon="link"
              onClick={() => {
                closeMenu();
                scrollToId("decisions");
              }}
            >
              Key decisions
            </MenuItem>
            <MenuItem
              icon="tick"
              onClick={() => {
                closeMenu();
                scrollToId("actions");
              }}
            >
              Your actions
            </MenuItem>
            <MenuItem
              icon="email"
              onClick={() => {
                closeMenu();
                setCirculateOpen(true);
              }}
            >
              Circulate to all
            </MenuItem>
          </>
        )}
      </MenuFullscreen>

      <Dialog
        open={circulateOpen}
        onCancel={() => setCirculateOpen(false)}
        title="Circulate to all"
        size="small"
        footer={
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button variantType="tertiary" onClick={() => setCirculateOpen(false)}>
              Cancel
            </Button>
            <Button
              variantType="primary"
              iconType="email"
              onClick={() => {
                setCirculateOpen(false);
                setSent(true);
              }}
            >
              Send
            </Button>
          </Box>
        }
      >
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography m={0}>Send this one-minute catch-up to {recipientList}.</Typography>
          {summary.length > 0 && (
            <Typography variant="ul" m={0}>
              {summary.map((item) => (
                <Typography key={item} as="li" mb={1}>
                  {item}
                </Typography>
              ))}
            </Typography>
          )}
        </Box>
      </Dialog>

      <Dialog
        open={printAction != null}
        onCancel={() => setPrintAction(null)}
        title="Print label"
        size="small"
        footer={
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button variantType="tertiary" onClick={() => setPrintAction(null)}>
              Close
            </Button>
            <Button
              variantType="primary"
              iconType="print"
              onClick={() => {
                if (!printAction) return;
                setQueued({ ...queued, [printAction.text]: true });
                setPrintAction(null);
              }}
            >
              Queue preview
            </Button>
          </Box>
        }
      >
        {printAction && (
          <Box display="flex" flexDirection="column" gap={2}>
            <Image
              src={stitchLabel(printAction.text).src}
              alt={printAction.text}
              width="100%"
              height={`${stitchLabel(printAction.text).height}px`}
            />
            <Typography m={0}>
              This queues a dummy label for those words. A real machine still needs a digitised stitch file, a hoop and someone to load the thread.
            </Typography>
          </Box>
        )}
      </Dialog>
    </Box>
  );
}
