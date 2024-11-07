import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  AppModelContextType,
  IAppModel,
  IArchitectureModel,
  IInteraction,
  IRelationship,
  IUser,
} from "../@types/context";
import { useContext } from "react";
import { AppModelContext } from "../context/appModelContext";
import { Box, CardContent, Divider } from "@mui/material";
import { useRecordsEntity } from "../utils/useRecordsEntity";
import { CodeDisplay } from "./CodeDisplay";

function outputMarkDown(text: string) {
  return text.split("\n").map((str) => <div>{str}</div>);
}

type AppTableMarkdownProps = {
  interactions?: Array<IInteraction>;
};

function AppTableMarkdown({ interactions }: AppTableMarkdownProps) {
  const [model]: AppModelContextType = useContext(AppModelContext);
  const [getRecordsEntity] = useRecordsEntity();

  var components: Array<string> | undefined;
  var relationships: Array<IRelationship> | undefined;
  ({ components, relationships, interactions } = getComponents(
    interactions,
    model,
  ));

  var appTableMarkdown: string =
    "| App Id | App Name | Description |\n| ----- | ----- | ----- |\n";
  components.forEach(
    (item) =>
      (appTableMarkdown = appTableMarkdown.concat(
        "| " +
          getRecordsEntity(item).u_appid +
          " | " +
          getRecordsEntity(item).name +
          " | " +
          getRecordsEntity(item).short_description +
          " | \n",
      )),
  );

  var relTableMarkdown: string =
    "| Provider Name | Provider Id | Consumer Name | Consumer Id | Status |\n| ----- | ----- | ----- |  ----- | ----- |\n";
  relationships.forEach(
    (item) =>
      (relTableMarkdown = relTableMarkdown.concat(
        "| " +
          getRecordsEntity(item.provider).name +
          " | " +
          getRecordsEntity(item.provider).u_appid +
          " | " +
          getRecordsEntity(item.consumer).name +
          " | " +
          getRecordsEntity(item.consumer).u_appid +
          " | " +
          item.status +
          " | \n",
      )),
  );

  return (
    <>
      <CardContent>
        <Box>
          <h2>Applications</h2>
        </Box>

        <CodeDisplay codeString={appTableMarkdown}>
          <Markdown remarkPlugins={[remarkGfm]}>{appTableMarkdown}</Markdown>
        </CodeDisplay>
      </CardContent>
      <Divider />
      <CardContent>
        <Box>
          <h2>Relationships</h2>
        </Box>

        <CodeDisplay codeString={relTableMarkdown}>
          <Markdown remarkPlugins={[remarkGfm]}>{relTableMarkdown}</Markdown>
        </CodeDisplay>
      </CardContent>
      )
    </>
  );
}
export default AppTableMarkdown;

function getComponents(
  interactions: IInteraction[] | undefined,
  model: IAppModel,
) {
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
  return { components, relationships, interactions };
}
