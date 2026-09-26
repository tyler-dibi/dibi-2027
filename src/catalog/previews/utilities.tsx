import Box from "carbon-react/lib/components/box";
import Icon from "carbon-react/lib/components/icon";
import Typography from "carbon-react/lib/components/typography";

import type { CatalogEntry } from "../types";

const NonVisual = ({ text }: { text: string }) => (
  <Box display="flex" flexDirection="column" alignItems="center" gap={1} maxWidth="300px">
    <Icon type="settings" size="large" />
    <Typography m={0} textAlign="center" variant="small">
      {text}
    </Typography>
  </Box>
);

export const utilities: CatalogEntry[] = [
  {
    name: "CarbonProvider",
    folder: "carbon-provider",
    category: "Utilities",
    description: "Supplies the Carbon theme. Already set up for you in src/main.tsx.",
    Preview: () => <NonVisual text="Non-visual provider. Already wraps the whole app." />,
  },
  {
    name: "TokensWrapper",
    folder: "tokens-wrapper",
    category: "Utilities",
    description: "Injects Sage design tokens as CSS variables. Already set up in src/main.tsx.",
    Preview: () => <NonVisual text="Non-visual provider. Already wraps the whole app." />,
  },
  {
    name: "I18nProvider",
    folder: "i18n-provider",
    category: "Utilities",
    description: "Provides locale and translations to Carbon components.",
    Preview: () => <NonVisual text="Non-visual provider for localisation." />,
  },
  {
    name: "Portal",
    folder: "portal",
    category: "Utilities",
    description: "Renders children outside the current DOM hierarchy.",
    Preview: () => <NonVisual text="Non-visual utility used by overlays." />,
  },
];
