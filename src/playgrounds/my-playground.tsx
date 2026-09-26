import Box from "carbon-react/lib/components/box";
import Typography from "carbon-react/lib/components/typography";

export const meta = {
  title: "My playground",
};

/**
 * Playground: My playground
 *
 * Build this page ONLY with components from Carbon by Sage
 * (imports from "carbon-react/lib/components/*"). See AGENTS.md.
 */
export default function MyPlaygroundPlayground() {
  return (
    <Box p={4}>
      <Typography variant="h1">My playground</Typography>
      <Typography>
        This is a blank playground. Ask the Cursor agent to start designing here.
      </Typography>
    </Box>
  );
}
