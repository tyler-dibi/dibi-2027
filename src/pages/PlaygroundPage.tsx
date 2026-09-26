import { useState } from "react";
import { useParams } from "react-router-dom";

import Box from "carbon-react/lib/components/box";
import Button from "carbon-react/lib/components/button/__next__";
import Loader from "carbon-react/lib/components/loader/__next__";
import Typography from "carbon-react/lib/components/typography";

import { findPlayground } from "../app/playground-registry";
import PlaygroundErrorBoundary from "../app/PlaygroundErrorBoundary";
import { isPublished } from "../app/publishing";
import NotFoundPage from "./NotFoundPage";

export default function PlaygroundPage() {
  const { slug } = useParams();
  const playground = findPlayground(slug);
  const [copied, setCopied] = useState(false);

  if (!playground) {
    if (isPublished) return <NotFoundPage />;
    return (
      <Box p={6} display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Loader loaderLabel="Loading playground" />
        <Typography>
          Waiting for <strong>src/playgrounds/{slug}.tsx</strong>…
        </Typography>
      </Box>
    );
  }

  const { Component, file, title } = playground;

  const copyPath = async () => {
    await navigator.clipboard.writeText(file);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100%">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        px={3}
        py={1}
        bg="var(--colorsUtilityYang100)"
        boxShadow="boxShadow050"
        position="sticky"
        top={0}
      >
        <Typography variant="h4" as="h1" m={0} whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
          {title}
        </Typography>
        <Box display="flex" gap={1} flexShrink={0}>
          {!isPublished && (
            <Button size="small" variantType="tertiary" iconType={copied ? "tick" : "copy"} onClick={copyPath}>
              {copied ? "Copied" : "Copy file path"}
            </Button>
          )}
          <Button
            size="small"
            variantType="secondary"
            iconType="fullscreen"
            href={`/preview/${playground.slug}`}
            target="_blank"
            rel="noreferrer"
          >
            Open full screen
          </Button>
        </Box>
      </Box>

      <Box flex="1" bg="var(--colorsUtilityYang100)">
        <PlaygroundErrorBoundary file={file}>
          <Component />
        </PlaygroundErrorBoundary>
      </Box>
    </Box>
  );
}
