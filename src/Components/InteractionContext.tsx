import CurrentInteractionProvider from "../context/currentIneractionContext";
import InteractionDialog from "./InteractionDialog";

function InteractionContext() {
  return (
    <CurrentInteractionProvider>
      <InteractionDialog />
    </CurrentInteractionProvider>
  );
}
export default InteractionContext;
