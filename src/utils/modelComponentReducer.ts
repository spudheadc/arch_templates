import { RecordsEntity } from "../@types/Apps";
import { IRelationship, IUser } from "../@types/context";

// An enum with all the types of actions to use in our reducer
export enum ModelEvents {
    ADD = 'ADD',
    REMOVE = 'REMOVE',
    CLEAR = 'CLEAR',
    REMOVE_COMPONENT_RELATIONSHIPS = 'REMOVE_COMPONENT_RELATIONSHIPS',
}

// An interface for our actions
export interface ComponentEvent {
    type: ModelEvents;
    component: RecordsEntity;
}
// An interface for our actions
export interface RelationshipEvent {
    type: ModelEvents;
    relationship?: IRelationship;
    component?: string;
}
// An interface for our actions
export interface UserEvent {
    type: ModelEvents;
    user: IUser;
}

export function componentReducer(components: string[], action: ComponentEvent): string[] {
    const { type, component } = action;
    switch (type) {
        case ModelEvents.ADD:
            const found: boolean = components.reduce((acc: boolean, item: string) => {
                if (item === component.u_appid)
                    acc = true;
                return acc;
            }, false);
            if (!found)
                components.push(component.u_appid);
            return components;
        case ModelEvents.REMOVE:
            components = components.reduce((acc: Array<string>, item: string, index: number) => {
                if (item !== component.u_appid) {
                    acc.push(item);
                }
                return acc;
            }, []);
            return components;
        default:
        case ModelEvents.CLEAR:
            components = [];
            return components;
    }
}

export function relationshipReducer(relationships: IRelationship[], action: RelationshipEvent): IRelationship[] {
    const { type, relationship, component } = action;
    switch (type) {
        case ModelEvents.ADD:
            if (!relationship)
                return relationships;

            const found: boolean = relationships.reduce((acc: boolean, item: IRelationship) => {
                if (item.consumer === relationship.consumer && item.provider === relationship.provider && item.entrypoint === relationship.entrypoint)
                    acc = true;
                return acc;
            }, false);
            if (!found)
                relationships.push(relationship);
            return relationships;
        case ModelEvents.REMOVE:
            if (!relationship)
                return relationships;

            relationships = relationships.reduce((acc: Array<IRelationship>, item: IRelationship, index: number) => {
                if (item.consumer !== relationship.consumer || item.provider !== relationship.provider || item.entrypoint !== relationship.entrypoint) {
                    acc.push(item);
                }
                return acc;
            }, []);
            return relationships;
        case ModelEvents.REMOVE_COMPONENT_RELATIONSHIPS:
            if (!component)
                return relationships;

            relationships = relationships.reduce((acc: Array<IRelationship>, item: IRelationship, index: number) => {
                if (item.consumer !== component || item.provider !== component) {
                    acc.push(item);
                }
                return acc;
            }, []);
            return relationships;
        default:
        case ModelEvents.CLEAR:
            relationships = [];
            return relationships;
    }
}
