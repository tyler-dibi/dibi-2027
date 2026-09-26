import { useState } from "react";

import {
  ActionPopover,
  ActionPopoverDivider,
  ActionPopoverItem,
  ActionPopoverMenu,
} from "carbon-react/lib/components/action-popover";
import BatchSelection from "carbon-react/lib/components/batch-selection";
import Box from "carbon-react/lib/components/box";
import Button from "carbon-react/lib/components/button/__next__";
import { ButtonToggle, ButtonToggleGroup } from "carbon-react/lib/components/button-toggle";
import Icon from "carbon-react/lib/components/icon";
import Link from "carbon-react/lib/components/link";
import MultiActionButton from "carbon-react/lib/components/multi-action-button";
import SplitButton from "carbon-react/lib/components/split-button";

import type { CatalogEntry } from "../types";

export const actions: CatalogEntry[] = [
  {
    name: "Button",
    folder: "button",
    next: true,
    category: "Actions",
    description:
      "Triggers an action. Use `variant` (default, destructive, gradient) with `variantType` (primary, secondary, tertiary, subtle).",
    Preview: () => (
      <Box display="flex" flexDirection="column" gap={2} alignItems="center">
        <Box display="flex" gap={1}>
          <Button variantType="primary">Primary</Button>
          <Button variantType="secondary">Secondary</Button>
          <Button variantType="tertiary">Tertiary</Button>
          <Button variantType="subtle">Subtle</Button>
        </Box>
        <Box display="flex" gap={1}>
          <Button variantType="primary" iconType="plus">
            With icon
          </Button>
          <Button variant="destructive">Delete</Button>
          <Button variant="gradient" variantType="secondary">
            Gradient
          </Button>
        </Box>
      </Box>
    ),
  },
  {
    name: "ButtonToggle",
    folder: "button-toggle",
    exports: ["ButtonToggle", "ButtonToggleGroup"],
    category: "Selection",
    description: "A set of toggle buttons for choosing one option, e.g. switching views.",
    Preview: function ButtonTogglePreview() {
      const [value, setValue] = useState("list");
      return (
        <ButtonToggleGroup id="bt-preview" label="View" value={value} onChange={(_e, v) => v && setValue(v)}>
          <ButtonToggle value="list" buttonIcon="list_view">
            List
          </ButtonToggle>
          <ButtonToggle value="grid" buttonIcon="grid">
            Grid
          </ButtonToggle>
          <ButtonToggle value="chart" buttonIcon="chart_bar">
            Chart
          </ButtonToggle>
        </ButtonToggleGroup>
      );
    },
  },
  {
    name: "Link",
    folder: "link",
    category: "Actions",
    description: "Navigational text link, optionally with an icon.",
    Preview: () => (
      <Box display="flex" flexDirection="column" gap={1} alignItems="flex-start">
        <Link href="#">Standard link</Link>
        <Link href="#" icon="link">
          Link with icon
        </Link>
        <Link href="#" variant="negative">
          Negative link
        </Link>
      </Box>
    ),
  },
  {
    name: "MultiActionButton",
    folder: "multi-action-button",
    category: "Actions",
    description: "A button that opens a list of related actions.",
    Preview: () => (
      <MultiActionButton text="Create new">
        <Button>Invoice</Button>
        <Button>Quote</Button>
        <Button>Credit note</Button>
      </MultiActionButton>
    ),
  },
  {
    name: "SplitButton",
    folder: "split-button",
    category: "Actions",
    description: "A main action with a dropdown of alternative actions.",
    Preview: () => (
      <SplitButton text="Save">
        <Button>Save and new</Button>
        <Button>Save and close</Button>
      </SplitButton>
    ),
  },
  {
    name: "ActionPopover",
    folder: "action-popover",
    exports: ["ActionPopover", "ActionPopoverItem", "ActionPopoverMenu", "ActionPopoverDivider", "ActionPopoverMenuButton"],
    category: "Actions",
    description: "A compact 'more actions' menu, commonly used in table rows.",
    Preview: () => (
      <ActionPopover>
        <ActionPopoverItem icon="edit" onClick={() => {}}>
          Edit
        </ActionPopoverItem>
        <ActionPopoverItem icon="duplicate" onClick={() => {}}>
          Duplicate
        </ActionPopoverItem>
        <ActionPopoverItem
          icon="share"
          submenu={
            <ActionPopoverMenu>
              <ActionPopoverItem onClick={() => {}}>Email</ActionPopoverItem>
              <ActionPopoverItem onClick={() => {}}>Copy link</ActionPopoverItem>
            </ActionPopoverMenu>
          }
        >
          Share
        </ActionPopoverItem>
        <ActionPopoverDivider />
        <ActionPopoverItem icon="bin" onClick={() => {}}>
          Delete
        </ActionPopoverItem>
      </ActionPopover>
    ),
  },
  {
    name: "BatchSelection",
    folder: "batch-selection",
    category: "Actions",
    description: "Shows how many items are selected and bulk actions for them.",
    Preview: () => (
      <BatchSelection selectedCount={3} totalItems={12}>
        <Button variantType="subtle" size="small" aria-label="Email">
          <Icon type="email" />
        </Button>
        <Button variantType="subtle" size="small" aria-label="Print">
          <Icon type="print" />
        </Button>
        <Button variantType="subtle" size="small" aria-label="Delete">
          <Icon type="bin" />
        </Button>
      </BatchSelection>
    ),
  },
];
