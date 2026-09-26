import { Route, Routes } from "react-router-dom";

import Box from "carbon-react/lib/components/box";

import TopNav from "./TopNav";
import SideNav from "./SideNav";
import HomePage from "../pages/HomePage";
import ComponentsPage from "../pages/ComponentsPage";
import PlaygroundPage from "../pages/PlaygroundPage";
import WorkshopPage from "../pages/WorkshopPage";
import PlaygroundFullscreen from "../pages/PlaygroundFullscreen";
import NotFoundPage from "../pages/NotFoundPage";

export const HEADER_HEIGHT = "40px";

function Shell() {
  return (
    <>
      <TopNav />
      <Box display="flex" height="100vh" pt={HEADER_HEIGHT} boxSizing="border-box">
        <SideNav />
        <Box as="main" flex="1" minWidth={0} overflowY="auto" bg="var(--colorsUtilityMajor010)">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/components" element={<ComponentsPage />} />
            <Route path="/workshop" element={<WorkshopPage />} />
            <Route path="/playground/:slug" element={<PlaygroundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Box>
      </Box>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/preview/:slug" element={<PlaygroundFullscreen />} />
      <Route path="/*" element={<Shell />} />
    </Routes>
  );
}
