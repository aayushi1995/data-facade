import { ActionDefinitionDetail, ActionInstanceWithParameters } from "@/generated/interfaces/Interfaces";

export type ActionMessageContent = {actionInstanceWithParameterInstances: ActionInstanceWithParameters, actionDefinitionDetail?: ActionDefinitionDetail}

export type TableInputContent = {tableId?: string, prompt: string}
