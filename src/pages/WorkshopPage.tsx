import { Fragment } from "react";

import { Accordion } from "carbon-react/lib/components/accordion";
import Box from "carbon-react/lib/components/box";
import Divider from "carbon-react/lib/components/divider";
import {
  FlatTable,
  FlatTableBody,
  FlatTableCell,
  FlatTableHead,
  FlatTableHeader,
  FlatTableRow,
} from "carbon-react/lib/components/flat-table";
import Icon, { type IconType } from "carbon-react/lib/components/icon";
import Link from "carbon-react/lib/components/link";
import Message from "carbon-react/lib/components/message";
import Pill from "carbon-react/lib/components/pill";
import { Tile } from "carbon-react/lib/components/tile";
import Typography from "carbon-react/lib/components/typography";

const SITE_DOMAIN = "carbon-playground.pages.dev";

const teams = Array.from({ length: 14 }, (_, i) => {
  const number = String(i + 1).padStart(2, "0");
  return { name: `Team ${number}`, branch: `team-${number}`, url: `https://team-${number}.${SITE_DOMAIN}` };
});

const gettingStarted: { icon: IconType; title: string; body: string }[] = [
  {
    icon: "link",
    title: "Open Cursor in the browser",
    body: "Go to cursor.com/agents and sign in with the DIBI login on your table card.",
  },
  {
    icon: "arrow_right",
    title: "Pick your team's branch",
    body: "Choose the dibi-2027 repo and your team's branch, for example team-03. Your starter playground is already there.",
  },
  {
    icon: "chat",
    title: "Start prompting",
    body: 'Describe what you want in plain English, e.g. "Read our brief and build a first version of it in the Team 03 playground."',
  },
  {
    icon: "view",
    title: "See it live",
    body: "Open your team link below. It updates about a minute after each change, and it's what you'll present from.",
  },
];

const whatToBring = [
  "Nothing to install and no accounts to create — your table shares one Cursor login",
  "One laptop per table with an up-to-date web browser, plus its charger",
  "Your ideas: everyone contributes prompts, reviews and decisions, not just the person typing",
  "Optional: personal hotspot — conference Wi‑Fi can be slow",
];

const schedule = [
  { duration: "15 min", title: "Frame the context", body: "Why design-in-code is different now." },
  { duration: "10 min", title: "Case study", body: "Sage Copilot and moving between roles on one project." },
  { duration: "5 min", title: "Teams & archetypes", body: "Mixed tables; each person picks a role for the build." },
  { duration: "15 min", title: "Live demo", body: "Prompt → layout → component → shipped. Just watch for now." },
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
    body: "Drives the laptop — types the team's prompts into Cursor and keeps the build moving.",
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
        <Typography variant="h2" mb={1}>
          Getting started at your table
        </Typography>
        <Typography mb={2}>
          Everything runs in the browser. Your table card has your team number and the login details.
        </Typography>
        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))" gap={2}>
          {gettingStarted.map((s, i) => (
            <Tile key={s.title} p={3} height="100%" orientation="vertical">
              <Box display="flex" flexDirection="column" gap={1}>
                <Icon type={s.icon} size="large" />
                <Typography variant="h3" m={0}>
                  {i + 1}. {s.title}
                </Typography>
                <Typography m={0}>{s.body}</Typography>
              </Box>
            </Tile>
          ))}
        </Box>
      </Box>

      <Box>
        <Typography variant="h2" mb={1}>
          Team links
        </Typography>
        <Typography mb={2}>
          If your browser asks for a username and password when you open your link, use the site login on your table
          card.
        </Typography>
        <FlatTable size="compact">
          <FlatTableHead>
            <FlatTableRow>
              <FlatTableHeader>Team</FlatTableHeader>
              <FlatTableHeader>Branch</FlatTableHeader>
              <FlatTableHeader>Live prototype</FlatTableHeader>
            </FlatTableRow>
          </FlatTableHead>
          <FlatTableBody>
            {teams.map((t) => (
              <FlatTableRow key={t.branch}>
                <FlatTableCell>{t.name}</FlatTableCell>
                <FlatTableCell>{t.branch}</FlatTableCell>
                <FlatTableCell>
                  <Link href={t.url} target="_blank">
                    {t.url.replace("https://", "")}
                  </Link>
                </FlatTableCell>
              </FlatTableRow>
            ))}
          </FlatTableBody>
        </FlatTable>
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
            What you'll need
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
            Still stuck? Put your hand up and we&apos;ll come to your table.
          </Message>
          <Accordion size="small" title="The Cursor sign-in isn't working">
            <Typography m={0}>
              Make sure you&apos;re on{" "}
              <Link href="https://cursor.com/agents" target="_blank">
                cursor.com/agents
              </Link>{" "}
              and copy the email and password exactly as they appear on your table card. You don&apos;t need your own
              Cursor account.
            </Typography>
          </Accordion>
          <Accordion size="small" title="I can't find our team's branch">
            <Typography m={0}>
              Check you&apos;ve picked the dibi-2027 repo, then type your team number (for example team-03) in the
              branch list. If it&apos;s still not there, mention your team in the prompt, e.g. &quot;We&apos;re Team
              03&quot;, and the agent will work on the right branch.
            </Typography>
          </Accordion>
          <Accordion size="small" title="Our live link hasn't changed">
            <Typography m={0}>
              Wait a minute and refresh the page. Changes only appear once the agent has finished and published. If
              you&apos;re not sure it has, ask it: &quot;Is this live on our team link yet?&quot;
            </Typography>
          </Accordion>
          <Accordion size="small" title="Conference Wi‑Fi isn't working">
            <Typography m={0}>
              Use a personal hotspot if you have one. Your table only needs one working connection to build — not
              every person.
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
