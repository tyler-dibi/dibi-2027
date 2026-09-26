import { useState } from "react";

import { Accordion } from "carbon-react/lib/components/accordion";
import Box from "carbon-react/lib/components/box";
import Button from "carbon-react/lib/components/button/__next__";
import { Card, CardFooter } from "carbon-react/lib/components/card";
import Divider from "carbon-react/lib/components/divider";
import { DraggableContainer, DraggableItem } from "carbon-react/lib/components/draggable";
import Drawer from "carbon-react/lib/components/drawer";
import { Tile, TileContent, TileFooter, TileHeader } from "carbon-react/lib/components/tile";
import Typography from "carbon-react/lib/components/typography";

import type { CatalogEntry } from "../types";

export const layout: CatalogEntry[] = [
  {
    name: "Box",
    folder: "box",
    category: "Layout",
    description:
      "The layout primitive: spacing (p, m, gap), flexbox, grid, size and colour props. Use it instead of div, including for grids (display=\"grid\").",
    Preview: () => (
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={1} p={2} bg="var(--colorsUtilityMajor025)" borderRadius="borderRadius200" width="80%">
        {["p={2}", "gap={1}", "display=grid"].map((label) => (
          <Box key={label} p={2} bg="var(--colorsActionMajor500)" borderRadius="borderRadius100">
            <Typography m={0} inverse variant="small">
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    ),
  },
  {
    name: "Card",
    folder: "card",
    exports: ["Card", "CardFooter"],
    category: "Layout",
    description: "Container for a summary of content, optionally clickable.",
    Preview: () => (
      <Card
        width="300px"
        footer={
          <CardFooter>
            <Typography m={0} variant="small">
              Updated today
            </Typography>
          </CardFooter>
        }
      >
        <Typography variant="h4" m={0}>
          Cash in bank
        </Typography>
        <Typography variant="h2" m={0}>
          £24,560.00
        </Typography>
      </Card>
    ),
  },
  {
    name: "Tile",
    folder: "tile",
    exports: ["Tile", "TileHeader", "TileContent", "TileFooter", "FlexTileContainer", "FlexTileCell", "FlexTileDivider"],
    category: "Layout",
    description: "Bordered surface for grouping content. Set orientation=\"vertical\" to stack children.",
    Preview: () => (
      <Tile width="320px" orientation="vertical">
        <TileHeader>
          <Typography variant="h4" m={0}>
            Profit and loss
          </Typography>
        </TileHeader>
        <TileContent>
          <Typography m={0}>Net profit this month: £8,420</Typography>
        </TileContent>
        <TileFooter>
          <Typography m={0}>View report</Typography>
        </TileFooter>
      </Tile>
    ),
  },
  {
    name: "Accordion",
    folder: "accordion",
    exports: ["Accordion"],
    category: "Layout",
    description: "Expandable section to show and hide content.",
    Preview: () => (
      <Box width="100%">
        <Accordion title="Payment terms" defaultExpanded>
          <Typography m={0}>Invoices are due within 30 days.</Typography>
        </Accordion>
        <Accordion title="Bank details">
          <Typography m={0}>Sort code 12-34-56</Typography>
        </Accordion>
      </Box>
    ),
  },
  {
    name: "Divider",
    folder: "divider",
    category: "Layout",
    description: "Horizontal or vertical separator line.",
    Preview: () => (
      <Box width="100%">
        <Typography m={0}>Above</Typography>
        <Divider type="horizontal" />
        <Box display="flex" alignItems="center" height="32px">
          <Typography m={0}>Left</Typography>
          <Divider type="vertical" h={24} />
          <Typography m={0}>Right</Typography>
        </Box>
      </Box>
    ),
  },
  {
    name: "Drawer",
    folder: "drawer",
    category: "Layout",
    description: "Collapsible side panel that sits alongside main content.",
    Preview: function DrawerPreview() {
      const [expanded, setExpanded] = useState(true);
      return (
        <Box width="100%" height="220px">
          <Drawer
            expanded={expanded}
            onChange={() => setExpanded(!expanded)}
            expandedWidth="160px"
            height="220px"
            title="Filters"
            sidebar={
              <Box p={2}>
                <Typography m={0}>Filter options</Typography>
              </Box>
            }
          >
            <Box p={2}>
              <Button size="small" variantType="secondary" onClick={() => setExpanded(!expanded)}>
                Toggle drawer
              </Button>
            </Box>
          </Drawer>
        </Box>
      );
    },
  },
  {
    name: "DraggableContainer",
    folder: "draggable",
    exports: ["DraggableContainer", "DraggableItem"],
    category: "Layout",
    description: "List of items that can be reordered by dragging.",
    Preview: () => (
      <Box width="260px">
        <DraggableContainer>
          <DraggableItem id="d1">
            <Typography m={0}>Revenue</Typography>
          </DraggableItem>
          <DraggableItem id="d2">
            <Typography m={0}>Expenses</Typography>
          </DraggableItem>
          <DraggableItem id="d3">
            <Typography m={0}>Profit</Typography>
          </DraggableItem>
        </DraggableContainer>
      </Box>
    ),
  },
];
