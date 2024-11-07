import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppList from "./Components/AppList";
import AppModelProvider from "./context/appModelContext";
import AppTableMarkdown from "./Components/AppTableMarkdown";
import AppRelationships from "./Components/AppRelationships";
import SystemC4 from "./Components/SystemC4";
import { Container } from "@mui/material";
import Users from "./Components/Users";
import InteractionContext from "./Components/InteractionContext";
import InteractionList from "./Components/InteractionList";
import ArchitectureList from "./Components/ArchitectureList";

const architecturePath = "/architecture/:architectureId";
const interactionListPath = architecturePath + "/interaction/list";
const interactionEditPath = architecturePath + "/interaction/:interactionId";
const summaryTablePath = architecturePath + "/summary/table";
const summaryDiagramPath = architecturePath + "/summary/diagram";

const createArchitecturePath = (architectureId: number) =>
  `/architecture/${architectureId}`;
export const createInteractionListPath = (architectureId: number) =>
  createArchitecturePath(architectureId) + "/interaction/list";
export const createInteractionEditPath = (
  architectureId: number,
  interactionId: string,
) => createArchitecturePath(architectureId) + `/interaction/${interactionId}`;
export const createSummaryTablePath = (architectureId: number) =>
  createArchitecturePath(architectureId) + "/summary/table";
export const createSummaryDiagramPath = (architectureId: number) =>
  createArchitecturePath(architectureId) + "/summary/diagram";

function App() {
  return (
    <BrowserRouter>
      <AppModelProvider>
        <Container maxWidth="sm">
          <Routes>
            <Route path="/" element={<ArchitectureList />} />
            <Route path={interactionListPath} element={<InteractionList />} />
            <Route
              path={interactionEditPath}
              element={<InteractionContext />}
            />
            <Route path={summaryTablePath} element={<AppTableMarkdown />} />
            <Route path={summaryDiagramPath} element={<SystemC4 />} />
          </Routes>
        </Container>
      </AppModelProvider>
    </BrowserRouter>
  );
}

export default App;
