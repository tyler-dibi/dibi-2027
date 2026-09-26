import AdaptiveSidebar from "carbon-react/lib/components/adaptive-sidebar";
import Box from "carbon-react/lib/components/box";
import Button from "carbon-react/lib/components/button/__next__";
import Dialog from "carbon-react/lib/components/dialog";
import DialogFullScreen from "carbon-react/lib/components/dialog-full-screen";
import Form from "carbon-react/lib/components/form";
import PopoverContainer from "carbon-react/lib/components/popover-container";
import Sidebar from "carbon-react/lib/components/sidebar";
import Textbox from "carbon-react/lib/components/textbox";
import Typography from "carbon-react/lib/components/typography";

import OverlayDemo from "../OverlayDemo";
import type { CatalogEntry } from "../types";

export const overlays: CatalogEntry[] = [
  {
    name: "Dialog",
    folder: "dialog",
    category: "Overlays",
    description: "Modal window for focused tasks, forms, alerts and confirmations.",
    Preview: () => (
      <OverlayDemo label="Open dialog">
        {(open, close) => (
          <Dialog open={open} onCancel={close} title="Add customer" size="medium-small">
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                close();
              }}
              leftSideButtons={
                <Button variantType="tertiary" onClick={close}>
                  Cancel
                </Button>
              }
              saveButton={
                <Button variantType="primary" type="submit">
                  Save
                </Button>
              }
            >
              <Textbox label="Customer name" value="" onChange={() => {}} />
              <Textbox label="Email" value="" onChange={() => {}} />
            </Form>
          </Dialog>
        )}
      </OverlayDemo>
    ),
  },
  {
    name: "DialogFullScreen",
    folder: "dialog-full-screen",
    category: "Overlays",
    description: "Full-screen dialog for large, immersive tasks.",
    Preview: () => (
      <OverlayDemo label="Open full-screen dialog">
        {(open, close) => (
          <DialogFullScreen open={open} onCancel={close} title="Import transactions">
            <Typography>Full-screen dialog content goes here.</Typography>
          </DialogFullScreen>
        )}
      </OverlayDemo>
    ),
  },
  {
    name: "Sidebar",
    folder: "sidebar",
    category: "Overlays",
    description: "Panel that slides in from the side of the screen.",
    Preview: () => (
      <OverlayDemo label="Open sidebar">
        {(open, close) => (
          <Sidebar open={open} onCancel={close} header={<Typography variant="h3">Filters</Typography>} size="small">
            <Textbox label="Customer" value="" onChange={() => {}} />
          </Sidebar>
        )}
      </OverlayDemo>
    ),
  },
  {
    name: "AdaptiveSidebar",
    folder: "adaptive-sidebar",
    category: "Overlays",
    description: "Side panel that sits inline on large screens and becomes a modal on small screens.",
    Preview: () => (
      <OverlayDemo label="Toggle adaptive sidebar">
        {(open) => (
          <AdaptiveSidebar open={open} width="280px" height="200px" renderAsModal={false}>
            <Box p={2}>
              <Typography variant="h4">Details</Typography>
              <Typography>Inline panel content.</Typography>
            </Box>
          </AdaptiveSidebar>
        )}
      </OverlayDemo>
    ),
  },
  {
    name: "PopoverContainer",
    folder: "popover-container",
    category: "Overlays",
    description: "Button that opens a small floating panel of custom content.",
    Preview: () => (
      <PopoverContainer title="Quick settings">
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography m={0}>Show archived items</Typography>
          <Typography m={0}>Compact rows</Typography>
        </Box>
      </PopoverContainer>
    ),
  },
];
