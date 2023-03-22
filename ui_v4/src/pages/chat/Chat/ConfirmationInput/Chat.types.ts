import { TableProperties } from "@/generated/entities/Entities";
import { ActionDefinitionDetail, ActionInstanceWithParameters } from "@/generated/interfaces/Interfaces";
import { MessageTypeAndContent } from "../chatMultipleMessages";


export interface ActionMessageContent {actionInstanceWithParameterInstances: ActionInstanceWithParameters, actionDefinitionDetail?: ActionDefinitionDetail}

export interface TableInputContent {tableId?: string[], prompt: string, tableType?: "table" | "execution"}

export interface ActionOutputContent {executionId: string}

export interface TablePropertiesContent {Tables: TableProperties[]}

export interface ErrorMessageContent {error: string}

export type MultipleMessageContent = {messages: MessageTypeAndContent[], processedIndex?: number, decompositions?: string[]}

export type MessageContentTypes = ActionMessageContent | TableInputContent | TablePropertiesContent | ActionOutputContent | ErrorMessageContent