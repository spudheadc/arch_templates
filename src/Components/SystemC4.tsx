import {
  AppModelContextType,
  IArchitectureModel,
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

function outputText(text: string) {
  return text.split("\n").map((str) => <div>{str}</div>);
}

const c4SHeadertring = `
@startuml
!include <C4/C4_Container>
`;
const c4SFootertring = `
@enduml
`;

type SystemC4Props = {
  interactions?: Array<IInteraction>;
};

function SystemC4({ interactions }: SystemC4Props) {
  const [model]: AppModelContextType = useContext(AppModelContext);
  const [getRecordsEntity] = useRecordsEntity();

  var users: Array<IUser> = [];
  var components: Array<string> = [];
  var relationships: Array<IRelationship> = [];

  if (!interactions) {
    let newInteractions: Array<IInteraction> = new Array<IInteraction>();
    model.architectures.forEach((item: IArchitectureModel) => {
      newInteractions.push(...item.interactions);
    });
    interactions = newInteractions;
  }

  interactions.forEach((item) => {
    users.push(item.user);
    components.push(...item.components);
    relationships.push(...item.relationships);
  });
  const userNameMap: string[] = users.map((e: IUser) => e.name);
  users = users.filter((element: IUser, index: number) => {
    return userNameMap.indexOf(element.name) == index;
  });
  components = components.filter((element: string, index: number) => {
    return components.indexOf(element) == index;
  });

  var c4String = c4SHeadertring;
  c4String = users.reduce((into: string, item: IUser) => {
    into += `Person(${item.person_id.replaceAll("-", "")}, ${item.name},  $tags=${item.type})
    `;
    return into;
  }, c4String);
  var map: Record<string, RecordsEntity[]> = {};
  components.forEach((component) => {
    var item: RecordsEntity = getRecordsEntity(component);
    var key = item.u_domain_architect_group
      ? item.u_domain_architect_group
      : "";
    if (map[key]) map[key].push(item);
    else map[key] = [item];
  });
  for (const key in map) {
    const data: RecordsEntity[] = map[key];
    const containersC4 = data.reduce((into: string, item: RecordsEntity) => {
      into += `Container(${item.u_appid}, ${item.name}, "", $tags=${item.life_cycle_stage})
`;
      return into;
    }, "");
    if (data[0] && data[0].u_domain_architect_group)
      c4String += `System_Boundary(system_${encodeURI(data[0].u_domain_architect_group)}, ${data[0].u_domain_architect_group}){
                ${containersC4}
            }
            `;
  }

  var componentsSeen: Record<string, boolean> = {};
  c4String += relationships.reduce((into: string, item: IRelationship) => {
    if (!componentsSeen[item.consumer + "-" + item.provider])
      into += `Rel(${getRecordsEntity(item.consumer).u_appid.replaceAll("-", "")},${getRecordsEntity(item.provider).u_appid} , "Uses", "HTTPS")
            `;
    componentsSeen[item.consumer + "-" + item.provider] = true;
    return into;
  }, "");
  c4String += c4SFootertring;
  const plantumlURL =
    "http://www.plantuml.com/plantuml/img/" + encoder.encode(c4String);

  console.log("PlantUML URL =" + plantumlURL);
  return (
    <>
      <CardContent>
        <img src={plantumlURL} alt="Plantuml diagram" />
        <Divider />
        <Box>
          <h2>C4 code</h2>
        </Box>
        <Box>{outputText(c4String)}</Box>
      </CardContent>
      )
    </>
  );
}
export default SystemC4;
