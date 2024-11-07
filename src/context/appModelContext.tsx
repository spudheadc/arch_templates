import { Context, createContext, FC, useState } from "react";
import {
  AppModelContextType,
  IAppModel,
  IInteraction,
  IRelationship,
  IArchitectureModel,
  IUser,
} from "../@types/context";
import { Apps, RecordsEntity } from "../@types/Apps";
import Fuse from "fuse.js";
const apps: Apps = require("../data/apps.json");
const appSet: Record<string, RecordsEntity> = apps.records.reduce(
  (acc: Record<string, RecordsEntity>, item: RecordsEntity, index: number) => {
    if (item.u_appid) acc[item.u_appid] = item;
    return acc;
  },
  {},
);

const initSearch = () => {
  const options = {
    // isCaseSensitive: false,
    includeScore: true,
    // shouldSort: true,
    includeMatches: true,
    // findAllMatches: false,
    minMatchCharLength: 1,
    // location: 0,
    threshold: 0.4,
    // distance: 100,
    // useExtendedSearch: false,
    ignoreLocation: true,
    // ignoreFieldNorm: false,
    keys: [
      { name: "name", weight: 1.0 },
      { name: "short_description", weight: 0.1 },
    ],
  };

  const appsIndex = Fuse.createIndex(options.keys, apps.records);
  const fuse: Fuse<RecordsEntity> = new Fuse(apps.records, options, appsIndex);

  return {
    appSearch: fuse,
    apps: appSet,
    appList: apps.records,
  };
};
const initialContext: AppModelContextType = [
  {
    name: "",
    description: "",
    apps: {},
    appList: [],
    architectures: [],
  },
  () => {
    Array<IArchitectureModel>();
  },
];

export const AppModelContext: Context<AppModelContextType> =
  createContext<AppModelContextType>(initialContext);

const AppModelProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const value: string | null = localStorage.getItem("architecture");
  let obj =
    value === null
      ? {
          architectures: [
            {
              name: "",
              description: "",
              interactions: new Array<IInteraction>(),
              users:new Array<IUser>
            },
          ],
        }
      : JSON.parse(value);
  const [model, setModel] = useState<IAppModel>({
    ...initSearch(),
    ...obj,
  });
  let overridenSetState = (param: any) => {
    localStorage.setItem(
      "architecture",
      JSON.stringify({
        architectures: param.architectures,
      }),
    );
    return setModel(param);
  };

  return (
    <AppModelContext.Provider value={[model, overridenSetState]}>
      {children}
    </AppModelContext.Provider>
  );
};
export default AppModelProvider;
