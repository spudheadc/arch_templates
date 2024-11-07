import { Autocomplete, Stack, TextField } from "@mui/material";
import { useContext } from "react";
import { IInteraction, IUser } from "../@types/context";
import { CurrentInteractionContext } from "../context/currentIneractionContext";
import { v4 as uuidv4 } from "uuid";

function Interaction() {
  const [interaction, setInteraction] = useContext(CurrentInteractionContext);

  const changeName = (name: string) => {
    var newInteraction: IInteraction = { ...interaction, name: name };
    setInteraction(newInteraction);
  };
  const changeDescription = (description: string) => {
    var newInteraction: IInteraction = {
      ...interaction,
      description: description,
    };
    setInteraction(newInteraction);
  };

  return (
    <>
      <h2>First we have to define an interaction</h2>
      <Stack spacing={2}>
        <TextField
          id="interaction-name"
          label="Name"
          value={interaction.name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            changeName(event.target.value);
          }}
        />
        <TextField
          id="interaction-description"
          label="Description"
          value={interaction.description}
          multiline
          rows={4}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            changeDescription(event.target.value);
          }}
        />
      </Stack>
    </>
  );
}

export default Interaction;
