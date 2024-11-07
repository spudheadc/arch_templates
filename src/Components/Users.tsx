import { Cancel, Done } from "@mui/icons-material";
import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IInteraction, IUser } from "../@types/context";
import { CurrentInteractionContext } from "../context/currentIneractionContext";
import { useArchitectureModel } from "../utils/useArchitectureModel";

function Users() {
  const [interaction, setInteraction] = useContext(CurrentInteractionContext);
  const [interactions, setInteractions, getUsers, setUsers] =
    useArchitectureModel();
  const [name, setName] = useState(interaction.user.name);
  const [type, setType] = useState(interaction.user.type);
  const [dialogOpen, setDialogOpen] = useState(false);

  const upsertUser = (user: IUser): IUser => {
    let users: IUser[] = getUsers();
    if (!users) users = [];
    const index: number = users.reduce(
      (val: number, item: IUser, currentIndex: number) => {
        return val === -1 && item.name === user.name ? currentIndex : val;
      },
      -1,
    );
    if (index === -1) {
      user.person_id = uuidv4();
      users = [...users, user];
    } else {
      users[index] = user;
    }
    setUsers(users);

    return user;
  };

  const handleOk = () => {
    setUser(upsertUser({ person_id: "", name: name, type: type }));
    setDialogOpen(false);
  };
  return (
    <>
      <h2>And define who is the user for this interaction</h2>
      <Stack spacing={2}>
        <Autocomplete
          options={getUsers()}
          renderInput={(params) => (
            <TextField {...params} id="users" label="User Type" />
          )}
          value={interaction.user}
          onChange={(event: any, newUser: IUser | null) => {
            if (!newUser) return;
            setUser(newUser);
          }}
          getOptionLabel={(option: IUser) => (option.name ? option.name : "")}
        />
      </Stack>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>New Relationship</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add a new user please enter some basic details
          </DialogContentText>

          <TextField
            id="user-name"
            label="User Name"
            value={name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setName(event.target.value);
            }}
          />
          <Autocomplete
            options={["Internal", "External"]}
            renderInput={(params) => (
              <TextField {...params} id="user-type" label="User Type" />
            )}
            value={type}
            onChange={(event: any, newValue: string | null) => {
              setType(newValue ? newValue : "");
            }}
          />
        </DialogContent>
        <DialogActions>
          <IconButton onClick={() => setDialogOpen(false)}>
            <Cancel></Cancel>Cancel
          </IconButton>
          <IconButton onClick={handleOk} type="submit">
            <Done></Done>Ok
          </IconButton>
        </DialogActions>
      </Dialog>
    </>
  );

  function setUser(newUser: IUser) {
    var newInteraction: IInteraction = {
      ...interaction,
      user: newUser,
    };
    setInteraction(newInteraction);
  }
}

export default Users;
