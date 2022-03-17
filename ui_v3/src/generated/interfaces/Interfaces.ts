
/**
 * This is a generated code based on interface yaml. Please don't edit it
 * (c) Data Facade LLC.
 */
 
 import * as Entity from '../entities/Entities';
 
 export interface UpdateRequest<T> {
    newProperties: T
    filter: T
}


export interface UpdateActionDefinitionWithTemplate {
    filter?: Entity.ActionDefinition
	newProperties?: Entity.ActionDefinition
	ActionTemplateWithParameters?: ActionTemplatesWithParameters[]
}


export interface ActionDefinitionWithTags {
    model?: Entity.ActionDefinition
	tags?: Entity.Tag[]
}


export interface CreateApplicationRequest {
    model?: Entity.Application
	tags?: Entity.Tag[]
}


export interface WorkflowDefinitionWithExecutionDetails {
    ActionDefinition?: Entity.ActionDefinition
	ActionExecution?: Entity.ActionExecution
	stageId?: string
	stageName?: string
}


export interface ActionInstanceCardViewResponse {
    InstanceId?: string
	InstanceName?: string
	DefinitionId?: string
	DefinitionName?: string
	DefinitionActionType?: string
	DefinitionDescription?: string
	Status?: string
	DefinitionCreatedBy?: string
	DefinitionCreatedOn?: number
	NumberOfUsers?: number
}


export interface ApplicationCardViewResponse {
    ApplicationId?: string
	ApplicationName?: string
	ApplicationDescription?: string
	ApplicationCreatedBy?: string
	Status?: string
	ApplicationCreatedOn?: number
	NumberOfFlows?: number
	NumberOfActions?: number
	NumberOfDashboards?: number
	NumberOfUsers?: number
}


export interface ActionDetailsForApplication {
    model?: Entity.ActionDefinition
	stagesOrParameters?: number
	numberOfRuns?: number
	numberOfWorkflowActions?: number
	averageRunTime?: number
}


export interface ProviderInstanceDetails {
    numberOfExecutions?: number
	model?: Entity.ProviderInstance
	numberOfTables?: number
	lastSyncedOn?: number
}


export interface ApplicationDetails {
    numberOfActions?: number
	numberOfFlows?: number
	actions?: ActionDetailsForApplication[]
	workflows?: ActionDetailsForApplication[]
	model?: Entity.Application
}


export interface ActionTemplatesWithParameters {
    model?: Entity.ActionTemplate
	tags?: Entity.Tag[]
	actionParameterDefinitions?: ActionParameterDefinitionWithTags[]
}


export interface WorkflowActionExecutions {
    WorkflowDefinition?: Entity.ActionDefinition
	WorkflowExecution?: Entity.ActionExecution
	ChildExecutionsWithDefinitions?: WorkflowDefinitionWithExecutionDetails[]
}


export interface ProviderRunsHistoryAndParameters {
    history?: number[]
	ProviderParameterInstanceModels?: Entity.ProviderParameterInstance[]
	model?: Entity.ProviderInstance
	failedActions?: number
}


export interface TagDetails {
    Id?: string
	Name?: string
	TagGroup?: string
	ParentTagName?: string
	Scope?: string
	CreatedBy?: string
	Description?: string
	CountOfLinkedTableProperties?: number
	CountOfLinkedActionDefinition?: number
	CountOfLinkedActionParameterDefinition?: number
	CountOfLinkedColumnProperties?: number
	TotalLinkedEntities?: number
	LinkedSubsidiaries?: Entity.Tag[]
}


export interface WorkflowStagesWithActions {
    Actions?: Entity.ActionDefinition[]
	stageName?: string
}


export interface ActionDefinitionDetail {
    ActionDefinition?: ActionDefinitionWithTags
	ActionTemplatesWithParameters?: ActionTemplatesWithParameters[]
}


export interface ActionDefinitionCardViewResponse {
    DefinitionId?: string
	DefinitionName?: string
	DefinitionActionType?: string
	DefinitionDescription?: string
	DefinitionCreatedBy?: string
	UsageStatus?: string
	DefinitionCreatedOn?: number
	NumberOfUsers?: number
}


export interface ActionInstanceWithParameters {
    model?: Entity.ActionInstance
	ParameterInstances?: Entity.ActionParameterInstance[]
}


export interface ActionParameterDefinitionWithTags {
    model?: Entity.ActionParameterDefinition
	tags?: Entity.Tag[]
}


