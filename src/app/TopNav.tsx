import GlobalHeader from "carbon-react/lib/components/global-header";
import { Menu, MenuItem } from "carbon-react/lib/components/menu";
import Box from "carbon-react/lib/components/box";
import Typography from "carbon-react/lib/components/typography";

import { publishedBranch } from "./publishing";

export const STORYBOOK_URL = "https://carbon.sage.com/";
export const GITHUB_URL = "https://github.com/Sage/carbon";

export default function TopNav() {
  return (
    <GlobalHeader
      logo={
        <Box display="flex" alignItems="center" ml="-32px">
          <Typography variant="strong" inverse m={0} whiteSpace="nowrap">
            Carbon Playground
          </Typography>
        </Box>
      }
    >
      <Box display="flex" flex="1" justifyContent="flex-end" alignItems="center" gap={2}>
        {publishedBranch && (
          <Typography variant="strong" inverse m={0} whiteSpace="nowrap">
            {`Branch: ${publishedBranch}`}
          </Typography>
        )}
        <Menu menuType="black">
          <MenuItem href={STORYBOOK_URL} target="_blank" rel="noreferrer" icon="link">
            Carbon Storybook
          </MenuItem>
          <MenuItem href={GITHUB_URL} target="_blank" rel="noreferrer" icon="source_code">
            Carbon on GitHub
          </MenuItem>
        </Menu>
      </Box>
    </GlobalHeader>
  );
}
