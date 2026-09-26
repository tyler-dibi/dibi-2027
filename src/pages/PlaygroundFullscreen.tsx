import { useParams } from "react-router-dom";

import Box from "carbon-react/lib/components/box";
import Message from "carbon-react/lib/components/message";

import { findPlayground } from "../app/playground-registry";
import PlaygroundErrorBoundary from "../app/PlaygroundErrorBoundary";

export default function PlaygroundFullscreen() {
  const { slug } = useParams();
  const playground = findPlayground(slug);

  if (!playground) {
    return (
      <Box p={4}>
        <Message variant="warning">No playground found at src/playgrounds/{slug}.tsx</Message>
      </Box>
    );
  }

  const { Component, file } = playground;
  return (
    <PlaygroundErrorBoundary file={file}>
      <Component />
    </PlaygroundErrorBoundary>
  );
}
