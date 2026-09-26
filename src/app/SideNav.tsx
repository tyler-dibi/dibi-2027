import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Box from "carbon-react/lib/components/box";
import Divider from "carbon-react/lib/components/divider";
import Typography from "carbon-react/lib/components/typography";
import { VerticalMenu, VerticalMenuItem } from "carbon-react/lib/components/vertical-menu";

import { playgrounds } from "./playground-registry";
import NewPlaygroundDialog from "./NewPlaygroundDialog";
import { isPublished } from "./publishing";

export default function SideNav() {
  const { pathname } = useLocation();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Box height="100%" flexShrink={0} display="flex" flexDirection="column">
      <VerticalMenu aria-label="Playground navigation" width="264px" height="100%">
        <VerticalMenuItem component={Link} to="/" title="Home" iconType="home" active={pathname === "/"} />
        <VerticalMenuItem
          component={Link}
          to="/components"
          title="Components"
          iconType="card_view"
          active={pathname.startsWith("/components")}
        />
        <VerticalMenuItem
          component={Link}
          to="/workshop"
          title="DIBI Workshop Guide"
          iconType="people"
          active={pathname === "/workshop"}
        />

        <Box px={3} py={1}>
          <Divider type="horizontal" inverse mb={0} mt={0} />
        </Box>

        {!isPublished && (
          <VerticalMenuItem title="New playground" iconType="plus" onClick={() => setDialogOpen(true)} />
        )}

        {playgrounds.length > 0 && (
          <Box px={3} pt={2} pb={1}>
            <Typography variant="small" inverse m={0} textTransform="uppercase">
              {isPublished ? "Playgrounds" : "Your playgrounds"}
            </Typography>
          </Box>
        )}

        {playgrounds.map((p) => (
          <VerticalMenuItem
            key={p.slug}
            component={Link}
            to={`/playground/${p.slug}`}
            title={p.title}
            iconType="page"
            active={pathname === `/playground/${p.slug}`}
          />
        ))}
      </VerticalMenu>

      <NewPlaygroundDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </Box>
  );
}
