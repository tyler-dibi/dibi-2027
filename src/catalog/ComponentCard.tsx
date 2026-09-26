import { Component, useState, type ReactNode } from "react";

import Box from "carbon-react/lib/components/box";
import Button from "carbon-react/lib/components/button/__next__";
import Icon from "carbon-react/lib/components/icon";
import Message from "carbon-react/lib/components/message";
import Pill from "carbon-react/lib/components/pill";
import { Tile } from "carbon-react/lib/components/tile";
import Typography from "carbon-react/lib/components/typography";

import { importPath } from "./catalog";
import type { CatalogEntry } from "./types";

class PreviewBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <Message variant="warning">Preview unavailable</Message> : this.props.children;
  }
}

export default function ComponentCard({ entry }: { entry: CatalogEntry }) {
  const [copied, setCopied] = useState(false);
  const { Preview } = entry;

  const copy = async () => {
    await navigator.clipboard.writeText(entry.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Tile p={0} height="100%" orientation="vertical">
      <Box display="flex" flexDirection="column" height="100%" width="100%">
        <Box
          height="280px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={3}
          bg="var(--colorsUtilityMajor010)"
          overflow="hidden"
          position="relative"
          data-role="component-preview"
        >
          <PreviewBoundary>
            <Preview />
          </PreviewBoundary>
        </Box>

        <Box p={2} display="flex" flexDirection="column" gap={1} flex="1">
          <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
            <Typography variant="h3" m={0}>
              {entry.name}
            </Typography>
            <Button
              size="small"
              variantType={copied ? "primary" : "secondary"}
              onClick={copy}
              aria-label={`Copy ${entry.name}`}
            >
              <>
                <Icon type={copied ? "tick" : "copy"} />
                {copied ? "Copied" : "Copy"}
              </>
            </Button>
          </Box>
          <Box display="flex" gap={1} flexWrap="wrap">
            <Pill variant="slate">{entry.category}</Pill>
            {entry.next && <Pill variant="green">Current version</Pill>}
            {entry.deprecated && (
              <Pill variant="red" fill>
                Deprecated
              </Pill>
            )}
          </Box>
          <Typography variant="small" m={0}>
            {entry.description}
          </Typography>
          {entry.deprecated && (
            <Typography variant="small" m={0} color="subtle">
              Carbon: {entry.deprecated}
            </Typography>
          )}
          <Typography variant="small" m={0} color="subtle">
            {importPath(entry)}
          </Typography>
        </Box>
      </Box>
    </Tile>
  );
}
