import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import CarbonProvider from "carbon-react/lib/components/carbon-provider";
import TokensWrapper from "carbon-react/lib/components/tokens-wrapper";
import GlobalStyle from "carbon-react/lib/style/global-style";
import sageTheme from "carbon-react/lib/style/themes/sage";
import "carbon-react/lib/style/fonts.css";

import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CarbonProvider theme={sageTheme}>
      <TokensWrapper>
        <GlobalStyle />
        <App />
      </TokensWrapper>
    </CarbonProvider>
  </StrictMode>,
);
