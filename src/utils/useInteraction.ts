import { useContext } from "react";
import {
  AppModelContextType,
  IArchitectureModel,
  IInteraction,
} from "../@types/context";
import { AppModelContext } from "../context/appModelContext";
import { useParams } from "react-router-dom";

type GetInteraction = () => IInteraction;
type SetInteraction = (value: IInteraction) => void;

type AppendInteraction = (value: IInteraction) => void;

export function useInteraction(): [
  getInteractions: GetInteraction,
  setInteractions: SetInteraction,
] {
  const [model, setModel]: AppModelContextType = useContext(AppModelContext);
  const params = useParams();

  let architectureId: number = Number(params.architectureId);
  if (!params.architectureId) architectureId = 0;

  let interactionid: number = Number(params.interactionid);
  if (!params.interactionid) interactionid = 0;

  const getInteraction = () => {
    return model.architectures[architectureId].interactions[interactionid];
  };

  const setInteraction = (value: IInteraction) => {
    let newInteractions: IInteraction[] = [
      ...model.architectures[architectureId].interactions,
    ];
    newInteractions[interactionid] = value;
    let newArchitectures: IArchitectureModel[] = [...model.architectures];
    newArchitectures[architectureId] = {
      ...newArchitectures[architectureId],
      interactions: newInteractions,
    };
    setModel({ ...model, architectures: newArchitectures });
  };

  return [getInteraction, setInteraction];
}
