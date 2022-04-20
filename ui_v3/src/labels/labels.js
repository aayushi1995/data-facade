const labels = {
    "AlertRow": {
        "short_description": "Short Description",
        "long_description": "Long Description"
    },
    "QualityChecksRow": {
        "instance_details": "Action Instance Details",
        "parameter_details": "Action Parameter Instance Details",
        "execute": "execute",
        "execution_created": "Execution Created",
        "name": "Name",
        "rendered_template": "Rendered Template",
        "parameter_value": "Parameter Value"
    },
    "TableBrowser": {
        "delete": "Delete",
        "sync": "Sync",
        "created_by": "Created By"
    },
    "TableBrowserRow": {
        "alerts": "Alerts",
        "checks": "Checks",
        "jobs": "Jobs",
        "sync": "Sync",
        "add_action": "Add action",
        "show_details": "Show Details",
        "syncing": "Syncing",
        "one_table_sync": "1 Table(s) Sync started",
        "table_sync_failed": "Table(s) Sync Failed"

    },
    "entities": {
        "ActionTemplate": "ActionTemplate",
        "Alert": "Alert",
        "ActionExecution": "ActionExecution",
        "ActionInstance": "ActionInstance",
        "TableProperties": "TableProperties",
        "ColumnProperties": "ColumnProperties",
        "JobBase": "JobBase",
        "ProviderDefinition": "ProviderDefinition",
        "ProviderInstance": "ProviderInstance",
        "ActionDefinition": "ActionDefinition",
        "ProviderParameterInstance": "ProviderParameterInstance",
        "DownloadTable": "DownloadTable",
        TAG: "Tag",
        TAG_MAP: "TagMap",
        TABLE_PROPERTIES: "TableProperties",
        COLUMN_PROPERTIES: "ColumnProperties",
        APPLICATION: "Application",
        "Dashboard": "Dashboard"
    },
    "CreateCleaningTrigger": {
        "passed": "Cleanup Trigger Creation Successful",
        "failed": "Cleanup Trigger Creation Failed",
        "deleted": "Cleanup Steps(s) Deleted",
        "deletion_failed": "Cleanup Steps(s) Deletion Failed",
        "delete": "Delete",
        "clean": "Clean",
        "nothing_configured": "No Cleanup Steps configured",
        "cleanup_steps": "Cleanup Steps"
    },
    "CleanupStepRow": {
        "edit": "Edit"
    },
    "TableRowExpanded": {
        "description": "Description",
        "provider_name": "Provider Name",
        "clean": "Transform"
    },
    "Jobs": {
        "select": "Select All",
        "unselect": "Unselect All",
        "delete": "Delete",
        "previous": "Previous",
        "next": "Next"
    },
    "JobsRow": {
        "show_action_instance": "Show Action Instance"
    },
    "JobsRowJobDetail": {
        "template_rendered": "Template Rendered",
        "template_executed": "Template Executed",
        "retry_count": "Retry Count",
        "scheduled_time": "Scheduled Time",
        "started_on": "Started On",
        "execution_dev_data": "Action Execution Dev Data",
        "action_instance_dev_data": "Action Instance Dev Data",
        "id": "Id",
        "table_id": "Table Id",
        "instance_id": "Instance Id",
        "output": "Output",
        "dev_data": "Job Base Dev Data",
        "created_on": "Created On",
        "queued_on": "Queued On",
        "started_executing_on": "Started Executing On",
        "completed_on": "Completed On",
        "duration": "Duration",
        "context_information": "Context Information"
    },
    "ConfiguredDataSource": {
        "select_all": "Select All",
        "remove_all": "Remove All",
        "delete": "Delete"
    },
    "CreateDataSourceRow": {
        "visit_provider": "Visit Provider",
        "new_instance": "Create a new instance",
        "create": "Create",
        "success": "Success",
        "create_and_sync": "Create and sync",
        "update": "Update",
    },
    "CustomizationActionInstanceRow": {
        "execute": "Execute",
        "execution_created": "Execution Created"
    },
    "CustomizationDataChecksRow": {
        "action_def_det": "Action Definition show_details",
        "param_def_det": "Action Parameter Definition Details",
        "update_action_def": "Update Action Definition"
    },
    "CustomizationDataMitigationRow": {
        "action_param_def": "Action Parameter Definition Details",
        "param_def_det": "Action Parameter Definition Details",
        "update_action_def": "Update Action Definition"
    },
    "CustomizationDataProfilingRow": {
        "action_def_det": "Action Definition Details",
        "param_def_det": "Action Parameter Definition Details",
        "update_action_def": "Update Action Definition"
    },
    "UploadTableButton": {
        "upload": "Upload Table",
        DIRECTION:
            `*Please note: first row of the uploaded CSV, will be considered as column names.`
    },
    "DownloadTableButton": {
        "downloadTable": "Download",
        "requestTableUpload": "Prep Table",
        "download": "Download",
        "status": "Status",
        "createdOn": "Created On",
        "processedOn": "Processed On"
    },
    "RunWorkflowButton": {
        "runWorkflow": "Run Workflow",
    },
    "TransformDialog": {
        "selectAll": "Select All",
        "unselectAll": "Unselect All",
        "delete": "Delete",
        "clean": "Start Transform",
        NO_CLEANUP_AVAILABLE: "No Transformation Step Configured"
    }
}

export default labels