import { Component, type ErrorInfo, type ReactNode } from "react";

import Box from "carbon-react/lib/components/box";
import Message from "carbon-react/lib/components/message";
import Typography from "carbon-react/lib/components/typography";

type Props = { file: string; children: ReactNode };
type State = { error: Error | null };

export default class PlaygroundErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`Playground ${this.props.file} crashed`, error, info);
  }

  componentDidUpdate(prev: Props) {
    if (prev.children !== this.props.children && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <Box p={4}>
          <Message variant="error" title="This playground crashed">
            <Typography>
              {this.state.error.message} — ask the agent to fix <strong>{this.props.file}</strong>.
            </Typography>
          </Message>
        </Box>
      );
    }
    return this.props.children;
  }
}
