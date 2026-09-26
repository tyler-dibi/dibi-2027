import Box from "carbon-react/lib/components/box";
import { Dd, Dl, Dt } from "carbon-react/lib/components/definition-list";
import {
  FlatTable,
  FlatTableBody,
  FlatTableCell,
  FlatTableHead,
  FlatTableHeader,
  FlatTableRow,
} from "carbon-react/lib/components/flat-table";
import Icon from "carbon-react/lib/components/icon";
import Image from "carbon-react/lib/components/image";
import LinkPreview from "carbon-react/lib/components/link-preview";
import Note from "carbon-react/lib/components/note";
import Pill from "carbon-react/lib/components/pill";
import Portrait from "carbon-react/lib/components/portrait";
import Profile from "carbon-react/lib/components/profile";
import Typography from "carbon-react/lib/components/typography";

import type { CatalogEntry } from "../types";

const invoices = [
  { id: "INV-0041", customer: "Acme Ltd", amount: "£1,250.00", status: "Paid" },
  { id: "INV-0042", customer: "Bright Co", amount: "£640.00", status: "Due" },
  { id: "INV-0043", customer: "Cobalt plc", amount: "£3,980.00", status: "Overdue" },
];

const statusColor = { Paid: "green", Due: "orange", Overdue: "red" } as const;

const sampleImage =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='200'><defs><linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='#00D639'/><stop offset='1' stop-color='#007E45'/></linearGradient></defs><rect width='400' height='200' fill='url(#g)'/></svg>`,
  );

export const data: CatalogEntry[] = [
  {
    name: "FlatTable",
    folder: "flat-table",
    exports: [
      "FlatTable",
      "FlatTableHead",
      "FlatTableHeader",
      "FlatTableBody",
      "FlatTableRow",
      "FlatTableRowHeader",
      "FlatTableCell",
      "FlatTableCheckbox",
      "FlatTableBodyDraggable",
      "Sort",
    ],
    category: "Data display",
    description: "Data table with sorting, selection, expandable rows and sticky headers.",
    Preview: () => (
      <Box width="100%">
        <FlatTable title="Invoices" size="compact">
          <FlatTableHead>
            <FlatTableRow>
              <FlatTableHeader>Invoice</FlatTableHeader>
              <FlatTableHeader>Customer</FlatTableHeader>
              <FlatTableHeader align="right">Amount</FlatTableHeader>
              <FlatTableHeader>Status</FlatTableHeader>
            </FlatTableRow>
          </FlatTableHead>
          <FlatTableBody>
            {invoices.map((i) => (
              <FlatTableRow key={i.id}>
                <FlatTableCell>{i.id}</FlatTableCell>
                <FlatTableCell>{i.customer}</FlatTableCell>
                <FlatTableCell align="right">{i.amount}</FlatTableCell>
                <FlatTableCell>
                  <Pill variant={statusColor[i.status as keyof typeof statusColor]}>
                    {i.status}
                  </Pill>
                </FlatTableCell>
              </FlatTableRow>
            ))}
          </FlatTableBody>
        </FlatTable>
      </Box>
    ),
  },
  {
    name: "Dl",
    folder: "definition-list",
    exports: ["Dl", "Dt", "Dd"],
    category: "Data display",
    description: "Definition list for label/value pairs.",
    Preview: () => (
      <Dl>
        <Dt>Customer</Dt>
        <Dd>Acme Ltd</Dd>
        <Dt>Invoice date</Dt>
        <Dd>26 Sep 2026</Dd>
        <Dt>Total</Dt>
        <Dd>£1,250.00</Dd>
      </Dl>
    ),
  },
  {
    name: "Portrait",
    folder: "portrait",
    category: "Data display",
    description: "Avatar showing a person's image, initials or icon.",
    Preview: () => (
      <Box display="flex" gap={2} alignItems="center">
        <Portrait initials="JS" size="L" />
        <Portrait initials="AB" size="M" shape="square" />
        <Portrait iconType="individual" size="M" />
      </Box>
    ),
  },
  {
    name: "Profile",
    folder: "profile",
    category: "Data display",
    description: "Avatar with name and email.",
    Preview: () => <Profile name="Jane Smith" email="jane.smith@acme.co.uk" initials="JS" size="M" />,
  },
  {
    name: "Image",
    folder: "image",
    category: "Data display",
    description: "Responsive image or background image.",
    Preview: () => <Image src={sampleImage} alt="Green gradient" width="320px" height="160px" />,
  },
  {
    name: "Icon",
    folder: "icon",
    category: "Data display",
    description: "Carbon icon font. Use the `type` prop — only Carbon icons are allowed.",
    Preview: () => (
      <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center" maxWidth="320px">
        {(["home", "settings", "person", "email", "calendar", "bin", "edit", "tick_circle", "warning", "info", "chart_bar", "money_bag"] as const).map(
          (t) => (
            <Icon key={t} type={t} size="large" />
          ),
        )}
      </Box>
    ),
  },
  {
    name: "LinkPreview",
    folder: "link-preview",
    category: "Data display",
    description: "Rich preview card for a URL.",
    Preview: () => (
      <Box width="100%">
        <LinkPreview
          url="https://www.sage.com"
          title="Sage | Accounting, payroll and HR software"
          description="Software for small and medium businesses."
        />
      </Box>
    ),
  },
  {
    name: "Note",
    folder: "note",
    category: "Data display",
    description: "A saved note with author, date and content.",
    Preview: () => (
      <Box width="100%">
        <Note
          title="Follow-up call"
          name="Jane Smith"
          createdDate="26 Sep 2026, 10:30"
          noteContent="Customer asked to split the payment across two months."
        />
      </Box>
    ),
  },
  {
    name: "Typography",
    folder: "typography",
    category: "Typography & content",
    description:
      'All text. Use `variant` (h1–h5, p, small, strong, ul/ol…) instead of raw HTML. Lists: variant="ul" with Typography as="li".',
    Preview: () => (
      <Box>
        <Typography variant="h1" m={0}>
          Heading 1
        </Typography>
        <Typography variant="h3" m={0}>
          Heading 3
        </Typography>
        <Typography variant="p" m={0}>
          Body paragraph text.
        </Typography>
        <Typography variant="small" m={0}>
          Small supporting text
        </Typography>
        <Typography variant="ul" m={0}>
          <Typography as="li">List item</Typography>
          <Typography as="li">Another item</Typography>
        </Typography>
      </Box>
    ),
  },
];
