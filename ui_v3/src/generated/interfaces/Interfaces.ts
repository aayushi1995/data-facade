
/**
 * This is a generated code based on interface yaml. Please don't edit it
 * (c) Data Facade LLC.
 */
 
 import * as Entity from '../entities/Entities';
 
 export interface UpdateRequest<T> {
    newProperties: T
    filter: T
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
	DefinitionPublishStatus?: string
}


export interface ActionDefinitionDetail {
    ActionDefinition?: ActionDefinitionWithTags
	ActionTemplatesWithParameters?: ActionTemplatesWithParameters[]
}


export interface ActionDefinitionSelectorResponse {
    ActionId?: string
	ActionDisplayName?: string
	ActionOutputType?: string
	ActionParameterCount?: number
	ActionRuns?: number
	ActionDescription?: String
}


export interface ActionDefinitionWithTags {
    model?: Entity.ActionDefinition
	tags?: Entity.Tag[]
}


export interface ActionDetailsForApplication {
    model?: Entity.ActionDefinition
	stagesOrParameters?: number
	numberOfRuns?: number
	numberOfWorkflowActions?: number
	averageRunTime?: number
}


export interface ActionExecutionIncludeDefinitionInstanceDetailsResponse {
    ActionDefinition?: Entity.ActionDefinition
	ActionInstance?: Entity.ActionInstance
	ActionExecution?: Entity.ActionExecution
	ActionParameterDefinitions?: Entity.ActionParameterDefinition[]
	ActionParameterInstances?: Entity.ActionParameterInstance[]
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


export interface ActionInstanceDetails {
    ActionDefinition?: Entity.ActionDefinition
	ActionInstance?: Entity.ActionInstance
	ActionParameterDefinition?: Entity.ActionParameterDefinition[]
	ActionParameterInstance?: Entity.ActionParameterInstance[]
}


export interface ActionInstanceWithParameters {
    model?: Entity.ActionInstance
	ParameterInstances?: Entity.ActionParameterInstance[]
}


export interface ActionParameterDefinitionWithTags {
    model?: Entity.ActionParameterDefinition
	tags?: Entity.Tag[]
}


export interface ActionTemplatesWithParameters {
    model?: Entity.ActionTemplate
	tags?: Entity.Tag[]
	actionParameterDefinitions?: ActionParameterDefinitionWithTags[]
}


export interface ApplicationCardViewResponse {
    ApplicationId?: string
	ApplicationName?: string
	ApplicationDescription?: string
	ApplicationCreatedBy?: string
	Status?: string
	ApplicationArtifactLocation?: string
	ApplicationCreatedOn?: number
	NumberOfFlows?: number
	NumberOfActions?: number
	NumberOfDashboards?: number
	NumberOfUsers?: number
	InstallationStatus?: boolean
}


export interface ApplicationDetails {
    numberOfActions?: number
	numberOfFlows?: number
	actions?: ActionDetailsForApplication[]
	workflows?: ActionDetailsForApplication[]
	model?: Entity.Application
	gitSyncStatus?: boolean
}


export interface ApplicationRunsByMe {
    ApplicationModel?: Entity.Application
	ActionDefinitions?: Entity.ActionDefinition[]
	ActionInstances?: Entity.ActionInstance[]
	ActionExecutions?: Entity.ActionExecution[]
}


export interface ChartWithData {
    model?: Entity.Chart
	chartData?: object
	rawData?: object
}


export interface ColumnDetailUpload {
    ColumnEntity?: Entity.ColumnProperties
	Tags?: Entity.Tag[]
}


export interface ColumnInfo {
    ColumnProperties?: Entity.ColumnProperties
	NumberOfActions?: number
}


export interface CopyActionDefinitionPayload {
    ExistingActionId?: string
}


export interface CreateApplicationRequest {
    model?: Entity.Application
	tags?: Entity.Tag[]
}


export interface DashboardChartWithData {
    chartWithData?: ChartWithData
	layout?: string
	ActionInstanceId?: string
}


export interface DashboardDetails {
    numberOfCharts?: number
	model?: Entity.Dashboard
}


export interface ExecutionLogsStatus {
    logsPresent?: boolean
}


export interface FilteredColumnsResponse {
    Columns?: Entity.ColumnProperties[]
	FilteredBasedOnTags?: boolean
}


export interface GetSlackChannelsResponse {
    entity?: Entity.ProviderInstance
	channels?: SlackConversation[]
}


export interface ManagementServiceUser {
    id?: string
	firstName?: string
	lastName?: string
	org_name?: string
	email?: string
	featureConfig?: string
	persona?: string
	signedEULA?: boolean
}


export interface OOBActionStatus {
    ActionDefinitionId?: string
	ActionExecutionId?: string
	ActionExecutionStatus?: string
}


export interface PossibleAutoFlows {
    PossibleAutoFlow?: string[]
}


export interface ProviderCardView {
    ProviderInstance?: Entity.ProviderInstance
	ProviderDefinition?: Entity.ProviderDefinition
	ProviderInstanceStat?: ProviderInstanceStat
	SyncActionInstance?: Entity.ActionInstance
}


export interface ProviderDefinitionDetail {
    ProviderDefinition?: Entity.ProviderDefinition
	ProviderParameterDefinition?: Entity.ProviderParameterDefinition[]
}


export interface ProviderHistoryStat {
    ActionRunHistory?: number[]
	FailedActionCount?: number
}


export interface ProviderInformation {
    ProviderInstance?: ProviderInstanceWithTags
	ProviderParameterInstance?: Entity.ProviderParameterInstance[]
}


export interface ProviderInstanceStat {
    NumberOfExecutions?: number
	NumberOfTables?: number
	LastSyncedOn?: number
	NumberOfCompletedExecutions?: number
	NumberOfRunningExecutions?: number
	NumberOfFailedExecutions?: number
	SyncRunning?: number
	SyncCompleted?: number
	SyncFailed?: number
}


export interface ProviderInstanceWithTags {
    model?: Entity.ProviderInstance
	tags?: Entity.Tag[]
}


export interface RecurringActionInstanceDetails {
    model?: Entity.ActionInstance
	NumberOfRuns?: number
	NumberOfFailed?: number
	Status?: string
	NextScheduledTime?: number
	StartTime?: number
	ProviderInstance?: Entity.ProviderInstance
	AverageRunTime?: number
	HistoricalActionExecutions?: Entity.ActionExecution[]
	ProviderName?: string
	ActionType?: string
}


export interface SaveDashboardForExecution {
    entityProperties?: Entity.Dashboard
	withExecutionId?: string
}


export interface SlackConversation {
    Name?: string
	Id?: string
	Type?: string
}


export interface TableAndColumns {
    Table?: TableDetailUpload
	Columns?: ColumnDetailUpload[]
}


export interface TableBrowserResponse {
    TableUniqueName?: string
	TableId?: string
	TableCreatedBy?: string
	TableLastSyncedOn?: number
	ProviderInstanceName?: string
	ProviderInstanceId?: string
	ProviderDefinitionName?: string
	ProviderDefinitionId?: string
	TableSchemaName?: string
	TableInfo?: string
}


export interface TableDetailUpload {
    TableEntity?: Entity.TableProperties
	Tags?: Entity.Tag[]
}


export interface TableOOBActionStatus {
    OOBActionsStatus?: OOBActionStatus[]
	TableId?: string
}


export interface TablePropertiesInfo {
    Health?: number
	SyncStatus?: string
	ReSyncInProgress?: boolean
	SyncOOBActionStatus?: OOBActionStatus[]
}


export interface TableView {
    Columns?: ColumnInfo[]
	TableData?: Entity.ActionExecution
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


export interface UpdateActionDefinitionWithTemplate {
    filter?: Entity.ActionDefinition
	newProperties?: Entity.ActionDefinition
	ActionTemplateWithParameters?: ActionTemplatesWithParameters[]
}


export interface WebAppDetails {
    WebApp?: ActionDefinitionDetail
	Components?: Entity.ComponentDefinition[]
}


export interface WorkflowActionExecutions {
    WorkflowDefinition?: Entity.ActionDefinition
	WorkflowExecution?: Entity.ActionExecution
	ChildExecutionsWithDefinitions?: WorkflowDefinitionWithExecutionDetails[]
}


export interface WorkflowDefinitionWithExecutionDetails {
    ActionDefinition?: Entity.ActionDefinition
	ActionExecution?: Entity.ActionExecution
	stageId?: string
	stageName?: string
}


export interface WorkflowStagesWithActions {
    Actions?: Entity.ActionDefinition[]
	stageName?: string
}


