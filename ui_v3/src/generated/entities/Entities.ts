
/**
 * This is a generated code based on DDL yaml. Please don't edit it
 * (c) Data Facade LLC.
 */
 
 export interface BaseEntity {}
 
 

 export interface Alert extends BaseEntity{
	 Id?: string
	 DeletedStatus?: string
	 DeletedOn?: number
	 CreatedOn?: number
	 ShortDescription?: string
	 LongDescription?: string
	 RelatedEntityID?: string
	 TableId?: string
 }
 
 
 export interface ColumnProperties extends BaseEntity{
	 Id?: string
	 DeletedStatus?: string
	 DeletedOn?: number
	 UniqueName?: string
	 TableId?: string
	 TableName?: string
	 IsPartition?: boolean
	 Datatype?: string
	 IsStale?: boolean
	 ColumnType?: string
	 ColumnPattern?: string
 }
 
 
 export interface DownloadTable extends BaseEntity{
	 Id?: string
	 DeletedStatus?: string
	 DeletedOn?: number
	 CreatedOn?: number
	 ProcessedOn?: number
	 Status?: string
	 TableId?: string
	 TableProviderInstanceId?: string
	 TableName?: string
	 UploadActionInstanceId?: string
 }
 
 
 export interface ActionInstance extends BaseEntity{
	 Id?: string
	 DeletedStatus?: string
	 DeletedOn?: number
	 DefinitionId?: string
	 TemplateId?: string
	 Name?: string
	 LastRun?: string
	 RenderedTemplate?: string
	 RenderTemplate?: boolean
	 ProviderInstanceId?: string
	 IsRecurring?: boolean
	 RecurrenceIntervalInSecs?: number
	 UpstreamActionInstanceId?: string
	 RelatedEntityId?: string
	 ConfiguredRetryCount?: number
	 RetryInterval?: number
	 EmailNotificationProviderInstanceId?: string
	 SlackNotificationProviderInstanceId?: string
	 EnableForReporting?: boolean
	 TableId?: string
	 DisplayName?: string
	 ActionType?: string
	 CreatedBy?: string
	 AnomalyInstanceId?: string
	 VisualizationFormat?: string
	 UploadExecutionData?: boolean
	 PinnedToDashboard?: boolean
	 Visibility?: string
 }
 
 
 export interface ActionDefinition extends BaseEntity{
	 Id?: string
	 DeletedStatus?: string
	 TemplateType?: string
	 DeletedOn?: number
	 UniqueName?: string
	 ActionType?: string
	 DefaultActionTemplateId?: string
	 OutputFormat?: string
	 DefaultEntity?: string
	 DefaultDataType?: string
	 PresentationFormat?: string
	 DisplayName?: string
	 QueryLanguage?: string
	 OutputDestination?: string
	 CreatedBy?: string
	 Description?: string
	 ApplicationId?: string
	 IsVisibleOnUI?: boolean
	 PinnedToDashboard?: boolean
	 Visibility?: string
	 PublishStatus?: string
	 ActionGroup?: string
	 CreatedOn?: number
	 UpdatedOn?: number
	 UpdatedBy?: string
 }
 
 
 export interface Application extends BaseEntity{
	 Id?: string
	 DeletedStatus?: string
	 DeletedOn?: number
	 Name?: string
	 ArtifactLocation?: string
	 Version?: string
	 CreatedBy?: string
	 CreatedOn?: number
	 Description?: string
	 IsVisibleOnUI?: boolean
 }
 
 
 export interface TagMap extends BaseEntity{
	 Id?: string
	 DeletedStatus?: string
	 DeletedOn?: number
	 TagName?: string
	 CreatedBy?: string
	 CreatedOn?: number
	 RelatedEntityType?: string
	 RelatedEntityId?: string
 }
 
 
 export interface PredictionModel extends BaseEntity{
	 Id?: string
	 DeletedStatus?: string
	 DeletedOn?: number
	 UniqueName?: string
	 TableId?: string
	 Framework?: string
	 OutputArtifact?: string
	 Config?: string
 }
 
 
 export interface TableProperties extends BaseEntity{
	 Id?: string
	 DeletedStatus?: string
	 DeletedOn?: number
	 UniqueName?: string
	 DisplayName?: string
	 DatabaseName?: string
	 SchemaName?: string
	 Owner?: string
	 CreatedOn?: string
	 ModifiedOn?: string
	 Description?: string
	 ProviderInstanceID?: string
	 ProviderInstanceName?: string
	 TableType?: string
	 IsStale?: boolean
	 FullSyncedOn?: number
	 Location?: string
 }
 
 
 export interface JobBase extends BaseEntity{
	 Id?: string
	 DeletedStatus?: string
	 DeletedOn?: number
	 Status?: string
	 CreatedOn?: number
	 QueuedOn?: number
	 StartedExecutingOn?: number
	 CompletedOn?: number
	 Duration?: number
	 Type?: string
	 Input?: string
	 Output?: string
	 ProviderID?: string
	 ContextInformation?: string
	 RequestType?: string
	 RelatedEntityName?: string
	 RelatedEntityUniqueId?: string
	 RetryCount?: string
	 OutputDestination?: string
	 TableName?: string
	 ToBeRetriedOn?: number
	 PollCount?: number
 }
 
 
 export interface ProviderDefinition extends BaseEntity{
	 Id?: string
	 DeletedStatus?: string
	 DeletedOn?: number
	 ProviderType?: string
	 UniqueName?: string
	 Description?: string
	 SourceURL?: string
	 ImageURL?: string
	 SupportedRuntimeGroup?: string
	 IsVisibleOnUI?: boolean
 }
 
 
 export interface OptimisticTag extends BaseEntity{
	 Id?: string
	 DeletedStatus?: string
	 DeletedOn?: number
	 TableName?: string
	 ColumnName?: string
	 ProviderInstanceId?: string
	 TagName?: string
	 EntityType?: string
 }
 
 
 export interface ProviderParameterDefinition extends BaseEntity{
	 Id?: string
	 DeletedStatus?: string
	 DeletedOn?: number
	 ProviderDefinitionId?: string
	 ParameterName?: string
	 FilledBy?: string
	 Datatype?: string
 }
 
 
 export interface ProfileData extends BaseEntity{
	 Id?: string
	 DeletedStatus?: string
	 DeletedOn?: number
	 TableId?: string
	 TableName?: string
	 ColumnUniqueName?: string
	 ColumnDataType?: string
	 NullCounts?: number
	 Range?: string
	 UniqueValueCount?: number
	 RefreshTimestamp?: string
	 Partition?: string
	 TotalRowCount?: number
 }
 
 
 export interface ActionParameterInstance extends BaseEntity{
	 Id?: string
	 DeletedStatus?: string
	 DeletedOn?: number
	 ActionParameterDefinitionId?: string
	 ActionInstanceId?: string
	 ParameterValue?: string
	 TableId?: string
	 ColumnId?: string
	 ProviderInstanceId?: string
	 SourceExecutionId?: string
	 GlobalParameterId?: string
 }
 
 
 export interface ActionTemplate extends BaseEntity{
	 Id?: string
	 DeletedStatus?: string
	 DeletedOn?: number
	 DefinitionId?: string
	 Text?: string
	 Language?: string
	 SupportedRuntimeGroup?: string
 }
 
 
 export interface ActionParameterDefinition extends BaseEntity{
	 Id?: string
	 DeletedStatus?: string
	 DeletedOn?: number
	 ActionDefinitionId?: string
	 TemplateId?: string
	 ParameterName?: string
	 Datatype?: string
	 Type?: string
	 Tag?: string
	 DefaultParameterValue?: string
	 OptionSetValues?: string
 }
 
 
 export interface Chart extends BaseEntity{
	 Id?: string
	 DeletedStatus?: string
	 DeletedOn?: number
	 Name?: string
	 ChartGroup?: string
	 Type?: string
	 ExecutionId?: string
	 DashboardId?: string
 }
 
 
 export interface ActionExecution extends BaseEntity{
	 Id?: string
	 InstanceId?: string
	 DeletedStatus?: string
	 DeletedOn?: number
	 Status?: string
	 Output?: string
	 ExecutionStartedOn?: number
	 RecurringRetry?: boolean
	 ExecutionCompletedOn?: number
	 ScheduledTime?: number
	 CurrentRetryCount?: number
	 RunId?: string
	 ActionInstanceName?: string
	 ActionInstanceRenderedTemplate?: string
	 TableId?: string
	 Config?: string
	 isAnomaly?: boolean
	 AnomalyReason?: string
	 IsSynchronous?: boolean
	 OutputFilePath?: string
	 UploadOutput?: boolean
	 ExecutionLogs?: string
 }
 
 
 export interface ProfileRequests extends BaseEntity{
	 Id?: string
	 DeletedStatus?: string
	 DeletedOn?: number
	 TableId?: string
	 TableName?: string
	 CreatedOn?: string
	 QueuedOn?: string
	 StartedOn?: string
	 CompletedOn?: string
	 Status?: string
 }
 
 
 export interface Tag extends BaseEntity{
	 Id?: string
	 DeletedStatus?: string
	 DeletedOn?: number
	 Name?: string
	 TagGroup?: string
	 ParentTagName?: string
	 Scope?: string
	 CreatedBy?: string
	 Description?: string
	 ApplicationId?: string
 }
 
 
 export interface ProviderInstance extends BaseEntity{
	 Id?: string
	 DeleteStatus?: string
	 DeletedStatus?: string
	 DeletedOn?: number
	 Name?: string
	 ProviderDefinitionId?: string
	 CreatedOn?: number
	 IsVisibleOnUI?: boolean
 }
 
 
 export interface DataCheckDefinition extends BaseEntity{
	 Id?: string
	 DeletedStatus?: string
	 DeletedOn?: number
	 UniqueName?: string
	 CheckType?: string
 }
 
 
 export interface ProviderParameterInstance extends BaseEntity{
	 Id?: string
	 DeletedStatus?: string
	 DeletedOn?: number
	 ProviderInstanceId?: string
	 ProviderParameterDefinitionId?: string
	 ParameterName?: string
	 ParameterValue?: string
	 FilledBy?: string
	 Datatype?: string
	 CreatedOn?: number
	 ModifiedOn?: number
 }
 
 
 