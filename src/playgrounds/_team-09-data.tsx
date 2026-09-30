import Box from "carbon-react/lib/components/box";
import Typography from "carbon-react/lib/components/typography";

export type Attendee = {
  id: string;
  name: string;
  company: string;
  email: string;
  ticket: string;
  ticketType: string;
  checkedIn: boolean;
  checkedInAt?: string;
};

export const EVENT = {
  name: "Sage Summit 2026",
  date: "Wednesday 14 October 2026",
  venue: "ExCeL London",
  address: "Royal Victoria Dock, London E16 1XL",
  doors: "08:00",
  keynote: "09:30",
  hall: "Hall B",
};

export const PRIYA_ID = "SS-1042";
export const JAMES_ID = "SS-0881";
export const AMIRA_ID = "SS-1104";

const SEED: Attendee[] = [
  {
    id: PRIYA_ID,
    name: "Priya Shah",
    company: "Northwind Digital",
    email: "priya.shah@northwind.co.uk",
    ticket: PRIYA_ID,
    ticketType: "Full conference",
    checkedIn: false,
  },
  {
    id: JAMES_ID,
    name: "James Okonkwo",
    company: "Harbour & Co",
    email: "james.okonkwo@harbourandco.co.uk",
    ticket: JAMES_ID,
    ticketType: "Full conference",
    checkedIn: true,
    checkedInAt: "08:14",
  },
  {
    id: AMIRA_ID,
    name: "Amira Hassan",
    company: "Bright Ledger",
    email: "amira.hassan@brightledger.co.uk",
    ticket: AMIRA_ID,
    ticketType: "Workshop day",
    checkedIn: false,
  },
  {
    id: "SS-0912",
    name: "Owen Blake",
    company: "Pembroke Studio",
    email: "owen.blake@pembrokestudio.co.uk",
    ticket: "SS-0912",
    ticketType: "Full conference",
    checkedIn: true,
    checkedInAt: "08:22",
  },
  {
    id: "SS-1208",
    name: "Mei Chen",
    company: "Orchard Finance",
    email: "mei.chen@orchardfinance.co.uk",
    ticket: "SS-1208",
    ticketType: "Full conference",
    checkedIn: false,
  },
  {
    id: "SS-0774",
    name: "Sofia Alvarez",
    company: "Calder & Wren",
    email: "sofia.alvarez@calderwren.co.uk",
    ticket: "SS-0774",
    ticketType: "Speaker",
    checkedIn: true,
    checkedInAt: "08:05",
  },
  {
    id: "SS-1330",
    name: "Hassan Iqbal",
    company: "Greenfield Health",
    email: "hassan.iqbal@greenfieldhealth.nhs.uk",
    ticket: "SS-1330",
    ticketType: "Full conference",
    checkedIn: false,
  },
  {
    id: "SS-0644",
    name: "Freya MacLeod",
    company: "Isle Skye Foods",
    email: "freya.macleod@isleskyefoods.co.uk",
    ticket: "SS-0644",
    ticketType: "Workshop day",
    checkedIn: false,
  },
  {
    id: "SS-1411",
    name: "Daniel Adeyemi",
    company: "Kingsway Architects",
    email: "daniel.adeyemi@kingswayarchitects.co.uk",
    ticket: "SS-1411",
    ticketType: "Full conference",
    checkedIn: true,
    checkedInAt: "08:31",
  },
  {
    id: "SS-0588",
    name: "Hannah Brooks",
    company: "Brookfield Primary",
    email: "hannah.brooks@brookfield.school",
    ticket: "SS-0588",
    ticketType: "Workshop day",
    checkedIn: false,
  },
  {
    id: "SS-0990",
    name: "Luca Romano",
    company: "Romano & Sons",
    email: "luca.romano@romanoandsons.co.uk",
    ticket: "SS-0990",
    ticketType: "Exhibitor",
    checkedIn: false,
  },
  {
    id: "SS-1126",
    name: "Aisha Rahman",
    company: "Thames Legal",
    email: "aisha.rahman@thameslegal.co.uk",
    ticket: "SS-1126",
    ticketType: "Full conference",
    checkedIn: true,
    checkedInAt: "08:18",
  },
  {
    id: "SS-0702",
    name: "Tom Gallagher",
    company: "Gallagher Print",
    email: "tom.gallagher@gallagherprint.co.uk",
    ticket: "SS-0702",
    ticketType: "Full conference",
    checkedIn: false,
  },
  {
    id: "SS-1288",
    name: "Nina Petrov",
    company: "Petrov Analytics",
    email: "nina.petrov@petrovan.co.uk",
    ticket: "SS-1288",
    ticketType: "Speaker",
    checkedIn: false,
  },
  {
    id: "SS-0833",
    name: "Samuel Wright",
    company: "Wright Cycles",
    email: "samuel.wright@wrightcycles.co.uk",
    ticket: "SS-0833",
    ticketType: "Full conference",
    checkedIn: true,
    checkedInAt: "08:27",
  },
  {
    id: "SS-1510",
    name: "Chloe Nguyen",
    company: "Nguyen Bakery",
    email: "chloe.nguyen@nguyenbakeries.co.uk",
    ticket: "SS-1510",
    ticketType: "Workshop day",
    checkedIn: false,
  },
  {
    id: "SS-0601",
    name: "Ben Carter",
    company: "Carter Roofing",
    email: "ben.carter@carterroofing.co.uk",
    ticket: "SS-0601",
    ticketType: "Full conference",
    checkedIn: false,
  },
  {
    id: "SS-1194",
    name: "Yasmin Khan",
    company: "Khan Pharmacy",
    email: "yasmin.khan@khanpharmacy.co.uk",
    ticket: "SS-1194",
    ticketType: "Full conference",
    checkedIn: true,
    checkedInAt: "08:09",
  },
  {
    id: "SS-1366",
    name: "Oliver Hughes",
    company: "Hughes & Hughes",
    email: "oliver.hughes@hugheshughes.co.uk",
    ticket: "SS-1366",
    ticketType: "Exhibitor",
    checkedIn: false,
  },
  {
    id: "SS-0740",
    name: "Grace Osei",
    company: "Osei Interiors",
    email: "grace.osei@oseiinteriors.co.uk",
    ticket: "SS-0740",
    ticketType: "Full conference",
    checkedIn: false,
  },
  {
    id: "SS-0903",
    name: "Patrick Doyle",
    company: "Doyle Transport",
    email: "patrick.doyle@doyletransport.co.uk",
    ticket: "SS-0903",
    ticketType: "Full conference",
    checkedIn: true,
    checkedInAt: "08:36",
  },
  {
    id: "SS-1602",
    name: "Emily Frost",
    company: "Frost Gardens",
    email: "emily.frost@frostgardens.co.uk",
    ticket: "SS-1602",
    ticketType: "Workshop day",
    checkedIn: false,
  },
  {
    id: "SS-1017",
    name: "Rajiv Menon",
    company: "Menon Clinics",
    email: "rajiv.menon@menonclinics.co.uk",
    ticket: "SS-1017",
    ticketType: "Full conference",
    checkedIn: false,
  },
  {
    id: "SS-0855",
    name: "Laura Bennett",
    company: "Bennett Books",
    email: "laura.bennett@bennettbooks.co.uk",
    ticket: "SS-0855",
    ticketType: "Full conference",
    checkedIn: true,
    checkedInAt: "08:41",
  },
];

export function createAttendees(): Attendee[] {
  return SEED.map((attendee) => ({ ...attendee }));
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function matchesQuery(attendee: Attendee, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return `${attendee.name} ${attendee.company} ${attendee.ticket} ${attendee.email}`
    .toLowerCase()
    .includes(needle);
}

const QR_SIZE = 25;

function buildQr(): number[][] {
  const grid = Array.from({ length: QR_SIZE }, () => Array<number>(QR_SIZE).fill(0));

  const finder = (originX: number, originY: number) => {
    for (let y = 0; y < 7; y += 1) {
      for (let x = 0; x < 7; x += 1) {
        const edge = x === 0 || y === 0 || x === 6 || y === 6;
        const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        grid[originY + y][originX + x] = edge || core ? 1 : 0;
      }
    }
  };

  finder(0, 0);
  finder(QR_SIZE - 7, 0);
  finder(0, QR_SIZE - 7);

  for (let i = 8; i <= QR_SIZE - 9; i += 1) {
    const on = i % 2 === 0 ? 1 : 0;
    grid[6][i] = on;
    grid[i][6] = on;
  }

  for (let y = 0; y < QR_SIZE; y += 1) {
    for (let x = 0; x < QR_SIZE; x += 1) {
      const inFinder = (x < 8 && y < 8) || (x > QR_SIZE - 9 && y < 8) || (x < 8 && y > QR_SIZE - 9);
      if (inFinder || y === 6 || x === 6) continue;
      grid[y][x] = (x * 17 + y * 13 + ((x * y) % 7)) % 3 === 0 ? 1 : 0;
    }
  }

  return grid;
}

const QR_ROWS = buildQr();

export function QrCode() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
      <Box aria-hidden="true" bg="var(--colorsYang100)" p={2}>
        <Box display="grid" gridTemplateColumns="repeat(25, 8px)">
          {QR_ROWS.flatMap((row, y) =>
            row.map((cell, x) => (
              <Box
                key={`${x}-${y}`}
                width="8px"
                height="8px"
                bg={cell ? "var(--colorsYin090)" : "var(--colorsYang100)"}
              />
            )),
          )}
        </Box>
      </Box>
      <Typography screenReaderOnly>
        QR code for Priya Shah, ticket SS-1042. Show this code at check-in.
      </Typography>
      <Typography variant="small" color="subtle" m={0}>
        Ticket SS-1042
      </Typography>
    </Box>
  );
}
