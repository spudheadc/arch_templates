import Fuse from "fuse.js";
import { RecordsEntity } from "./Apps";
import { Dispatch, SetStateAction } from "react";

export interface IUser {
  person_id: string;
  name: string;
  type: string;
}
export interface IRelationship {
  consumer: string;
  provider: string;
  entrypoint: string;
  status: string;
}
export interface IInteraction {
  interaction_id: string;
  name: string;
  description?: string;
  user: IUser;
  components: Array<string>;
  relationships: Array<IRelationship>;
}

export interface IArchitectureModel {
  name: string;
  description?: string;
  interactions: Array<IInteraction>;
  users: Array<IUser>;
}
export interface IAppModel {
  name: string;
  description?: string;
  appSearch?: Fuse<RecordsEntity>;
  apps: Record<string, RecordsEntity>;
  appList: RecordsEntity[];
  architectures: Array<IArchitectureModel>;
}
export type AppModelContextType = [
  model: IAppModel,
  setModel: Dispatch<SetStateAction<IAppModel>>,
];

export type CurrentInteractionContextType = [
  interaction: IInteraction,
  setInteraction: Dispatch<SetStateAction<IInteraction>>,
];
