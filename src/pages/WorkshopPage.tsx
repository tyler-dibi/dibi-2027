import { Fragment } from "react";

import { Accordion } from "carbon-react/lib/components/accordion";
import Box from "carbon-react/lib/components/box";
import Divider from "carbon-react/lib/components/divider";
import Icon, { type IconType } from "carbon-react/lib/components/icon";
import Link from "carbon-react/lib/components/link";
import Message from "carbon-react/lib/components/message";
import Pill from "carbon-react/lib/components/pill";
import { Tile } from "carbon-react/lib/components/tile";
import Typography from "carbon-react/lib/components/typography";

const whatToBring = [
  "A laptop with Cursor installed and signed in (if you're on the driver path)",
  "Your charger",
  "The email address you used for Cursor — you'll need to sign in on the day",
  "Optional: phone with Cursor installed, for prompting or reviewing while someone else drives",
  "Optional: personal hotspot — conference Wi‑Fi can be slow",
];

const schedule = [
  { duration: "15 min", title: "Frame the context", body: "Why design-in-code is different now." },
  { duration: "10 min", title: "Case study", body: "Sage Copilot and moving between roles on one project." },
  { duration: "5 min", title: "Teams & archetypes", body: "Mixed tables; each person picks a role for the build." },
  { duration: "15 min", title: "Live demo", body: "Prompt → layout → component → shipped. Watch, don't install." },
  { duration: "60 min", title: "Hands-on build", body: "Your table builds one component or small flow together." },
  {
    duration: "30 min",
    title: "Share-back",
    body: "Each table shows what they built and which role they ended up in.",
  },
];

const roles: { icon: IconType; title: string; body: string }[] = [
  {
    icon: "create",
    title: "Prototyper",
    body: "Shapes the first version — describes intent, prompts the layout, gets something on screen fast.",
  },
  {
    icon: "laptop",
    title: "Builder",
    body: "Drives the laptop — runs Cursor, applies edits, keeps the build moving.",
  },
  {
    icon: "filter",
    title: "Sweeper",
    body: "Reviews what's there — simplifies copy, spacing, and clutter so the UI reads clearly.",
  },
  {
    icon: "lightbulb_on",
    title: "Grower",
    body: 'Pushes for a second iteration — "what if we tried…?" and "can we add…?"',
  },
  {
    icon: "people",
    title: "Maintainer",
    body: "Keeps the team aligned — brief, scope, and time. Makes sure everyone has a job.",
  },
];

export default function WorkshopPage() {
  return (
    <Box p={6} maxWidth="1200px" mx="auto" display="flex" flexDirection="column" gap={5}>
      <Box>
        <Box mb={2}>
          <Pill variant="blue">DIBI Conference · 30 September – 1 October 2026</Pill>
        </Box>
        <Typography variant="h1-large" mb={2}>
          Design-in-Code (Not Design-to-Code)
        </Typography>
        <Typography variant="p" size="L" mb={1}>
          What happens when designing and building become the same thing? In this hands-on workshop you&apos;ll
          prototype real interfaces together in code — using prompts, not syntax. No coding experience required.
        </Typography>
        <Typography color="subtle" m={0}>
          Tyler Hammond, UX Designer at Sage
        </Typography>
      </Box>

      <Box>
        <Typography variant="h2" mb={2}>
          How the session runs
        </Typography>
        <Tile p={3} orientation="vertical">
          <Box display="flex" flexDirection="column" gap={2}>
            {schedule.map((s, i) => (
              <Fragment key={s.title}>
                {i > 0 && <Divider type="horizontal" mt={0} mb={0} />}
                <Box display="flex" gap={3} alignItems="flex-start">
                  <Box width="80px" flexShrink={0}>
                    <Pill variant="grey">{s.duration}</Pill>
                  </Box>
                  <Box>
                    <Typography variant="strong" display="block" m={0}>
                      {i + 1}. {s.title}
                    </Typography>
                    <Typography color="subtle" m={0}>
                      {s.body}
                    </Typography>
                  </Box>
                </Box>
              </Fragment>
            ))}
          </Box>
        </Tile>
      </Box>

      <Box>
        <Typography variant="h2" mb={1}>
          Team roles (archetypes)
        </Typography>
        <Typography mb={2}>
          Each person picks a role at their table. You don&apos;t need to stay in it — the share-back is about which
          role you actually ended up in.
        </Typography>
        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={2}>
          {roles.map((r) => (
            <Tile key={r.title} p={3} height="100%" orientation="vertical">
              <Box display="flex" flexDirection="column" gap={1}>
                <Icon type={r.icon} size="large" />
                <Typography variant="h3" m={0}>
                  {r.title}
                </Typography>
                <Typography m={0}>{r.body}</Typography>
              </Box>
            </Tile>
          ))}
        </Box>
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(340px, 1fr))" gap={3}>
        <Tile p={3} orientation="vertical">
          <Typography variant="h3" mb={2}>
            What to bring
          </Typography>
          <Typography variant="ul" m={0}>
            {whatToBring.map((item) => (
              <Typography key={item} as="li" mb={1}>
                {item}
              </Typography>
            ))}
          </Typography>
        </Tile>

        <Tile p={3} orientation="vertical">
          <Typography variant="h3" mb={2}>
            Help
          </Typography>
          <Message variant="info" mb={2}>
            Still stuck? We&apos;ll pair you with a table that has a working setup. One laptop per table is enough.
          </Message>
          <Accordion size="small" title="My work laptop won't let me install Cursor">
            <Typography m={0}>
              Try the browser path instead: open{" "}
              <Link href="https://cursor.com/agents" target="_blank">
                cursor.com/agents
              </Link>
              , sign in, and start a Cloud Agent from there. If that&apos;s blocked too, choose the team path —
              you&apos;ll pair with someone at your table who can drive.
            </Typography>
          </Accordion>
          <Accordion size="small" title="Conference Wi‑Fi isn't working">
            <Typography m={0}>
              Use a personal hotspot if you have one. Your table only needs one working connection to build — not
              every person.
            </Typography>
          </Accordion>
          <Accordion size="small" title="I don't have a laptop">
            <Typography m={0}>
              Choose the team path. Every table needs only one person driving Cursor. You&apos;ll still contribute
              prompts, reviews, and decisions.
            </Typography>
          </Accordion>
          <Accordion size="small" title="Do I need to know how to code?">
            <Typography m={0}>
              No. You&apos;ll describe what you want in plain language. The Builder drives the tool; other roles
              shape, review, and iterate.
            </Typography>
          </Accordion>
        </Tile>
      </Box>
    </Box>
  );
}
