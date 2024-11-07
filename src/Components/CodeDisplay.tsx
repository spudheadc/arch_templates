import { Done, OpenInNew } from "@mui/icons-material";
import {
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid2,
  IconButton,
} from "@mui/material";
import { ReactElement, useState } from "react";
import encoder from "plantuml-encoder";

type CodeDisplayType = {
  codeString: string;
  children: React.ReactNode;
};
function outputText(text: string) {
  return text.split("\n").map((str) => <div>{str}</div>);
}

export function CodeDisplay({ codeString, children }: CodeDisplayType) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Grid2 container>
        <Grid2 size={11}>
          <Container>({children})</Container>
        </Grid2>
        <Grid2 size={1}>
          <IconButton onClick={() => setDialogOpen(true)} type="submit">
            <OpenInNew />
          </IconButton>
        </Grid2>
      </Grid2>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Code</DialogTitle>
        <DialogContent>
          <DialogContentText>{outputText(codeString)}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={() => setDialogOpen(false)} type="submit">
            <Done></Done>Ok
          </IconButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
