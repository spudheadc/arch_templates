import { useContext } from "react";
import {
  AppModelContextType,
  IArchitectureModel,
  IInteraction,
  IUser,
} from "../@types/context";
import { AppModelContext } from "../context/appModelContext";
import { useParams } from "react-router-dom";

type GetInteractions = () => Array<IInteraction>;
type SetInteractions = (value: Array<IInteraction>) => void;
type GetUsers = () => Array<IUser>;
type SetUsers = (value: Array<IUser>) => void;

type AppendInteraction = (value: IInteraction) => void;

export function useArchitectureModel(): [
  getInteractions: GetInteractions,
  setInteractions: SetInteractions,
  getUsers: GetUsers,
  setUsers: SetUsers,
] {
  const [model, setModel]: AppModelContextType = useContext(AppModelContext);
  const params = useParams();

  let architectureId: number = Number(params.architectureId);
  if (!params.architectureId) architectureId = 0;

  const getInteractions = () => {
    return model.architectures[architectureId].interactions;
  };

  const setInteractions = (value: Array<IInteraction>) => {
    let newArchitectures: IArchitectureModel[] = [...model.architectures];
    newArchitectures[architectureId] = {
      ...newArchitectures[architectureId],
      interactions: value,
    };
    setModel({ ...model, architectures: newArchitectures });
  };

  const getUsers = () => {
    return model.architectures[architectureId].users;
  };

  const setUsers = (value: Array<IUser>) => {
    let newArchitectures: IArchitectureModel[] = [...model.architectures];
    newArchitectures[architectureId] = {
      ...newArchitectures[architectureId],
      users: value,
    };
    setModel({ ...model, architectures: newArchitectures });
  };

  return [getInteractions, setInteractions, getUsers, setUsers];
}
