import {
  Context,
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import {
  CurrentInteractionContextType,
  IInteraction,
  IRelationship,
} from "../@types/context";
import { useParams } from "react-router-dom";
import { useArchitectureModel } from "../utils/useArchitectureModel";

var nullInteraction: IInteraction = {
  interaction_id: "",
  name: "",
  user: { person_id: "", name: "", type: "" },
  components: new Array<string>(),
  relationships: Array<IRelationship>(),
};
const initialContext: CurrentInteractionContextType = [
  nullInteraction,
  () => nullInteraction,
];

export const CurrentInteractionContext: Context<CurrentInteractionContextType> =
  createContext<CurrentInteractionContextType>(initialContext);

const CurrentInteractionProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const params = useParams();
  const [getInteractions, setInteractions] = useArchitectureModel();

  const initialInteraction: IInteraction =
    params.interactionId && !isNaN(Number(params.interactionId))
      ? getInteractions()[Number(params.interactionId)]
      : {
          interaction_id: uuidv4(),
          name: "",
          user: { person_id: "", name: "", type: "" },
          components: new Array<string>(),
          relationships: Array<IRelationship>(),
        };

  const interaction = useState<IInteraction>(initialInteraction);

  return (
    <CurrentInteractionContext.Provider value={interaction}>
      {children}
    </CurrentInteractionContext.Provider>
  );
};
export default CurrentInteractionProvider;
