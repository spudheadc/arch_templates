import { useContext } from "react";
import { RecordsEntity } from "../@types/Apps";
import { AppModelContextType, IInteraction, IUser } from "../@types/context";
import { AppModelContext } from "../context/appModelContext";
import { CurrentInteractionContext } from "../context/currentIneractionContext";
import { useArchitectureModel } from "./useArchitectureModel";

type GetRecordsEntity = (value: string) => RecordsEntity;

export function useRecordsEntity(): [getRecordsEntity: GetRecordsEntity] {
  const [model]: AppModelContextType = useContext(AppModelContext);
  const [interaction, setInteraction] = useContext(CurrentInteractionContext);
  const [getInteractions, setInteractions] = useArchitectureModel();

  // need something about all interactions and current interaction

  return [
    (option: string) => {
      if (model.apps[option]) return model.apps[option];

      if (interaction.user.person_id === option)
        return {
          u_appid: interaction.user.person_id.replaceAll("-", ""),
          name: interaction.user.name,
          short_description: interaction.user.type,
        };

      return getInteractions().reduce(
        (user: RecordsEntity, item: IInteraction) => {
          if (item.user.person_id === option)
            user = {
              u_appid: item.user.person_id,
              name: item.user.name,
              short_description: item.user.type,
            };
          return user;
        },
        { u_appid: "", name: "", short_description: "" },
      );
    },
  ];
}
