import {
  Autocomplete,
  Box,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { RecordsEntity } from "../@types/Apps";
import { useContext, useEffect, useState } from "react";
import { AppModelContextType, IRelationship } from "../@types/context";
import { AppModelContext } from "../context/appModelContext";
import { Add } from "@mui/icons-material";
import { useRecordsEntity } from "../utils/useRecordsEntity";
import { CurrentInteractionContext } from "../context/currentIneractionContext";

type setRelationship = (relation: IRelationship) => void;
type RelationshipProps = {
  relationship: IRelationship;
  setRelationship: setRelationship;
};
function Relationship({ relationship, setRelationship }: RelationshipProps) {
  const [appContext]: AppModelContextType = useContext(AppModelContext);
  const [interaction, setInteraction] = useContext(CurrentInteractionContext);
  const isInitial: boolean = interaction.relationships.length == 0;

  const [getRecordsEntity] = useRecordsEntity();

  const setProvider = (value: string) =>
    setRelationship({ ...relationship, provider: value });
  const setConsumer = (value: string) =>
    setRelationship({ ...relationship, consumer: value });
  const setEntrypoint = (value: string) =>
    setRelationship({ ...relationship, entrypoint: value });
  const setStatus = (value: string) =>
    setRelationship({ ...relationship, status: value });

  const renderOptionFunc = (
    props: React.HTMLAttributes<HTMLLIElement> & { key: any },
    option: string,
  ) => {
    const { key, ...optionProps } = props;
    const item: RecordsEntity = getRecordsEntity(option);
    return (
      <Tooltip title={item.short_description} arrow>
        <Box
          key={key}
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          {...optionProps}
        >
          {item.name} ({item.u_appid})
        </Box>
      </Tooltip>
    );
  };

  const getOptionLabel = (option: string): string => {
    var recordsEntity: RecordsEntity = getRecordsEntity(option);
    return recordsEntity.name ? recordsEntity.name : "";
  };
  return (
    <>
      <Stack spacing={2}>
        {isInitial && (
          <TextField
            label="Consumer"
            value={interaction.user.name}
            disabled={true}
          />
        )}
        {!isInitial && (
          <Autocomplete
            options={interaction.components}
            getOptionLabel={getOptionLabel}
            renderInput={(params) => (
              <TextField {...params} label="Consumer Application" />
            )}
            value={relationship.consumer}
            onChange={(event: any, newValue: string | null) => {
              setConsumer(newValue ? newValue : "");
            }}
            renderOption={(props, option) => renderOptionFunc(props, option)}
          />
        )}

        <Autocomplete
          options={interaction.components}
          getOptionLabel={getOptionLabel}
          renderInput={(params) => (
            <TextField {...params} label="Provider Application" />
          )}
          value={relationship.provider}
          onChange={(event: any, newValue: string | null) => {
            setProvider(newValue ? newValue : "");
          }}
          renderOption={(props, option) => renderOptionFunc(props, option)}
        />

        <TextField
          id="outlined-name"
          label="API/Entrypoint"
          value={relationship.entrypoint}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setEntrypoint(event.target.value);
          }}
        />
        <Autocomplete
          options={["new", "existing"]}
          renderInput={(params) => (
            <TextField {...params} label="Relationship Status" />
          )}
          value={relationship.status}
          onChange={(event: any, newValue: string | null) => {
            setStatus(newValue ? newValue : "");
          }}
        />
      </Stack>
    </>
  );
}
export default Relationship;
