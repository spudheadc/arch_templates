import { AddCircle, Cancel, Delete, Done, Edit } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useContext, useReducer, useState } from "react";
import { IRelationship } from "../@types/context";
import { AppModelContext } from "../context/appModelContext";
import Relationship from "./Relationship";
import { useRecordsEntity } from "../utils/useRecordsEntity";
import {
  ModelEvents,
  RelationshipEvent,
  relationshipReducer,
} from "../utils/modelComponentReducer";
import { CurrentInteractionContext } from "../context/currentIneractionContext";

function AppRelationships() {
  const [appModel] = useContext(AppModelContext);
  const [interaction, setInteraction] = useContext(CurrentInteractionContext);
  const initialConsumer: string =
    interaction.relationships.length == 0
      ? interaction.user.person_id
      : interaction.relationships[interaction.relationships.length - 1]
          .provider;

  const [relationship, setRelationship] = useState<IRelationship>({
    consumer: initialConsumer,
    provider: "",
    entrypoint: "",
    status: "",
  });
  const [getRecordsEntity] = useRecordsEntity();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [relationshipList, dispatch] = useReducer(
    (components: IRelationship[], action: RelationshipEvent) => {
      const ret: IRelationship[] = relationshipReducer(components, action);
      setInteraction({ ...interaction, relationships: ret });
      return ret;
    },
    interaction.relationships,
  );

  const handleCancel = () => {
    setDialogOpen(false);
  };

  const handleOk = () => {
    dispatch({ type: ModelEvents.ADD, relationship: relationship });
    setDialogOpen(false);
    setRelationship({
      consumer: relationship.provider,
      provider: "",
      entrypoint: "",
      status: "",
    });
  };

  const handleEdit = (relationship: IRelationship) => {
    setRelationship(relationship);
    setDialogOpen(true);
  };

  const handleDelete = (item: IRelationship) => {
    setRelationship({
      consumer: interaction.user.person_id,
      provider: "",
      entrypoint: "",
      status: "",
    });
    dispatch({ type: ModelEvents.REMOVE, relationship: item });
  };

  return (
    <>
      <h2>And then we define the realtionships between the applications</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Consumer</TableCell>
            <TableCell>Provider</TableCell>
            <TableCell>API/Entrypoint</TableCell>
            <TableCell>Status</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {relationshipList.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{getRecordsEntity(item.consumer).name}</TableCell>
              <TableCell>{getRecordsEntity(item.provider).name}</TableCell>
              <TableCell>{item.entrypoint}</TableCell>
              <TableCell>{item?.status}</TableCell>
              <TableCell>
                <Edit onClick={() => handleEdit(item)} />
              </TableCell>
              <TableCell>
                <Delete onClick={() => handleDelete(item)} />
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
            To add a new relationship you need to specify the consumer, the
            provider and the type of relationship
          </DialogContentText>
          <Relationship
            relationship={relationship}
            setRelationship={setRelationship}
          ></Relationship>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={handleCancel}>
            <Cancel></Cancel>Cancel
          </IconButton>
          <IconButton onClick={handleOk} type="submit">
            <Done></Done>Ok
          </IconButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AppRelationships;
