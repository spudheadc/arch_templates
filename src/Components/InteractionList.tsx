import {
  Add,
  AddCircle,
  Delete,
  Done,
  Draw,
  Edit,
  TableView,
} from "@mui/icons-material";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { ReactElement, ReactNode, useContext, useState } from "react";
import { IInteraction } from "../@types/context";
import { AppModelContext } from "../context/appModelContext";
import { useNavigate, useParams } from "react-router-dom";
import { useArchitectureModel } from "../utils/useArchitectureModel";
import { createInteractionEditPath } from "../App";
import SystemC4 from "./SystemC4";
import AppTableMarkdown from "./AppTableMarkdown";

type OverviewType = {
  label: string;
  icon: ReactNode;
  component: ReactElement;
};
const overViews: OverviewType[] = [
  {
    label: "System Context Diagram",
    icon: <Draw />,
    component: <SystemC4 />,
  },
  {
    label: "Engagement Table",
    icon: <TableView />,
    component: <AppTableMarkdown />,
  },
];

function InteractionList() {
  const [appModel, setAppModel] = useContext(AppModelContext);
  const navigate = useNavigate();
  const [getInteractions, setInteractions] = useArchitectureModel();
  const [overviewView, setOverviewView] = useState<number>(-1);

  const params = useParams();
  let architectureId: number = Number(params.architectureId);
  if (!params.architectureId) architectureId = 0;

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {getInteractions().map((key: IInteraction, index: number) => (
            <TableRow key={index}>
              <TableCell>{key.name}</TableCell>
              <TableCell>{key.description}</TableCell>
              <TableCell>
                <Edit
                  onClick={() =>
                    navigate(
                      createInteractionEditPath(architectureId, "" + index),
                    )
                  }
                />
              </TableCell>
              <TableCell>
                <Delete onClick={() => handleDelete(index)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AddCircle onClick={handleNewInteraction} />

      <Dialog open={overviewView != -1} onClose={() => setOverviewView(-1)}>
        <DialogTitle></DialogTitle>
        <DialogContent>
          <Box>
            {overviewView !== -1 ? overViews[overviewView].component : ""}
          </Box>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={() => setOverviewView(-1)} type="submit">
            <Done></Done>Ok
          </IconButton>
        </DialogActions>
      </Dialog>

      <BottomNavigation
        showLabels
        value={overviewView}
        onChange={(event, newValue) => {
          setOverviewView(newValue);
        }}
      >
        {overViews.map((item: OverviewType, index: number) => {
          return <BottomNavigationAction label={item.label} icon={item.icon} />;
        })}
      </BottomNavigation>
    </>
  );

  function handleNewInteraction(): void {
    navigate(createInteractionEditPath(architectureId, "new"));
  }

  function handleDelete(indexToRemove: number): void {
    let currentInteractions: IInteraction[] = getInteractions();
    currentInteractions = [
      ...currentInteractions.slice(0, indexToRemove),
      ...currentInteractions.slice(indexToRemove + 1),
    ];
    setInteractions(currentInteractions);
  }
}

export default InteractionList;
