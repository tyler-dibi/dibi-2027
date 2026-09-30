import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import CarbonProvider from "carbon-react/lib/components/carbon-provider";
import TokensWrapper from "carbon-react/lib/components/tokens-wrapper";
import GlobalStyle from "carbon-react/lib/style/global-style";
import sageTheme from "carbon-react/lib/style/themes/sage";
import "carbon-react/lib/style/fonts.css";

import App from "./app/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CarbonProvider theme={sageTheme}>
      <TokensWrapper>
        <GlobalStyle />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </TokensWrapper>
    </CarbonProvider>
  </StrictMode>,
);
