import {
  Add,
  AddCircle,
  Cancel,
  Delete,
  Done,
  Edit,
} from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useContext, useState } from "react";
import { IArchitectureModel, IInteraction, IUser } from "../@types/context";
import { AppModelContext } from "../context/appModelContext";
import { useNavigate } from "react-router-dom";
import { createInteractionListPath } from "../App";

function ArchitectureList() {
  const [model, setModel] = useContext(AppModelContext);
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newArchitecture, setNewArchitecture] = useState<IArchitectureModel>({
    name: "",
    description: "",
    interactions: new Array<IInteraction>(),
    users: new Array<IUser>(),
  });

  const handleOk = () => {
    setModel({
      ...model,
      architectures: [...model.architectures, newArchitecture],
    });
    setDialogOpen(false);
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {model.architectures.map((key: IArchitectureModel, index: number) => (
            <TableRow key={index}>
              <TableCell>{key.name}</TableCell>
              <TableCell>{key.description}</TableCell>
              <TableCell>
                <Edit
                  onClick={() => navigate(createInteractionListPath(index))}
                />
                <Delete onClick={() => handleDelete(index)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <IconButton>
        <AddCircle onClick={() => setDialogOpen(true)} />
      </IconButton>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>New Relationship</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add a new architecture we need some basic details
          </DialogContentText>
          <Stack>
            <TextField
              id="architecture-name"
              label="Name"
              value={newArchitecture.name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setNewArchitecture({
                  ...newArchitecture,
                  name: event.target.value,
                });
              }}
            />
            <TextField
              id="architecture-name"
              label="Description"
              value={newArchitecture.description}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setNewArchitecture({
                  ...newArchitecture,
                  description: event.target.value,
                });
              }}
            />
          </Stack>
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

  function changeField(index: number, field: string, value: string): void {
    let newArchitectures: IArchitectureModel[] = [...model.architectures];
    newArchitectures[index] = { ...newArchitectures[index], [field]: value };
    setModel({ ...model, architectures: newArchitectures });
  }

  function handleDelete(indexToRemove: number): void {
    setModel({
      ...model,
      architectures: [
        ...model.architectures.slice(0, indexToRemove),
        ...model.architectures.slice(indexToRemove + 1),
      ],
    });
  }
}

export default ArchitectureList;
