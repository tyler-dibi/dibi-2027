import { useMemo, useState } from "react";

import Box from "carbon-react/lib/components/box";
import Button from "carbon-react/lib/components/button/__next__";
import {
  FlatTable,
  FlatTableBody,
  FlatTableCell,
  FlatTableHead,
  FlatTableHeader,
  FlatTableRow,
} from "carbon-react/lib/components/flat-table";
import Pill from "carbon-react/lib/components/pill";
import Search from "carbon-react/lib/components/search";
import { Tile } from "carbon-react/lib/components/tile";
import Typography from "carbon-react/lib/components/typography";

export const meta = {
  title: "Example: Invoices",
};

type Status = "Paid" | "Due" | "Overdue" | "Draft";

const invoices: { id: string; customer: string; date: string; amount: number; status: Status }[] = [
  { id: "INV-0041", customer: "Acme Ltd", date: "02 Sep 2026", amount: 1250, status: "Paid" },
  { id: "INV-0042", customer: "Bright Co", date: "09 Sep 2026", amount: 640, status: "Due" },
  { id: "INV-0043", customer: "Cobalt plc", date: "12 Aug 2026", amount: 3980, status: "Overdue" },
  { id: "INV-0044", customer: "Delta Studio", date: "18 Sep 2026", amount: 2100, status: "Due" },
  { id: "INV-0045", customer: "Evergreen Farms", date: "22 Sep 2026", amount: 480, status: "Draft" },
];

const statusVariant = {
  Paid: "green",
  Due: "orange",
  Overdue: "red",
  Draft: "grey",
} as const;

const gbp = (n: number) => n.toLocaleString("en-GB", { style: "currency", currency: "GBP" });

/**
 * Example playground showing how a page is composed only from Carbon components.
 * Feel free to delete this file.
 */
export default function ExampleInvoicesPlayground() {
  const [query, setQuery] = useState("");

  const rows = useMemo(
    () =>
      invoices.filter(
        (i) =>
          i.customer.toLowerCase().includes(query.toLowerCase()) || i.id.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  const outstanding = invoices.filter((i) => i.status !== "Paid" && i.status !== "Draft");

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography variant="h1" m={0}>
            Invoices
          </Typography>
          <Typography m={0}>Create, send and track your sales invoices</Typography>
        </Box>
        <Button variantType="primary" iconType="plus">
          New invoice
        </Button>
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2} mb={4}>
        <Tile orientation="vertical">
          <Typography variant="small" m={0}>
            Outstanding
          </Typography>
          <Typography variant="h2" m={0}>
            {gbp(outstanding.reduce((t, i) => t + i.amount, 0))}
          </Typography>
        </Tile>
        <Tile orientation="vertical">
          <Typography variant="small" m={0}>
            Overdue
          </Typography>
          <Typography variant="h2" m={0}>
            {gbp(invoices.filter((i) => i.status === "Overdue").reduce((t, i) => t + i.amount, 0))}
          </Typography>
        </Tile>
        <Tile orientation="vertical">
          <Typography variant="small" m={0}>
            Paid this month
          </Typography>
          <Typography variant="h2" m={0}>
            {gbp(invoices.filter((i) => i.status === "Paid").reduce((t, i) => t + i.amount, 0))}
          </Typography>
        </Tile>
      </Box>

      <Box width="360px" mb={2}>
        <Search
          aria-label="Search invoices"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Box>

      <FlatTable title="Invoices">
        <FlatTableHead>
          <FlatTableRow>
            <FlatTableHeader>Invoice</FlatTableHeader>
            <FlatTableHeader>Customer</FlatTableHeader>
            <FlatTableHeader>Date</FlatTableHeader>
            <FlatTableHeader align="right">Amount</FlatTableHeader>
            <FlatTableHeader>Status</FlatTableHeader>
          </FlatTableRow>
        </FlatTableHead>
        <FlatTableBody>
          {rows.map((i) => (
            <FlatTableRow key={i.id}>
              <FlatTableCell>{i.id}</FlatTableCell>
              <FlatTableCell>{i.customer}</FlatTableCell>
              <FlatTableCell>{i.date}</FlatTableCell>
              <FlatTableCell align="right">{gbp(i.amount)}</FlatTableCell>
              <FlatTableCell>
                <Pill variant={statusVariant[i.status]}>
                  {i.status}
                </Pill>
              </FlatTableCell>
            </FlatTableRow>
          ))}
        </FlatTableBody>
      </FlatTable>
    </Box>
  );
}
