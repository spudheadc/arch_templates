import { Delete } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  FilterOptionsState,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import { useContext, useReducer } from "react";
import { RecordsEntity } from "../@types/Apps";
import { IRelationship } from "../@types/context";
import { AppModelContext } from "../context/appModelContext";
import {
  ComponentEvent,
  componentReducer,
  ModelEvents,
  RelationshipEvent,
  relationshipReducer,
} from "../utils/modelComponentReducer";
import { CurrentInteractionContext } from "../context/currentIneractionContext";
import { useRecordsEntity } from "../utils/useRecordsEntity";

function AppList() {
  const [getApp] = useRecordsEntity();
  const [appModel] = useContext(AppModelContext);
  const [interaction, setInteraction] = useContext(CurrentInteractionContext);

  // Note: we need to override the reducer function to set the interaction.
  const [componentList, dispatch] = useReducer(
    (components: string[], action: ComponentEvent) => {
      const ret: string[] = componentReducer(components, action);
      setInteraction({ ...interaction, components: ret });
      return ret;
    },
    interaction.components,
  );
  const [relationshipList, relDispatch] = useReducer(
    (components: IRelationship[], action: RelationshipEvent) => {
      const ret: IRelationship[] = relationshipReducer(components, action);
      setInteraction({ ...interaction, relationships: ret });
      return ret;
    },
    interaction.relationships,
  );

  const searchItem = (
    options: RecordsEntity[],
    state: FilterOptionsState<RecordsEntity>,
  ): RecordsEntity[] => {
    if (!state.inputValue || !appModel.appSearch) return options;
    return appModel.appSearch
      .search<RecordsEntity>(state.inputValue)
      .map((record) => record.item);
  };

  return (
    <>
      <h2>Now we define what applications are in scope</h2>
      <Table sx={{ height: 400, overflowY: "scroll" }}>
        <TableHead>
          <TableRow>
            <TableCell>App Id</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {componentList.map((key: string, index: number) => (
            <TableRow key={index}>
              <TableCell>{getApp(key).name}</TableCell>
              <TableCell>{getApp(key).u_appid}</TableCell>
              <TableCell>{getApp(key).short_description}</TableCell>
              <TableCell onClick={() => handleDelete(key)}>
                <Delete />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Stack direction="row" spacing={2}>
        <Autocomplete
          sx={{ width: 500 }}
          filterOptions={searchItem}
          options={appModel.appList}
          getOptionLabel={(option) => (option.name ? option.name : "")}
          renderInput={(params) => (
            <TextField {...params} label="Application Name" />
          )}
          renderOption={(props, option) => {
            const { key, ...optionProps } = props;
            return (
              <Tooltip title={option.short_description} arrow>
                <Box
                  key={key}
                  component="li"
                  sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                  {...optionProps}
                >
                  {option.name} ({option.u_appid})
                </Box>
              </Tooltip>
            );
          }}
          onChange={(event: any, newValue: RecordsEntity | null) => {
            if (newValue) {
              dispatch({ type: ModelEvents.ADD, component: newValue });
            }
          }}
        />
      </Stack>
    </>
  );

  function handleDelete(key: string): void {
    dispatch({ type: ModelEvents.REMOVE, component: getApp(key) });
    relDispatch({
      type: ModelEvents.REMOVE_COMPONENT_RELATIONSHIPS,
      component: key,
    });
  }
}

export default AppList;
