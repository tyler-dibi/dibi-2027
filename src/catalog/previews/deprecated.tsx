/*
 * Components Carbon has deprecated. They stay in the catalogue (hidden by default) so designers
 * can recognise them, but they must NOT be used in playgrounds — the linter blocks them there.
 */
/* eslint-disable @typescript-eslint/no-deprecated */
import { useState } from "react";

import { Accordion, AccordionGroup } from "carbon-react/lib/components/accordion";
import Alert from "carbon-react/lib/components/alert";
import Box from "carbon-react/lib/components/box";
import LegacyButton from "carbon-react/lib/components/button";
import ButtonBar from "carbon-react/lib/components/button-bar";
import ButtonMinor from "carbon-react/lib/components/button-minor";
import Confirm from "carbon-react/lib/components/confirm";
import Content from "carbon-react/lib/components/content";
import Detail from "carbon-react/lib/components/detail";
import DismissibleBox from "carbon-react/lib/components/dismissible-box";
import {
  DuellingPicklist,
  Picklist,
  PicklistItem,
  PicklistPlaceholder,
} from "carbon-react/lib/components/duelling-picklist";
import { GridContainer, GridItem } from "carbon-react/lib/components/grid";
import GroupedCharacter from "carbon-react/lib/components/grouped-character";
import Heading from "carbon-react/lib/components/heading";
import Hr from "carbon-react/lib/components/hr";
import Icon from "carbon-react/lib/components/icon";
import IconButton from "carbon-react/lib/components/icon-button";
import InlineInputs from "carbon-react/lib/components/inline-inputs";
import LegacyLoader from "carbon-react/lib/components/loader";
import Modal from "carbon-react/lib/components/modal";
import NumberInput from "carbon-react/lib/components/number";
import Pages, { Page } from "carbon-react/lib/components/pages";
import Pod from "carbon-react/lib/components/pod";
import SettingsRow from "carbon-react/lib/components/settings-row";
import Switch from "carbon-react/lib/components/switch";
import Textbox from "carbon-react/lib/components/textbox";
import Toast from "carbon-react/lib/components/toast";
import Tooltip from "carbon-react/lib/components/tooltip";
import Typography, { List, ListItem } from "carbon-react/lib/components/typography";
import VerticalDivider from "carbon-react/lib/components/vertical-divider";

import OverlayDemo from "../OverlayDemo";
import type { CatalogEntry } from "../types";

const Swatch = ({ label }: { label: string }) => (
  <Box bg="var(--colorsUtilityMajor050)" p={1} borderRadius="borderRadius100">
    <Typography m={0} textAlign="center" variant="small">
      {label}
    </Typography>
  </Box>
);

export const deprecated: CatalogEntry[] = [
  {
    name: "Button",
    folder: "button",
    category: "Actions",
    description: "Legacy Button (buttonType prop). Use Button from button/__next__.",
    Preview: () => (
      <Box display="flex" gap={1}>
        <LegacyButton buttonType="primary">Primary</LegacyButton>
        <LegacyButton buttonType="secondary">Secondary</LegacyButton>
      </Box>
    ),
  },
  {
    name: "ButtonBar",
    folder: "button-bar",
    category: "Actions",
    description: "Groups related buttons into a single joined bar.",
    Preview: () => (
      <ButtonBar>
        <LegacyButton iconType="csv">CSV</LegacyButton>
        <LegacyButton iconType="pdf">PDF</LegacyButton>
      </ButtonBar>
    ),
  },
  {
    name: "ButtonMinor",
    folder: "button-minor",
    category: "Actions",
    description: "A lower-emphasis button for dense UI.",
    Preview: () => (
      <Box display="flex" gap={1}>
        <ButtonMinor buttonType="primary">Primary</ButtonMinor>
        <ButtonMinor buttonType="secondary">Secondary</ButtonMinor>
      </Box>
    ),
  },
  {
    name: "IconButton",
    folder: "icon-button",
    category: "Actions",
    description: "An icon-only button. Use Button (__next__) with an Icon child and aria-label.",
    Preview: () => (
      <Box display="flex" gap={2}>
        <IconButton aria-label="Edit" onClick={() => {}}>
          <Icon type="edit" />
        </IconButton>
        <IconButton aria-label="Delete" onClick={() => {}}>
          <Icon type="bin" />
        </IconButton>
      </Box>
    ),
  },
  {
    name: "Alert",
    folder: "alert",
    category: "Overlays",
    description: "Small modal to tell the user something important. Use Dialog.",
    Preview: () => (
      <OverlayDemo label="Show alert">
        {(open, close) => (
          <Alert open={open} onCancel={close} title="Session expiring">
            Save your work to avoid losing changes.
          </Alert>
        )}
      </OverlayDemo>
    ),
  },
  {
    name: "Confirm",
    folder: "confirm",
    category: "Overlays",
    description: "Asks the user to confirm or cancel an action. Use Dialog.",
    Preview: () => (
      <OverlayDemo label="Delete invoice">
        {(open, close) => (
          <Confirm open={open} title="Delete this invoice?" confirmLabel="Delete" onConfirm={close} onCancel={close} />
        )}
      </OverlayDemo>
    ),
  },
  {
    name: "Modal",
    folder: "modal",
    category: "Overlays",
    description: "Low-level modal container. Use Dialog.",
    Preview: () => (
      <OverlayDemo label="Open modal">
        {(open, close) => (
          <Modal open={open} onCancel={close}>
            <Box bg="var(--colorsUtilityYang100)" p={4} m={6}>
              <Typography>Deprecated — use Dialog.</Typography>
              <LegacyButton onClick={close}>Close</LegacyButton>
            </Box>
          </Modal>
        )}
      </OverlayDemo>
    ),
  },
  {
    name: "Toast",
    folder: "toast",
    category: "Feedback & status",
    description: "Short-lived notification over the page.",
    Preview: () => (
      <OverlayDemo label="Show toast">
        {(open, close) => (
          <Toast variant="success" open={open} onDismiss={close} timeout={4000} id="catalog-toast">
            Invoice INV-0042 saved
          </Toast>
        )}
      </OverlayDemo>
    ),
  },
  {
    name: "Tooltip",
    folder: "tooltip",
    category: "Feedback & status",
    description: "Short label shown on hover or focus.",
    Preview: () => (
      <Tooltip message="Creates a copy of this invoice" position="top">
        <LegacyButton buttonType="secondary">Hover me</LegacyButton>
      </Tooltip>
    ),
  },
  {
    name: "Loader",
    folder: "loader",
    category: "Feedback & status",
    description: "Legacy animated dots. Use Loader from loader/__next__.",
    Preview: () => <LegacyLoader loaderLabel="Loading" />,
  },
  {
    name: "Heading",
    folder: "heading",
    category: "Typography & content",
    description: "Page heading with subheader and back link. Use Typography.",
    Preview: () => (
      <Box width="100%">
        <Heading title="Invoices" subheader="Manage and send invoices" divider={false} />
      </Box>
    ),
  },
  {
    name: "List",
    folder: "typography",
    exports: ["List", "ListItem"],
    category: "Typography & content",
    description: 'Legacy list. Use Typography variant="ul"/"ol" with Typography as="li".',
    Preview: () => (
      <List>
        <ListItem>Create an invoice</ListItem>
        <ListItem>Get paid online</ListItem>
      </List>
    ),
  },
  {
    name: "Content",
    folder: "content",
    category: "Data display",
    description: "Title and body pair for read-only information.",
    Preview: () => <Content title="Registered address">1 Sage Street, Newcastle</Content>,
  },
  {
    name: "Detail",
    folder: "detail",
    category: "Data display",
    description: "Text with an optional icon and footnote.",
    Preview: () => (
      <Detail icon="person" footnote="Primary contact">
        Jane Smith
      </Detail>
    ),
  },
  {
    name: "DismissibleBox",
    folder: "dismissible-box",
    category: "Layout",
    description: "Box of content the user can close.",
    Preview: () => (
      <DismissibleBox onClose={() => {}} width="320px">
        <Box>
          <Typography variant="h4" mt={0}>
            Tip
          </Typography>
          <Typography m={0}>Connect your bank to reconcile automatically.</Typography>
        </Box>
      </DismissibleBox>
    ),
  },
  {
    name: "DuellingPicklist",
    folder: "duelling-picklist",
    exports: ["DuellingPicklist", "Picklist", "PicklistItem", "PicklistGroup", "PicklistDivider", "PicklistPlaceholder"],
    category: "Selection",
    description: "Move items between an available list and a selected list.",
    Preview: function DuellingPicklistPreview() {
      const [left, setLeft] = useState(["Sales", "Banking"]);
      const [right, setRight] = useState(["Payroll"]);
      const move = (item: string, toRight: boolean) => {
        if (toRight) {
          setLeft(left.filter((i) => i !== item));
          setRight([...right, item]);
        } else {
          setRight(right.filter((i) => i !== item));
          setLeft([...left, item]);
        }
      };
      return (
        <Box width="100%">
          <DuellingPicklist leftLabel="Available" rightLabel="Selected">
            <Picklist placeholder={<PicklistPlaceholder text="Nothing to add" />}>
              {left.map((i) => (
                <PicklistItem key={i} type="add" item={i} onChange={(item) => move(item as string, true)}>
                  {i}
                </PicklistItem>
              ))}
            </Picklist>
            <Picklist placeholder={<PicklistPlaceholder text="Nothing selected" />}>
              {right.map((i) => (
                <PicklistItem key={i} type="remove" item={i} onChange={(item) => move(item as string, false)}>
                  {i}
                </PicklistItem>
              ))}
            </Picklist>
          </DuellingPicklist>
        </Box>
      );
    },
  },
  {
    name: "GridContainer",
    folder: "grid",
    exports: ["GridContainer", "GridItem"],
    category: "Layout",
    description: "12-column page grid. Use Box with display=\"grid\".",
    Preview: () => (
      <Box width="100%">
        <GridContainer>
          <GridItem gridColumn="1 / 7">
            <Swatch label="1 / 7" />
          </GridItem>
          <GridItem gridColumn="7 / 13">
            <Swatch label="7 / 13" />
          </GridItem>
        </GridContainer>
      </Box>
    ),
  },
  {
    name: "GroupedCharacter",
    folder: "grouped-character",
    category: "Inputs",
    description: "Input that auto-groups characters, e.g. sort codes.",
    Preview: function GroupedCharacterPreview() {
      const [value, setValue] = useState("123456");
      return (
        <Box width="240px">
          <GroupedCharacter
            label="Sort code"
            groups={[2, 2, 2]}
            separator="-"
            value={value}
            onChange={(e) => setValue(e.target.value.rawValue)}
          />
        </Box>
      );
    },
  },
  {
    name: "InlineInputs",
    folder: "inline-inputs",
    category: "Layout",
    description: "Several inputs side by side under one label.",
    Preview: () => (
      <Box width="100%">
        <InlineInputs label="Name" htmlFor="inline-first">
          <Textbox id="inline-first" aria-label="First name" value="Jane" onChange={() => {}} />
          <Textbox aria-label="Last name" value="Smith" onChange={() => {}} />
        </InlineInputs>
      </Box>
    ),
  },
  {
    name: "Number",
    folder: "number",
    category: "Inputs",
    description: "Input restricted to whole numbers. Use Textbox or Decimal.",
    Preview: function NumberPreview() {
      const [value, setValue] = useState("12");
      return (
        <Box width="240px">
          <NumberInput label="Quantity" value={value} onChange={(e) => setValue(e.target.value)} />
        </Box>
      );
    },
  },
  {
    name: "Pages",
    folder: "pages",
    exports: ["Pages", "Page"],
    category: "Layout",
    description: "Slides between pages of content.",
    Preview: function PagesPreview() {
      const [index, setIndex] = useState(0);
      return (
        <Box width="100%">
          <Pages pageIndex={index}>
            <Page title={<Typography variant="h4">Page one</Typography>}>
              <LegacyButton size="small" onClick={() => setIndex(1)}>
                Next page
              </LegacyButton>
            </Page>
            <Page title={<Typography variant="h4">Page two</Typography>}>
              <LegacyButton size="small" onClick={() => setIndex(0)}>
                Back
              </LegacyButton>
            </Page>
          </Pages>
        </Box>
      );
    },
  },
  {
    name: "Pod",
    folder: "pod",
    category: "Layout",
    description: "Titled content block with edit and delete actions.",
    Preview: () => (
      <Box width="320px">
        <Pod title="Contact details" subtitle="Primary contact" onEdit={() => {}}>
          <Typography m={0}>Jane Smith · jane@acme.co.uk</Typography>
        </Pod>
      </Box>
    ),
  },
  {
    name: "SettingsRow",
    folder: "settings-row",
    category: "Layout",
    description: "Settings row: title and description on the left, controls on the right.",
    Preview: () => (
      <Box width="100%">
        <SettingsRow title="Reminders" description="Email customers when an invoice is overdue." divider={false}>
          <Switch label="Send reminders" checked onChange={() => {}} />
        </SettingsRow>
      </Box>
    ),
  },
  {
    name: "Hr",
    folder: "hr",
    category: "Layout",
    description: "Horizontal rule. Use Divider.",
    Preview: () => (
      <Box width="100%">
        <Hr />
      </Box>
    ),
  },
  {
    name: "VerticalDivider",
    folder: "vertical-divider",
    category: "Layout",
    description: 'Vertical separator. Use Divider type="vertical".',
    Preview: () => (
      <Box display="flex" alignItems="center" height="40px">
        <Typography m={0}>Left</Typography>
        <VerticalDivider />
        <Typography m={0}>Right</Typography>
      </Box>
    ),
  },
  {
    name: "AccordionGroup",
    folder: "accordion",
    exports: ["AccordionGroup"],
    category: "Layout",
    description: "Wrapper for a group of Accordions.",
    Preview: () => (
      <Box width="100%">
        <AccordionGroup>
          <Accordion title="First">
            <Typography m={0}>Content</Typography>
          </Accordion>
          <Accordion title="Second">
            <Typography m={0}>Content</Typography>
          </Accordion>
        </AccordionGroup>
      </Box>
    ),
  },
];
