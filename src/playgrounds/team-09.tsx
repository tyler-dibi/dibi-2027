import { useMemo, useState, type ReactNode } from "react";

import Box from "carbon-react/lib/components/box";
import Button from "carbon-react/lib/components/button/__next__";
import { ButtonToggle, ButtonToggleGroup } from "carbon-react/lib/components/button-toggle";
import Divider from "carbon-react/lib/components/divider";
import Icon from "carbon-react/lib/components/icon";
import Message from "carbon-react/lib/components/message";
import Pill from "carbon-react/lib/components/pill";
import Portrait from "carbon-react/lib/components/portrait";
import Search from "carbon-react/lib/components/search";
import { Tile } from "carbon-react/lib/components/tile";
import Typography from "carbon-react/lib/components/typography";

import {
  AMIRA_ID,
  EVENT,
  JAMES_ID,
  PRIYA_ID,
  QrCode,
  createAttendees,
  initials,
  matchesQuery,
  type Attendee,
} from "./_team-09-data";

export const meta = {
  title: "Conference check-in",
};

type View =
  | "ticket-email"
  | "welcome-email"
  | "scanner"
  | "success"
  | "already"
  | "unreadable"
  | "wrong-event"
  | "list"
  | "search"
  | "resolve"
  | "manual"
  | "manual-done";

type Filter = "all" | "waiting" | "checked-in";

const SCREENS: { id: View; label: string }[] = [
  { id: "ticket-email", label: "1. Ticket email" },
  { id: "welcome-email", label: "2. Welcome email" },
  { id: "scanner", label: "3. QR scanner" },
  { id: "success", label: "4. Check-in successful" },
  { id: "already", label: "5. Ticket already scanned" },
  { id: "unreadable", label: "6. Unable to read QR code" },
  { id: "wrong-event", label: "7. QR code does not match" },
  { id: "list", label: "8. Attendee list" },
  { id: "search", label: "9. Search attendee" },
  { id: "resolve", label: "10. Manual check-in" },
  { id: "manual-done", label: "11. Manual confirmation" },
];

const BLURB: Record<View, string> = {
  "ticket-email":
    "Priya gets this before she travels. The QR code is linked to her registration, so staff do not type anything when it scans.",
  "welcome-email":
    "This arrives on its own after a successful check-in. Priya does not have to do anything else at the door.",
  scanner:
    "The camera stays live. A good scan needs no taps. Use the stand-in buttons to fire a result, the way the camera would.",
  success:
    "Green means wave them through. The name is there so staff can see it is the right person. One action returns to the camera.",
  already:
    "Red, with the name and the time they came through. Staff ask them to carry on, or send a dispute to the support desk. They do not check the ticket in again.",
  unreadable:
    "The code never matched anyone. Staff help the attendee get a cleaner image, try again, or leave the lane and check them in by name.",
  "wrong-event":
    "This ticket is for a different event. Staff send them to the support desk and get the lane moving again.",
  list: "The full registration for this prototype. Open anyone to verify them when a code cannot be scanned.",
  search: "Search is already looking for Priya. Staff can search by name, company, email or ticket reference.",
  resolve:
    "Authorised staff only. Search, confirm the person in front of you, then check them in. Already-checked-in people cannot be checked in again.",
  manual:
    "This is the verify step. The details have to match the person at the desk. One tap checks them in. If they are already in, that tap is withheld.",
  "manual-done":
    "Manual check-in ends on the same clear success as a scan, then staff find the next person who needs help.",
};

function nowTime(): string {
  return new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <Box display="flex" justifyContent="space-between" gap={2}>
      <Typography variant="small" color="subtle" m={0}>
        {label}
      </Typography>
      <Typography variant="strong" m={0}>
        {value}
      </Typography>
    </Box>
  );
}

function StatusPill({ checkedIn }: { checkedIn: boolean }) {
  return (
    <Pill variant={checkedIn ? "green" : "grey"} fill>
      {checkedIn ? "Checked in" : "Waiting"}
    </Pill>
  );
}

function EmailFrame({
  subject,
  to,
  children,
}: {
  subject: string;
  to: string;
  children: ReactNode;
}) {
  return (
    <Box
      bg="var(--colorsUtilityYang100)"
      borderRadius="borderRadius200"
      boxShadow="boxShadow100"
      maxWidth="720px"
      display="flex"
      flexDirection="column"
    >
      <Box p={3} display="flex" flexDirection="column" gap={1} bg="var(--colorsUtilityMajor025)">
        <Typography variant="small" m={0}>
          From: Sage Summit
        </Typography>
        <Typography variant="small" m={0}>
          To: {to}
        </Typography>
        <Typography variant="strong" m={0}>
          {subject}
        </Typography>
      </Box>
      <Box p={4} display="flex" flexDirection="column" gap={3}>
        {children}
      </Box>
    </Box>
  );
}

function TicketEmail() {
  return (
    <EmailFrame subject="Subject: Your ticket for Sage Summit 2026" to="Priya Shah">
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h2" m={0}>
          {EVENT.name}
        </Typography>
        <Typography m={0}>
          {EVENT.date}. Doors open at {EVENT.doors}.
        </Typography>
        <Typography m={0} color="subtle">
          {EVENT.venue}, {EVENT.address}
        </Typography>
      </Box>
      <Message variant="info" title="How to check in">
        Open this email at the door and show the code to a member of the check-in team. You do not
        need to print it, and you do not need to say your details if the code scans. Turn your
        screen brightness up and hold the code steady.
      </Message>
      <Tile orientation="vertical" borderVariant="info">
        <Box display="flex" flexDirection="column" gap={1}>
          <Fact label="Attendee" value="Priya Shah" />
          <Fact label="Ticket" value="Full conference" />
          <Fact label="Reference" value={PRIYA_ID} />
        </Box>
      </Tile>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <QrCode />
        <Typography variant="strong" m={0}>
          Show this QR code when you arrive
        </Typography>
      </Box>
    </EmailFrame>
  );
}

function WelcomeEmail() {
  return (
    <EmailFrame subject="Subject: You're checked in. Welcome to Sage Summit" to="Priya Shah">
      <Box display="flex" alignItems="center" gap={2}>
        <Icon type="tick_circle" color="positive" size="large" aria-hidden={true} />
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="h2" m={0}>
            You're checked in
          </Typography>
          <Typography m={0}>Welcome to {EVENT.name}, Priya.</Typography>
        </Box>
      </Box>
      <Message variant="success" title="Your ticket has been scanned">
        You are successfully checked in. There is nothing else to do at the door. Head straight in.
      </Message>
      <Tile orientation="vertical" borderVariant="positive">
        <Box display="flex" flexDirection="column" gap={1}>
          <Fact label="Where to go" value={EVENT.hall} />
          <Fact label="Lanyard" value="Desk inside the hall" />
          <Fact label="First session" value={`${EVENT.keynote} opening keynote`} />
          <Fact label="Date" value={EVENT.date} />
        </Box>
      </Tile>
      <Typography m={0}>
        Keep this email. It confirms you are in. If you need help, the support desk is by the main
        entrance.
      </Typography>
    </EmailFrame>
  );
}

function ResultBanner({
  tone,
  title,
  name,
  detail,
}: {
  tone: "positive" | "negative";
  title: string;
  name?: string;
  detail?: string;
}) {
  const positive = tone === "positive";
  return (
    <Box
      aria-live="polite"
      aria-atomic="true"
      bg={positive ? "var(--colorsSemanticPositive600)" : "var(--colorsSemanticNegative600)"}
      p={3}
      display="flex"
      flexDirection="column"
      gap={1}
    >
      <Icon type={positive ? "tick_circle" : "error"} inverse size="large" aria-hidden={true} />
      <Typography variant={name ? "h3" : "h2"} inverse m={0}>
        {title}
      </Typography>
      {name ? (
        <Typography variant="h1" inverse m={0}>
          {name}
        </Typography>
      ) : null}
      {detail ? (
        <Typography inverse m={0}>
          {detail}
        </Typography>
      ) : null}
    </Box>
  );
}

function PersonButton({ attendee, onOpen }: { attendee: Attendee; onOpen: (id: string) => void }) {
  return (
    <Button
      fullWidth
      type="button"
      variantType="tertiary"
      size="small"
      onClick={() => onOpen(attendee.id)}
      aria-label={`${attendee.name}, ${attendee.company}, ${attendee.checkedIn ? "checked in" : "waiting"}`}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" gap={1} width="100%">
        <Box display="flex" alignItems="center" gap={1}>
          <Portrait
            size="S"
            shape="circle"
            iconType={attendee.checkedIn ? "tick" : "clock"}
            variant={attendee.checkedIn ? "green" : "gray"}
            alt=""
          />
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Typography variant="strong" m={0}>
              {attendee.name}
            </Typography>
            <Typography variant="small" m={0}>
              {attendee.company}
            </Typography>
          </Box>
        </Box>
        <StatusPill checkedIn={attendee.checkedIn} />
      </Box>
    </Button>
  );
}

export default function Team09Playground() {
  const [attendees, setAttendees] = useState<Attendee[]>(createAttendees);
  const [view, setView] = useState<View>("ticket-email");
  const [listQuery, setListQuery] = useState("");
  const [resolveQuery, setResolveQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const checkedInCount = attendees.filter((attendee) => attendee.checkedIn).length;
  const selected = attendees.find((attendee) => attendee.id === selectedId) ?? null;
  const priya = attendees.find((attendee) => attendee.id === PRIYA_ID);

  const visibleAttendees = useMemo(() => {
    return attendees
      .filter((attendee) => {
        if (filter === "waiting") return !attendee.checkedIn;
        if (filter === "checked-in") return attendee.checkedIn;
        return true;
      })
      .filter((attendee) => matchesQuery(attendee, listQuery))
      .sort((a, b) => a.name.localeCompare(b.name, "en-GB"));
  }, [attendees, filter, listQuery]);

  const resolveResults = useMemo(() => {
    const query = resolveQuery.trim();
    if (!query) return [];
    return attendees
      .filter((attendee) => matchesQuery(attendee, query))
      .sort((a, b) => a.name.localeCompare(b.name, "en-GB"));
  }, [attendees, resolveQuery]);

  const checkIn = (id: string) => {
    const time = nowTime();
    setAttendees((current) =>
      current.map((attendee) =>
        attendee.id === id && !attendee.checkedIn
          ? { ...attendee, checkedIn: true, checkedInAt: time }
          : attendee,
      ),
    );
  };

  const openPerson = (id: string) => {
    setSelectedId(id);
    setView("manual");
  };

  const openView = (next: View) => {
    if (next === "success") {
      checkIn(PRIYA_ID);
      setSelectedId(PRIYA_ID);
    } else if (next === "already") {
      setSelectedId(JAMES_ID);
    } else if (next === "search") {
      setListQuery("Priya");
      setFilter("all");
    } else if (next === "list") {
      setListQuery("");
      setFilter("all");
    } else if (next === "resolve") {
      setResolveQuery("");
      setSelectedId(null);
    } else if (next === "manual") {
      const current = attendees.find((attendee) => attendee.id === selectedId);
      if (current) {
        setSelectedId(current.id);
      } else {
        const waiting =
          attendees.find((attendee) => attendee.id === AMIRA_ID && !attendee.checkedIn) ??
          attendees.find((attendee) => !attendee.checkedIn);
        setSelectedId(waiting?.id ?? null);
      }
    } else if (next === "manual-done") {
      const current = attendees.find((attendee) => attendee.id === selectedId);
      const target = current && !current.checkedIn ? current : attendees.find((attendee) => attendee.id === AMIRA_ID);
      if (target) {
        checkIn(target.id);
        setSelectedId(target.id);
      }
    }
    setView(next);
  };

  const scanPriya = () => {
    if (priya?.checkedIn) {
      setSelectedId(PRIYA_ID);
      setView("already");
      return;
    }
    checkIn(PRIYA_ID);
    setSelectedId(PRIYA_ID);
    setView("success");
  };

  const confirmManual = () => {
    if (!selected || selected.checkedIn) return;
    checkIn(selected.id);
    setView("manual-done");
  };

  const resetDemo = () => {
    setAttendees(createAttendees());
    setListQuery("");
    setResolveQuery("");
    setFilter("all");
    setSelectedId(null);
    setView("scanner");
  };

  const highlighted: View = view === "manual" ? "resolve" : view;
  const staff = view !== "ticket-email" && view !== "welcome-email";
  const manualStep = view === "manual-done" ? "done" : view === "manual" ? "verify" : "search";

  const scanNavActive =
    view === "scanner" || view === "success" || view === "already" || view === "unreadable" || view === "wrong-event";
  const listNavActive = view === "list" || view === "search";
  const resolveNavActive = view === "resolve" || view === "manual" || view === "manual-done";

  return (
    <Box p={4} display="flex" flexDirection="column" gap={3} bg="var(--colorsUtilityMajor010)">
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h1" m={0}>
          Conference check-in
        </Typography>
        <Typography m={0}>
          {EVENT.name}, {EVENT.date}, {EVENT.venue}. About 300 people need to pass through with
          almost no queue. This prototype list has {attendees.length} registered attendees.
        </Typography>
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2}>
        <Tile orientation="vertical">
          <Typography variant="strong" m={0}>
            Speed
          </Typography>
          <Typography variant="small" m={0}>
            A good scan has no extra taps.
          </Typography>
        </Tile>
        <Tile orientation="vertical">
          <Typography variant="strong" m={0}>
            Clear feedback
          </Typography>
          <Typography variant="small" m={0}>
            Green success or red error, with the name.
          </Typography>
        </Tile>
        <Tile orientation="vertical">
          <Typography variant="strong" m={0}>
            Fast recovery
          </Typography>
          <Typography variant="small" m={0}>
            Every error tells staff the next step.
          </Typography>
        </Tile>
        <Tile orientation="vertical">
          <Typography variant="strong" m={0}>
            Keep scanning
          </Typography>
          <Typography variant="small" m={0}>
            The camera stays on for the next person.
          </Typography>
        </Tile>
      </Box>

      <Box display="grid" gridTemplateColumns="260px minmax(0, 1fr)" gap={3} alignItems="start">
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="h3" m={0}>
            Screens
          </Typography>
          <Typography variant="small" color="subtle" m={0}>
            Open any state, or walk a scan with the stand-in camera.
          </Typography>
          {SCREENS.map((screen) => (
            <Button
              key={screen.id}
              fullWidth
              size="small"
              type="button"
              variantType={highlighted === screen.id ? "primary" : "tertiary"}
              onClick={() => openView(screen.id)}
            >
              {screen.label}
            </Button>
          ))}
          <Button fullWidth size="small" type="button" variantType="secondary" iconType="reset" onClick={resetDemo}>
            Reset demo
          </Button>
        </Box>

        <Box display="flex" flexDirection="column" gap={2}>
          <Typography m={0}>{BLURB[view]}</Typography>

          {view === "ticket-email" ? <TicketEmail /> : null}
          {view === "welcome-email" ? <WelcomeEmail /> : null}

          {staff ? (
            <Box display="flex" gap={3} alignItems="flex-start" flexWrap="wrap">
              <Box
                width="400px"
                minHeight="680px"
                display="flex"
                flexDirection="column"
                bg="var(--colorsUtilityYang100)"
                borderRadius="borderRadius200"
                boxShadow="boxShadow200"
                overflow="hidden"
              >
                <Box
                  bg="var(--colorsUtilityMajor800)"
                  px={2}
                  py={2}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box display="flex" flexDirection="column">
                    <Typography inverse variant="strong" m={0}>
                      Door check-in
                    </Typography>
                    <Typography inverse variant="small" m={0}>
                      Lane A · Alex Morgan
                    </Typography>
                  </Box>
                  <Typography inverse variant="strong" m={0}>
                    {checkedInCount} of {attendees.length}
                  </Typography>
                </Box>

                <Box flex="1" display="flex" flexDirection="column">
                  {view === "scanner" ? (
                    <Box p={2} flex="1" display="flex" flexDirection="column" gap={2}>
                      <Box
                        flex="1"
                        minHeight="280px"
                        bg="var(--colorsUtilityMajor800)"
                        borderRadius="borderRadius200"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        gap={2}
                        p={3}
                      >
                        <Icon type="scan" inverse size="large" aria-hidden={true} />
                        <Typography inverse variant="h2" m={0}>
                          Ready to scan
                        </Typography>
                        <Typography inverse m={0}>
                          Hold the QR code in front of the camera
                        </Typography>
                        <Pill inverse variant="green" fill>
                          Camera on
                        </Pill>
                      </Box>
                      <Typography variant="small" color="subtle" m={0}>
                        Results show the moment a code is read. You do not confirm each one.
                      </Typography>
                    </Box>
                  ) : null}

                  {view === "success" && selected ? (
                    <Box flex="1" display="flex" flexDirection="column">
                      <ResultBanner
                        tone="positive"
                        title="Check-in successful"
                        name={selected.name}
                        detail={`${selected.company} · ${selected.ticketType}`}
                      />
                      <Box p={2} flex="1" display="flex" flexDirection="column" justifyContent="flex-end" gap={2}>
                        <Typography m={0}>
                          Say their name and wave them through. Their welcome email is on its way.
                        </Typography>
                        <Button
                          fullWidth
                          size="large"
                          type="button"
                          variantType="primary"
                          iconType="scan"
                          onClick={() => setView("scanner")}
                        >
                          Scan next attendee
                        </Button>
                      </Box>
                    </Box>
                  ) : null}

                  {view === "already" && selected ? (
                    <Box flex="1" display="flex" flexDirection="column">
                      <ResultBanner
                        tone="negative"
                        title="Ticket already scanned"
                        name={selected.name}
                        detail={
                          selected.checkedInAt
                            ? `Checked in at ${selected.checkedInAt}`
                            : "Already checked in"
                        }
                      />
                      <Box p={2} flex="1" display="flex" flexDirection="column" justifyContent="flex-end" gap={2}>
                        <Typography m={0}>
                          This ticket has already been checked in. Ask them to carry on into the
                          venue. If they say they have not been through, send them to the support
                          desk. Do not check them in again.
                        </Typography>
                        <Button
                          fullWidth
                          size="large"
                          type="button"
                          variantType="primary"
                          iconType="scan"
                          onClick={() => setView("scanner")}
                        >
                          Scan next attendee
                        </Button>
                        <Button fullWidth type="button" variantType="tertiary" onClick={() => openView("resolve")}>
                          Open resolve
                        </Button>
                      </Box>
                    </Box>
                  ) : null}

                  {view === "unreadable" ? (
                    <Box flex="1" display="flex" flexDirection="column">
                      <ResultBanner
                        tone="negative"
                        title="Unable to read QR code"
                        detail="The code could not be scanned"
                      />
                      <Box p={2} flex="1" display="flex" flexDirection="column" justifyContent="flex-end" gap={2}>
                        <Typography m={0}>
                          Ask them to increase screen brightness, move a case if it covers the code,
                          and hold it steady. Then try again.
                        </Typography>
                        <Button
                          fullWidth
                          size="large"
                          type="button"
                          variantType="primary"
                          iconType="scan"
                          onClick={() => setView("scanner")}
                        >
                          Try again
                        </Button>
                        <Button
                          fullWidth
                          type="button"
                          variantType="secondary"
                          onClick={() => openView("resolve")}
                        >
                          Check in manually
                        </Button>
                      </Box>
                    </Box>
                  ) : null}

                  {view === "wrong-event" ? (
                    <Box flex="1" display="flex" flexDirection="column">
                      <ResultBanner
                        tone="negative"
                        title="QR code does not match this event"
                        detail={`Not a ticket for ${EVENT.name}`}
                      />
                      <Box p={2} flex="1" display="flex" flexDirection="column" justifyContent="flex-end" gap={2}>
                        <Typography m={0}>
                          This ticket is not valid for this conference. Direct them to the support
                          desk by the main entrance, then scan the next person.
                        </Typography>
                        <Button
                          fullWidth
                          size="large"
                          type="button"
                          variantType="primary"
                          iconType="scan"
                          onClick={() => setView("scanner")}
                        >
                          Scan next attendee
                        </Button>
                      </Box>
                    </Box>
                  ) : null}

                  {view === "list" || view === "search" ? (
                    <Box p={2} flex="1" display="flex" flexDirection="column" gap={2}>
                      <Typography variant="h3" m={0}>
                        Attendees
                      </Typography>
                      <Search
                        id="attendee-search"
                        label="Search attendees"
                        inputHint="Name, company, email or ticket"
                        value={listQuery}
                        onChange={(event) => {
                          setListQuery(event.target.value);
                          setView(event.target.value.trim() ? "search" : "list");
                        }}
                      />
                      <ButtonToggleGroup
                        id="attendance-filter"
                        aria-label="Filter attendees"
                        fullWidth
                        size="small"
                        value={filter}
                        onChange={(_event, value) => {
                          if (value === "all" || value === "waiting" || value === "checked-in") {
                            setFilter(value);
                          }
                        }}
                      >
                        <ButtonToggle value="all">All</ButtonToggle>
                        <ButtonToggle value="waiting">Waiting</ButtonToggle>
                        <ButtonToggle value="checked-in">Checked in</ButtonToggle>
                      </ButtonToggleGroup>
                      <Box display="flex" flexDirection="column" gap={1} overflow="auto" height="390px">
                        {visibleAttendees.length === 0 ? (
                          <Message variant="warning" title="No matches">
                            Nothing matches that search. Try another spelling, or the ticket
                            reference, such as SS-1042.
                          </Message>
                        ) : (
                          visibleAttendees.map((attendee) => (
                            <PersonButton key={attendee.id} attendee={attendee} onOpen={openPerson} />
                          ))
                        )}
                      </Box>
                    </Box>
                  ) : null}

                  {view === "resolve" || view === "manual" || view === "manual-done" ? (
                    <Box p={2} flex="1" display="flex" flexDirection="column" gap={2}>
                      <Typography variant="h3" m={0}>
                        Resolve
                      </Typography>
                      <ButtonToggleGroup
                        id="manual-steps"
                        aria-label="Manual check-in steps"
                        fullWidth
                        size="small"
                        value={manualStep}
                        onChange={(_event, value) => {
                          if (value === "search") openView("resolve");
                          if (value === "verify") openView("manual");
                          if (value === "done") openView("manual-done");
                        }}
                      >
                        <ButtonToggle value="search">Search</ButtonToggle>
                        <ButtonToggle value="verify">Verify</ButtonToggle>
                        <ButtonToggle value="done">Confirmed</ButtonToggle>
                      </ButtonToggleGroup>

                      {view === "resolve" ? (
                        <Box display="flex" flexDirection="column" gap={2}>
                          <Message variant="info">
                            For check-in staff when a code will not scan. Find the attendee, then
                            confirm they are the person in front of you.
                          </Message>
                          <Search
                            id="resolve-search"
                            label="Find attendee"
                            inputHint="Name, company, email or ticket"
                            value={resolveQuery}
                            onChange={(event) => setResolveQuery(event.target.value)}
                          />
                          {resolveQuery.trim() && resolveResults.length === 0 ? (
                            <Message variant="warning" title="No one found">
                              Try another spelling or the ticket reference. If they are not
                              registered, send them to the support desk.
                            </Message>
                          ) : null}
                          <Box display="flex" flexDirection="column" gap={1} overflow="auto" height="300px">
                            {resolveResults.map((attendee) => (
                              <PersonButton key={attendee.id} attendee={attendee} onOpen={openPerson} />
                            ))}
                          </Box>
                        </Box>
                      ) : null}

                      {view === "manual" && selected ? (
                        <Box flex="1" display="flex" flexDirection="column" gap={2}>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Portrait size="L" initials={initials(selected.name)} alt={selected.name} />
                            <Box display="flex" flexDirection="column" gap={1}>
                              <Typography variant="h2" m={0}>
                                {selected.name}
                              </Typography>
                              <StatusPill checkedIn={selected.checkedIn} />
                            </Box>
                          </Box>
                          <Tile orientation="vertical">
                            <Box display="flex" flexDirection="column" gap={1}>
                              <Fact label="Company" value={selected.company} />
                              <Fact label="Email" value={selected.email} />
                              <Fact label="Ticket" value={selected.ticket} />
                              <Fact label="Type" value={selected.ticketType} />
                              <Fact
                                label="Status"
                                value={
                                  selected.checkedIn
                                    ? `Checked in${selected.checkedInAt ? ` at ${selected.checkedInAt}` : ""}`
                                    : "Not checked in"
                                }
                              />
                            </Box>
                          </Tile>
                          <Box flex="1" display="flex" flexDirection="column" justifyContent="flex-end" gap={2}>
                            {selected.checkedIn ? (
                              <Message variant="error" title="Already checked in">
                                {selected.name} was checked in
                                {selected.checkedInAt ? ` at ${selected.checkedInAt}` : ""}. Do not
                                check them in again. Ask them to continue into the venue, or send
                                them to the support desk if they disagree.
                              </Message>
                            ) : (
                              <Typography m={0}>
                                Confirm this is the person in front of you, then check them in.
                              </Typography>
                            )}
                            {selected.checkedIn ? null : (
                              <Button
                                fullWidth
                                size="large"
                                type="button"
                                variantType="primary"
                                iconType="tick"
                                onClick={confirmManual}
                              >
                                Check in
                              </Button>
                            )}
                            <Button
                              fullWidth
                              type="button"
                              variantType="tertiary"
                              onClick={() => openView("resolve")}
                            >
                              Back to search
                            </Button>
                          </Box>
                        </Box>
                      ) : null}

                      {view === "manual" && !selected ? (
                        <Message variant="info" title="Everyone is checked in">
                          No one is still waiting in this demo. Reset the demo to run manual
                          check-in again.
                        </Message>
                      ) : null}

                      {view === "manual-done" && selected ? (
                        <Box flex="1" display="flex" flexDirection="column" gap={2}>
                          <ResultBanner
                            tone="positive"
                            title="Checked in"
                            name={selected.name}
                            detail="Welcome email sent"
                          />
                          <Box flex="1" display="flex" flexDirection="column" justifyContent="flex-end" gap={2}>
                            <Typography m={0}>
                              {selected.name} is checked in and can go straight in. Find the next
                              person who needs help.
                            </Typography>
                            <Button
                              fullWidth
                              size="large"
                              type="button"
                              variantType="primary"
                              onClick={() => openView("resolve")}
                            >
                              Find another attendee
                            </Button>
                          </Box>
                        </Box>
                      ) : null}
                    </Box>
                  ) : null}
                </Box>

                <Divider />
                <Box display="flex" gap={1} p={2} bg="var(--colorsUtilityMajor025)">
                  <Box flex="1">
                    <Button
                      fullWidth
                      size="small"
                      type="button"
                      iconType="scan"
                      variantType={scanNavActive ? "primary" : "tertiary"}
                      onClick={() => setView("scanner")}
                    >
                      Scan
                    </Button>
                  </Box>
                  <Box flex="1">
                    <Button
                      fullWidth
                      size="small"
                      type="button"
                      iconType="people"
                      variantType={listNavActive ? "primary" : "tertiary"}
                      onClick={() => openView("list")}
                    >
                      Attendees
                    </Button>
                  </Box>
                  <Box flex="1">
                    <Button
                      fullWidth
                      size="small"
                      type="button"
                      iconType="search"
                      variantType={resolveNavActive ? "primary" : "tertiary"}
                      onClick={() => openView("resolve")}
                    >
                      Resolve
                    </Button>
                  </Box>
                </Box>
              </Box>

              <Box flex="1" minWidth="260px" display="flex" flexDirection="column" gap={2}>
                <Typography variant="h3" m={0}>
                  Stand-in for the camera
                </Typography>
                <Typography variant="small" m={0}>
                  These are not on the staff device. They fire the same results a scan would, so
                  you can walk the success and error flows.
                </Typography>
                <Button fullWidth type="button" variantType="primary" iconType="tick" onClick={scanPriya}>
                  {priya?.checkedIn ? "Scan Priya Shah again" : "Scan Priya Shah"}
                </Button>
                <Button
                  fullWidth
                  type="button"
                  variantType="secondary"
                  iconType="error"
                  onClick={() => openView("already")}
                >
                  Scan James Okonkwo
                </Button>
                <Button fullWidth type="button" variantType="secondary" onClick={() => openView("unreadable")}>
                  Code will not read
                </Button>
                <Button fullWidth type="button" variantType="secondary" onClick={() => openView("wrong-event")}>
                  Code for another event
                </Button>
                <Divider />
                <Typography variant="small" color="subtle" m={0}>
                  {priya?.checkedIn
                    ? "Priya is checked in. Scanning her again opens the already-scanned error, so the lane does not create a duplicate."
                    : "Priya is waiting. Her first scan is the success state, and it sends the welcome email."}
                </Typography>
                <Typography variant="small" color="subtle" m={0}>
                  On the attendee list or in Resolve, open a name to verify them. Waiting people can
                  be checked in. People already in cannot.
                </Typography>
              </Box>
            </Box>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}
