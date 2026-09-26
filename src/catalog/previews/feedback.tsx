import Badge from "carbon-react/lib/components/badge";
import Box from "carbon-react/lib/components/box";
import Button from "carbon-react/lib/components/button/__next__";
import Help from "carbon-react/lib/components/help";
import Loader from "carbon-react/lib/components/loader/__next__";
import LoaderBar from "carbon-react/lib/components/loader-bar";
import { LoaderSpinner } from "carbon-react/lib/components/loader-spinner";
import LoaderStar from "carbon-react/lib/components/loader-star";
import Message from "carbon-react/lib/components/message";
import Pill from "carbon-react/lib/components/pill";
import Preview from "carbon-react/lib/components/preview";
import ProgressTracker from "carbon-react/lib/components/progress-tracker";
import Typography from "carbon-react/lib/components/typography";

import type { CatalogEntry } from "../types";

export const feedback: CatalogEntry[] = [
  {
    name: "Message",
    folder: "message",
    category: "Feedback & status",
    description: "Inline message for info, success, warning and error states.",
    Preview: () => (
      <Box display="flex" flexDirection="column" gap={1} width="100%">
        <Message variant="info">Your changes will sync overnight.</Message>
        <Message variant="success">Invoice sent to customer.</Message>
        <Message variant="warning">This bank feed needs reconnecting.</Message>
        <Message variant="error">Payment failed. Check the card details.</Message>
      </Box>
    ),
  },
  {
    name: "Badge",
    folder: "badge",
    category: "Feedback & status",
    description: "Small count indicator, usually attached to a button.",
    Preview: () => (
      <Box display="flex" gap={3} alignItems="center">
        <Badge counter={5}>
          <Button variantType="secondary" iconType="alert">
            Notifications
          </Button>
        </Badge>
        <Badge counter={120}>
          <Button variantType="secondary" iconType="email">
            Inbox
          </Button>
        </Badge>
      </Box>
    ),
  },
  {
    name: "Pill",
    folder: "pill",
    category: "Feedback & status",
    description: "Compact status label or removable tag. Colour via `variant`, solid via `fill`.",
    Preview: () => (
      <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center" maxWidth="320px">
        <Pill variant="green">Paid</Pill>
        <Pill variant="orange">Due soon</Pill>
        <Pill variant="red">Overdue</Pill>
        <Pill variant="grey">Draft</Pill>
        <Pill variant="blue" fill>
          New
        </Pill>
        <Pill variant="purple" onDelete={() => {}}>
          Removable tag
        </Pill>
      </Box>
    ),
  },
  {
    name: "Loader",
    folder: "loader",
    next: true,
    category: "Feedback & status",
    description: "Loading indicator. Choose `loaderType` (standalone, ring, star), `variant` and `size`.",
    Preview: () => (
      <Box display="flex" gap={4} alignItems="center">
        <Loader loaderLabel="Loading" showLabel />
        <Loader loaderType="ring" loaderLabel="Loading" showLabel />
        <Loader loaderType="star" loaderLabel="Thinking" showLabel />
      </Box>
    ),
  },
  {
    name: "LoaderBar",
    folder: "loader-bar",
    category: "Feedback & status",
    description: "Indeterminate horizontal loading bar.",
    Preview: () => (
      <Box width="80%">
        <LoaderBar size="medium" />
      </Box>
    ),
  },
  {
    name: "LoaderSpinner",
    folder: "loader-spinner",
    exports: ["LoaderSpinner"],
    category: "Feedback & status",
    description: "Circular spinner with optional label.",
    Preview: () => <LoaderSpinner spinnerLabel="Loading…" showSpinnerLabel />,
  },
  {
    name: "LoaderStar",
    folder: "loader-star",
    category: "Feedback & status",
    description: "Sage AI-style loading animation.",
    Preview: () => <LoaderStar loaderStarLabel="Thinking…" />,
  },
  {
    name: "ProgressTracker",
    folder: "progress-tracker",
    category: "Feedback & status",
    description: "Shows progress towards a goal or limit.",
    Preview: () => (
      <Box width="80%">
        <ProgressTracker progress={65} description="Storage used" currentProgressLabel="6.5 GB" maxProgressLabel="10 GB" />
      </Box>
    ),
  },
  {
    name: "Preview",
    folder: "preview",
    category: "Feedback & status",
    description: "Skeleton placeholder while content loads.",
    Preview: () => (
      <Box width="80%">
        <Preview loading lines={4} />
      </Box>
    ),
  },
  {
    name: "Help",
    folder: "help",
    category: "Feedback & status",
    description: "Question-mark icon that reveals help text on hover or focus.",
    Preview: () => (
      <Box display="flex" alignItems="center" gap={1}>
        <Typography m={0}>VAT scheme</Typography>
        <Help>Choose the VAT scheme registered with HMRC.</Help>
      </Box>
    ),
  },
];
