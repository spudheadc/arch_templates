import {
  AppModelContextType,
  IInteraction,
  IRelationship,
  IUser,
} from "../@types/context";
import { useContext } from "react";
import { AppModelContext } from "../context/appModelContext";
import { Box, CardContent, Divider } from "@mui/material";
import encoder from "plantuml-encoder";
import { RecordsEntity } from "../@types/Apps";
import { useRecordsEntity } from "../utils/useRecordsEntity";
import { CurrentInteractionContext } from "../context/currentIneractionContext";
import { CodeDisplay } from "./CodeDisplay";

function outputText(text: string) {
  return text.split("\n").map((str) => <div>{str}</div>);
}

const PlantUMLStart = `
@startuml
`;
const PlantUMLEnd = `
@enduml
`;

type SequenceDiagramProps = {
  interaction?: IInteraction;
};

function SequenceDiagram({ interaction }: SequenceDiagramProps) {
  const [getRecordsEntity] = useRecordsEntity();
  const [currentInteraction] = useContext(CurrentInteractionContext);

  if (!interaction) interaction = currentInteraction;

  var sequenceString = getSequenceDiagram(interaction, getRecordsEntity);
  return (
    <CodeDisplay codeString={sequenceString}>
      <img
        src={
          "http://www.plantuml.com/plantuml/img/" +
          encoder.encode(sequenceString)
        }
        alt="Plantuml diagram"
      />
    </CodeDisplay>
  );
}
export default SequenceDiagram;

function getSequenceDiagram(
  interaction: IInteraction,
  getRecordsEntity: (value: string) => RecordsEntity,
) {
  var sequenceString = PlantUMLStart;

  sequenceString = `actor "${interaction.user.name}" as ${interaction.user.person_id.replaceAll("-", "")} 
    `;

  var map: Record<string, RecordsEntity[]> = {};
  interaction.components.forEach((component) => {
    var item: RecordsEntity = getRecordsEntity(component);
    var key = item.u_domain_architect_group
      ? item.u_domain_architect_group
      : "";
    if (map[key]) map[key].push(item);
    else map[key] = [item];
  });

  for (const key in map) {
    const data: RecordsEntity[] = map[key];
    sequenceString += data.reduce((into: string, item: RecordsEntity) => {
      into += `participant "${item.name}" as ${item.u_appid}
`;
      return into;
    }, "");
  }

  var componentsSeen: Record<string, boolean> = {};
  sequenceString += interaction.relationships.reduce(
    (into: string, item: IRelationship) => {
      into += `${getRecordsEntity(item.consumer).u_appid} -> ${getRecordsEntity(item.provider).u_appid} : ${item.entrypoint}
        `;
      return into;
    },
    "",
  );
  sequenceString += PlantUMLEnd;
  return sequenceString;
}
