import { useRef, useState } from "react";

import {
  AnchorNavigation,
  AnchorNavigationItem,
  AnchorSectionDivider,
} from "carbon-react/lib/components/anchor-navigation";
import Box from "carbon-react/lib/components/box";
import { Breadcrumbs, Crumb } from "carbon-react/lib/components/breadcrumbs";
import GlobalHeader from "carbon-react/lib/components/global-header";
import { Menu, MenuDivider, MenuFullscreen, MenuItem } from "carbon-react/lib/components/menu";
import NavigationBar from "carbon-react/lib/components/navigation-bar";
import Pager from "carbon-react/lib/components/pager";
import { StepFlow } from "carbon-react/lib/components/step-flow";
import { StepSequence, StepSequenceItem } from "carbon-react/lib/components/step-sequence";
import { Tab, TabList, TabPanel, Tabs } from "carbon-react/lib/components/tabs/__next__";
import Typography from "carbon-react/lib/components/typography";
import {
  ResponsiveVerticalMenu,
  ResponsiveVerticalMenuDivider,
  ResponsiveVerticalMenuItem,
  ResponsiveVerticalMenuProvider,
  VerticalMenu,
  VerticalMenuItem,
} from "carbon-react/lib/components/vertical-menu";

import OverlayDemo from "../OverlayDemo";
import type { CatalogEntry } from "../types";

export const navigation: CatalogEntry[] = [
  {
    name: "GlobalHeader",
    folder: "global-header",
    category: "Navigation",
    description: "The top-level product header, above all other navigation.",
    Preview: () => (
      <Box width="100%" position="relative" height="40px" overflow="hidden">
        <GlobalHeader
          logo={
            <Typography variant="strong" inverse m={0}>
              Sage Accounting
            </Typography>
          }
        >
          <Menu menuType="black">
            <MenuItem href="#">Help</MenuItem>
            <MenuItem href="#">Account</MenuItem>
          </Menu>
        </GlobalHeader>
      </Box>
    ),
  },
  {
    name: "NavigationBar",
    folder: "navigation-bar",
    category: "Navigation",
    description: "Horizontal bar that hosts the product's main Menu.",
    Preview: () => (
      <Box width="100%">
        <NavigationBar variant="white">
          <Menu menuType="light">
            <MenuItem href="#">Dashboard</MenuItem>
            <MenuItem href="#">Sales</MenuItem>
            <MenuItem href="#">Purchases</MenuItem>
          </Menu>
        </NavigationBar>
      </Box>
    ),
  },
  {
    name: "Menu",
    folder: "menu",
    exports: ["Menu", "MenuItem", "MenuDivider", "MenuSegmentTitle", "MenuFullscreen", "ScrollableBlock"],
    category: "Navigation",
    description: "Horizontal menu with items and submenus, used in NavigationBar.",
    Preview: () => (
      <Menu menuType="white">
        <MenuItem href="#">Home</MenuItem>
        <MenuItem submenu="Sales">
          <MenuItem href="#">Invoices</MenuItem>
          <MenuItem href="#">Quotes</MenuItem>
          <MenuDivider />
          <MenuItem href="#">Customers</MenuItem>
        </MenuItem>
        <MenuItem href="#">Reports</MenuItem>
      </Menu>
    ),
  },
  {
    name: "MenuFullscreen",
    folder: "menu",
    exports: ["MenuFullscreen", "MenuItem"],
    category: "Navigation",
    description: "Full-screen version of Menu for small screens.",
    Preview: () => (
      <OverlayDemo label="Open full-screen menu">
        {(open, close) => (
          <MenuFullscreen isOpen={open} onClose={close}>
            <MenuItem href="#">Home</MenuItem>
            <MenuItem href="#">Sales</MenuItem>
            <MenuItem href="#">Reports</MenuItem>
          </MenuFullscreen>
        )}
      </OverlayDemo>
    ),
  },
  {
    name: "VerticalMenu",
    folder: "vertical-menu",
    exports: ["VerticalMenu", "VerticalMenuItem", "VerticalMenuTrigger", "VerticalMenuFullScreen"],
    category: "Navigation",
    description: "Dark left-hand navigation menu with nested items.",
    Preview: () => (
      <Box height="240px" overflow="hidden">
        <VerticalMenu aria-label="Preview menu" width="240px">
          <VerticalMenuItem title="Dashboard" iconType="dashboard" href="#" active />
          <VerticalMenuItem title="Sales" iconType="money_bag" defaultOpen>
            <VerticalMenuItem title="Invoices" href="#" />
            <VerticalMenuItem title="Quotes" href="#" />
          </VerticalMenuItem>
          <VerticalMenuItem title="Contacts" iconType="people" href="#" />
        </VerticalMenu>
      </Box>
    ),
  },
  {
    name: "ResponsiveVerticalMenu",
    folder: "vertical-menu",
    exports: [
      "ResponsiveVerticalMenu",
      "ResponsiveVerticalMenuItem",
      "ResponsiveVerticalMenuDivider",
      "ResponsiveVerticalMenuProvider",
    ],
    category: "Navigation",
    description: "Launcher-button navigation menu that adapts to screen size.",
    Preview: () => (
      <ResponsiveVerticalMenuProvider>
        <ResponsiveVerticalMenu>
          <ResponsiveVerticalMenuItem id="rvm-home" label="Home" icon="home" href="#" />
          <ResponsiveVerticalMenuItem id="rvm-sales" label="Sales" icon="money_bag">
            <ResponsiveVerticalMenuItem id="rvm-invoices" label="Invoices" href="#" />
          </ResponsiveVerticalMenuItem>
          <ResponsiveVerticalMenuDivider />
          <ResponsiveVerticalMenuItem id="rvm-settings" label="Settings" icon="settings" href="#" />
        </ResponsiveVerticalMenu>
      </ResponsiveVerticalMenuProvider>
    ),
  },
  {
    name: "Breadcrumbs",
    folder: "breadcrumbs",
    exports: ["Breadcrumbs", "Crumb"],
    category: "Navigation",
    description: "Shows where the current page sits in the hierarchy.",
    Preview: () => (
      <Breadcrumbs>
        <Crumb href="#">Sales</Crumb>
        <Crumb href="#">Invoices</Crumb>
        <Crumb isCurrent>INV-0042</Crumb>
      </Breadcrumbs>
    ),
  },
  {
    name: "Tabs",
    folder: "tabs",
    next: true,
    exports: ["Tabs", "TabList", "Tab", "TabPanel"],
    category: "Navigation",
    description: "Switch between related views within the same page. Compose Tabs > TabList > Tab, plus a TabPanel per tab.",
    Preview: () => (
      <Box width="100%">
        <Tabs>
          <TabList ariaLabel="Customer sections">
            <Tab id="tab-overview" controls="panel-overview" label="Overview" />
            <Tab id="tab-activity" controls="panel-activity" label="Activity" />
            <Tab id="tab-notes" controls="panel-notes" label="Notes" />
          </TabList>
          <TabPanel id="panel-overview" tabId="tab-overview">
            <Box p={2}>
              <Typography m={0}>Overview content</Typography>
            </Box>
          </TabPanel>
          <TabPanel id="panel-activity" tabId="tab-activity">
            <Box p={2}>
              <Typography m={0}>Activity content</Typography>
            </Box>
          </TabPanel>
          <TabPanel id="panel-notes" tabId="tab-notes">
            <Box p={2}>
              <Typography m={0}>Notes content</Typography>
            </Box>
          </TabPanel>
        </Tabs>
      </Box>
    ),
  },
  {
    name: "AnchorNavigation",
    folder: "anchor-navigation",
    exports: ["AnchorNavigation", "AnchorNavigationItem", "AnchorSectionDivider"],
    category: "Navigation",
    description: "In-page navigation that scrolls to sections of a long page.",
    Preview: function AnchorNavigationPreview() {
      const general = useRef<HTMLDivElement>(null);
      const billing = useRef<HTMLDivElement>(null);
      return (
        <Box width="100%" height="220px" overflow="hidden">
          <AnchorNavigation
            stickyNavigation={
              <>
                <AnchorNavigationItem target={general}>General</AnchorNavigationItem>
                <AnchorNavigationItem target={billing}>Billing</AnchorNavigationItem>
              </>
            }
          >
            <Box ref={general}>
              <Typography variant="h4">General</Typography>
            </Box>
            <AnchorSectionDivider />
            <Box ref={billing}>
              <Typography variant="h4">Billing</Typography>
            </Box>
          </AnchorNavigation>
        </Box>
      );
    },
  },
  {
    name: "Pager",
    folder: "pager",
    category: "Navigation",
    description: "Pagination controls for tables and lists.",
    Preview: function PagerPreview() {
      const [page, setPage] = useState(1);
      return (
        <Box width="100%">
          <Pager totalRecords={120} pageSize={10} currentPage={page} onPagination={(p) => setPage(p)} showPageSizeSelection />
        </Box>
      );
    },
  },
  {
    name: "StepFlow",
    folder: "step-flow",
    exports: ["StepFlow", "StepFlowTitle"],
    category: "Navigation",
    description: "Header for multi-step flows, showing the current step and progress.",
    Preview: () => (
      <Box width="100%">
        <StepFlow title="Company details" currentStep={2} totalSteps={4} showProgressIndicator />
      </Box>
    ),
  },
  {
    name: "StepSequence",
    folder: "step-sequence",
    exports: ["StepSequence", "StepSequenceItem"],
    category: "Navigation",
    description: "Numbered sequence of steps with complete, current and incomplete states.",
    Preview: () => (
      <StepSequence>
        <StepSequenceItem indicator="1" status="complete" aria-label="Step 1 of 3">
          Details
        </StepSequenceItem>
        <StepSequenceItem indicator="2" status="current" aria-label="Step 2 of 3">
          Bank
        </StepSequenceItem>
        <StepSequenceItem indicator="3" status="incomplete" aria-label="Step 3 of 3">
          Confirm
        </StepSequenceItem>
      </StepSequence>
    ),
  },
];
