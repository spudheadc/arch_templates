import { ReactElement, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IAppModel, IInteraction } from "../@types/context";
import {
  Box,
  ButtonGroup,
  IconButton,
  Stack,
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from "@mui/material";
import {
  ArrowDownward,
  ArrowUpward,
  NavigateBefore,
  NavigateNext,
  Save,
} from "@mui/icons-material";
import Users from "./Users";
import AppList from "./AppList";
import AppRelationships from "./AppRelationships";
import SequenceDiagram from "./SequenceDiagram";
import { CurrentInteractionContext } from "../context/currentIneractionContext";
import { AppModelContext } from "../context/appModelContext";
import { useArchitectureModel } from "../utils/useArchitectureModel";
import { createInteractionListPath } from "../App";
import Interaction from "./Interaction";

type StepperType = {
  label: string;
  component: ReactElement;
};
function InteractionDialog() {
  const [activeStep, setActiveStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [model, setModel] = useContext(AppModelContext);
  const [currentInteraction] = useContext(CurrentInteractionContext);
  const navigate = useNavigate();
  const [getInteractions, setInteractions] = useArchitectureModel();

  const params = useParams();
  let architectureId: number = Number(params.architectureId);
  if (!params.architectureId) architectureId = 0;
  const interactionId: string = params.interactionId
    ? params.interactionId
    : "new";

  const handleBack = () => {
    setSaved(false);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleSave = () => {
    if (interactionId === "new" || isNaN(Number(interactionId)))
      setInteractions([...getInteractions(), currentInteraction]);
    else {
      const newInteractions: IInteraction[] = [...getInteractions()];
      newInteractions[Number(interactionId)] = currentInteraction;
      setInteractions(newInteractions);
    }
    setSaved(true);
  };

  const steps: StepperType[] = [
    { label: "Name Interction", component: <Interaction /> },
    { label: "Define User", component: <Users /> },
    { label: "Define Components", component: <AppList /> },
    { label: "Define Relations", component: <AppRelationships /> },
    {
      label: "Confirm",
      component: (
        <Stack>
          <SequenceDiagram />
          <Box>
            <h2>Do you want to save this</h2>
            <IconButton onClick={handleSave}>
              <Save />
              Save
            </IconButton>
          </Box>
        </Stack>
      ),
    },
  ];

  const buttons = () => {
    return (
      <ButtonGroup>
        {activeStep !== 0 && (
          <IconButton onClick={handleBack}>
            <NavigateBefore />
            Prev
          </IconButton>
        )}
        {(activeStep !== steps.length - 1 || saved) && (
          <IconButton onClick={handleNext}>
            <NavigateNext />
            Next
          </IconButton>
        )}
      </ButtonGroup>
    );
  };

  const handleNext = () => {
    if (saved && activeStep === steps.length - 1) {
      return navigate(createInteractionListPath(architectureId));
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stack>
        <Stepper activeStep={activeStep}>
          {steps.map((item: StepperType, index: number) => {
            return (
              <Step key={"step-" + index}>
                <StepLabel>{item.label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <Box>{steps[activeStep].component}</Box>
        <Box>{buttons()}</Box>
      </Stack>
    </Box>
  );
}
export default InteractionDialog;
