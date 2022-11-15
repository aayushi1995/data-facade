/**
 * Id: Option[String] = None,
            DeletedStatus: Option[String] = None,
            DeletedOn: Option[BigDecimal] = None,
            ActionParameterDefinitionId: Option[String] = None,
            ActionInstanceId: Option[String] = None,
            ParameterValue: Option[String] = None,
            TableId: Option[String] = None,
            ColumnId: Option[String] = None,
            ProviderInstanceId: Option[String] = None,
            SourceExecutionId: Option[String] = None,
 */

export type ActionParameterInstanceModel = {
    Id: string,
    DeletedStatus: string,
    DeletedOn: Date,
    ActionParameterDefinitionId: string,
    ParameterValue: string,
    TableId: string,
    ColumnId: string,
    ProviderInstanceId: string,
    SourceExecutionId: string
}