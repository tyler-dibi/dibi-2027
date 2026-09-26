import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ActionPopover,
  ActionPopoverItem,
  ActionPopoverMenuButton,
} from "carbon-react/lib/components/action-popover";
import Box from "carbon-react/lib/components/box";
import Button from "carbon-react/lib/components/button/__next__";
import Icon, { type IconType } from "carbon-react/lib/components/icon";
import Message from "carbon-react/lib/components/message";
import Pill from "carbon-react/lib/components/pill";
import { Tile } from "carbon-react/lib/components/tile";
import Typography from "carbon-react/lib/components/typography";

import { catalog } from "../catalog/catalog";
import NewPlaygroundDialog from "../app/NewPlaygroundDialog";
import { playgrounds } from "../app/playground-registry";
import { isPublished } from "../app/publishing";

const steps: { icon: IconType; title: string; body: string }[] = [
  {
    icon: "card_view",
    title: "1. Pick your components",
    body: "Browse every Carbon component on the Components page. Hit copy to grab a component's name for your prompt.",
  },
  {
    icon: "plus_circle",
    title: "2. Start a playground",
    body: "Each playground is a blank page (a file in src/playgrounds/) that you design by prompting the Cursor agent.",
  },
  {
    icon: "chat",
    title: "3. Prompt, review, iterate",
    body: "Describe the experience you want. The agent builds it with real Carbon components, and the page updates live here.",
  },
];

const examplePrompts = [
  "In my playground, build an invoice list using FlatTable with a Search above it and a Pager below.",
  "Add a Dialog with a Form (Textbox, Date, Select) to create a new customer.",
  "Turn this page into a 3-step onboarding flow using StepFlow and OptionTile.",
];

export default function HomePage() {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const componentCount = catalog.filter((c) => !c.deprecated).length;

  return (
    <Box p={6} maxWidth="1200px" mx="auto">
      <Box mb={5}>
        <Box mb={2}>
          <Pill variant="blue">Carbon by Sage · design in the browser</Pill>
        </Box>
        <Typography variant="h1-large" mb={2}>
          Design with real Carbon components
        </Typography>
        <Typography variant="p" size="L" m={0}>
          Carbon Playground lets designers build experiences and prototypes directly in the browser, using the
          production components from Carbon by Sage. No design-to-code handover: what you design here is real,
          working UI.
        </Typography>
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(280px, 1fr))" gap={3} mb={5}>
        {steps.map((s, i) => (
          <Tile key={s.title} p={3} height="100%" orientation="vertical">
            <Box display="flex" flexDirection="column" gap={1} height="100%">
              <Icon type={s.icon} size="large" />
              <Typography variant="h3" m={0}>
                {s.title}
              </Typography>
              <Typography m={0}>{s.body}</Typography>
              <Box mt="auto" pt={2}>
                {i === 0 && (
                  <Button variantType="secondary" iconType="card_view" onClick={() => navigate("/components")}>
                    Browse {componentCount} components
                  </Button>
                )}
                {i === 1 && !isPublished && (
                  <Button variantType="primary" iconType="plus" onClick={() => setDialogOpen(true)}>
                    New playground
                  </Button>
                )}
                {i === 2 &&
                  (playgrounds.length > 0 ? (
                    <ActionPopover
                      ml={0}
                      renderButton={(props) => (
                        <ActionPopoverMenuButton
                          buttonType="secondary"
                          iconType="dropdown"
                          iconPosition="after"
                          {...props}
                        >
                          Open a playground
                        </ActionPopoverMenuButton>
                      )}
                    >
                      {playgrounds.map((p) => (
                        <ActionPopoverItem
                          key={p.slug}
                          icon="page"
                          onClick={() => navigate(`/playground/${p.slug}`)}
                        >
                          {p.title}
                        </ActionPopoverItem>
                      ))}
                    </ActionPopover>
                  ) : (
                    <Button variantType="secondary" disabled>
                      No playgrounds yet
                    </Button>
                  ))}
              </Box>
            </Box>
          </Tile>
        ))}
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(340px, 1fr))" gap={3}>
        <Tile p={3} orientation="vertical">
          <Typography variant="h3" mb={2}>
            Try prompts like…
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            {examplePrompts.map((p) => (
              <Box key={p} display="flex" gap={1} alignItems="flex-start">
                <Icon type="chat_notes" />
                <Typography m={0}>{p}</Typography>
              </Box>
            ))}
          </Box>
        </Tile>

        <Tile p={3} orientation="vertical">
          <Typography variant="h3" mb={2}>
            The one rule
          </Typography>
          <Message variant="info" mb={2}>
            Only Carbon by Sage components are allowed. No IBM Carbon, no other UI libraries, no custom HTML or CSS.
          </Message>
          <Typography m={0}>
            The Cursor agent is set up to follow this rule, and the linter blocks anything that breaks it. If a
            pattern isn't possible with Carbon, the agent will say so rather than inventing something.
          </Typography>
        </Tile>
      </Box>

      <NewPlaygroundDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </Box>
  );
}
