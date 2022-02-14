## /configurations 
### Functional Use Cases
1. Get Data Source Definitions
- Request Body
```json
endpoint: /v1/entity/getproxy
requestType: POST
{
    "entityName":"ProviderDefinition",
    "actionProperties":{
        "filter":{
            FILTER
        },
        "withProviderParameterDefinition": True
    }
}
```
- Response Body
```json
[
    {
        "ProviderDefinition":{
            PROVIDER_1_DEFINITION_ATTRIBUTES_
        },
        "ProviderParameterDefinition":[
            {
                PROVIDER_1_PARAMETER_1_DEFINITION_ATTRIBUTES_
            },
            {
                PROVIDER_1_PARAMETER_2_DEFINITION_ATTRIBUTES_
            }
        ]
    },
    {
        "ProviderDefinition":{
            PROVIDER_2_DEFINITION_ATTRIBUTES_
        },
        "ProviderParameterDefinition":[
            {
                PROVIDER_2_PARAMETER_1_DEFINITION_ATTRIBUTES_
            },
            {
                PROVIDER_2_PARAMETER_2_DEFINITION_ATTRIBUTES_
            }
        ]
    }
]
```
2. Create Data Source Instance
- Request Body
```json
endpoint: /v1/entity
requestType: POST
{
    "entityName":"ProviderInstance",
    "actionProperties":{
        "entityProperties":{
            PROVIDER_INSTANCE_1_ATTRIBUTES_
        },
        "withProviderParameterInstance": true,
        "ProviderParameterInstanceEntityProperties":[
            {
                PROVIDER_INSTANCE_1_PARAMETER_1_INSTANCE
            },
            {
                PROVIDER_INSTANCE_1_PARAMETER_2_INSTANCE
            }
        ]
    }
}
```
- Response Body
```json
[
    PROVIDER_INSTANCE_1_ATTRIBUTES_
]
```
3. Update Data Source Instance
- Request Body
```json
endpoint: /v1/entity
requestType: PATCH
{
    "entityName":"ProviderInstance",
    "actionProperties":{
        "filter":{
            PROVIDER_INSTANCE_1_FILTER
        },
        "newProperties":{
            PROVIDER_INSTANCE_1_NEW_ATTRIBUTES_
        },
        "withProviderParameterInstance": true,
        "ProviderParameterInstanceEntityProperties":[
            {
                "filter":{
                    PROVIDER_INSTANCE_1_PARAMETER_1_INSTANCE_FILTER
                },
                "newProperties":{
                    PROVIDER_INSTANCE_1_PARAMETER_1_INSTANCE_NEW_ATTRIBUTES_
                }
            },
            {
                "filter":{
                    PROVIDER_INSTANCE_1_PARAMETER_2_INSTANCE_FILTER
                },
                "newProperties":{
                    PROVIDER_INSTANCE_1_PARAMETER_2_INSTANCE_NEW_ATTRIBUTES_
                }
            },
        ]
    }
}
```
- Response Body
```json
[
    PROVIDER_INSTANCE_1_ATTRIBUTES_
]
```

4. Sync
- RequestBody
```json
endpoint: /v1/entity
requqestType: POST
{
    "entityName": "ActionInstance",
    "actionProperties" : {
        "entityProperties":{
            PROVIDER_INSTANCE_1_ATTRIBUTES,
        },
        "providerSyncAction": true
    }
}
```
- ResponseBody
```json
[
    {
        ACTION_INSTANCE_1_ATRIBUTES
    }
]
```
## /tableBrowser
### Functional Use Cases
1. Get Tables
- Request Body
```json
{
    "entityName":"TableProperties",
    "actionProperties":{
        "filter":{
            TABLE_PROPERTIES_FILTER
        },
        "withTableDetail": true
    }
}
```
- Response Body
```json
[
    {
        "TableProperties": {
            TABLE_PROPERTIES_ATTRIBUTES
        },
        "ColumnProperties": [
            {
                COLUMN_PROPERTIES_1_ATTRIBUTES
            },
            {
                COLUMN_PROPERTIES_2_ATTRIBUTES
            }
        ],
        "ProviderInstance": {
            PROVIDER_INSTANCE_1_ATTRIBUTES
        },
        "ActionInstance": [
            {
                ACTION_INSTANCE_1_ATTRIBUTES
            },
            {
                ACTION_INSTANCE_2_ATTRIBUTES
            }
        ],
        "ActionExecution": [
            {
                ACTION_EXECUTION_1_ATTRIBUTES
            },
            {
                ACTION_EXECUTION_2_ATTRIBUTES
            }
        ]

    }
]
```

## /tableDetails
### Functional Use Cases
0. Get quick stats table level
- Request Body
```json
{
    "entityName":"TableProperties",
    "actionProperties":{
        "filter":{
            TABLE_PROPERTIES_FILTER
        },
        "withProfilingActions" : true
    }
}
```
- Response Body
```json
[
    {
        "TableProperties": {
                TABLE_PROPERTIES_ATTRIBUTES
        },
        "Actions": [
            {
                "ActionInstance" : {
                    ACTION_INSTANCE_ATTRIBUTES
                },
                "ActionExecution": [
                    {
                        ACTION_EXECUTION_1_ATTRIBUTES
                    },
                    {
                        ACTION_EXECUTION_2_ATTRIBUTES
                    }
                ]
            }
        ],
        "RowCount": [
            {
                ACTION_EXECUTION_1_ATTRIBUTES
            },
            {
                ACTION_EXECUTION_2_ATTRIBUTES
            }
        ]
    }
]
```
1. Get checks table level
- Request Body
```json
{
    "entityName":"TableProperties",
    "actionProperties":{
        "filter":{
            TABLE_PROPERTIES_FILTER
        },
        "withChecks" : true
    }
}
```
- Response Body
```json
[
    {
        "TableProperties": {
                TABLE_PROPERTIES_ATTRIBUTES
        },
        "Actions": [
            {
                "ActionInstance" : {
                    ACTION_INSTANCE_ATTRIBUTES
                },
                "ActionExecution": [
                    {
                        ACTION_EXECUTION_1_ATTRIBUTES
                    },
                    {
                        ACTION_EXECUTION_2_ATTRIBUTES
                    }
                ]
            }
        ]
    }
]
```
2. Get quick stats column level
- Request Body
```json
{
    "entityName":"ColumnProperties",
    "actionProperties":{
        "filter":{
            COLUMN_PROPERTIES_FILTER
        },
        "withProfilingActions" : true
    }
}
```
- Response Body
```json
[
    {
        "ColumnProperties": {
                COLUMN_PROPERTIES_ATTRIBUTES
        },
        "TableProperties": {
                TABLE_PROPERTIES_ATTRIBUTES
        },
        "ProfilingActions": [
            {
                "ActionInstance" : {
                    ACTION_INSTANCE_ATTRIBUTES
                },
                "ActionExecution": [
                    {
                        ACTION_EXECUTION_1_ATTRIBUTES
                    },
                    {
                        ACTION_EXECUTION_2_ATTRIBUTES
                    }
                ]
            }
        ],
        "DistinctCount": [
            {
                ACTION_EXECUTION_1_ATTRIBUTES
            },
            {
                ACTION_EXECUTION_2_ATTRIBUTES
            }
        ]
    }
]
```

3. Get checks column level
- Request Body
```json
{
    "entityName":"ColumnProperties",
    "actionProperties":{
        "filter":{
            COLUMN_PROPERTIES_FILTER
        },
        "withChecks" : true
    }
}
```
- Response Body
```json
[
    {
        "ColumnProperties": {
                COLUMN_PROPERTIES_ATTRIBUTES
        },
        "TableProperties": {
                TABLE_PROPERTIES_ATTRIBUTES
        },
        "Actions": [
            {
                "ActionInstance" : {
                    ACTION_INSTANCE_ATTRIBUTES
                },
                "ActionExecution": [
                    {
                        ACTION_EXECUTION_1_ATTRIBUTES
                    },
                    {
                        ACTION_EXECUTION_2_ATTRIBUTES
                    }
                ]
            }
        ]
    }
]
```


## /columnBrowser
### Functional Use Cases
1. Get Columns
- Request Body
```json
{
    "entityName":"ColumnProperties",
    "actionProperties":{
        "filter":{
            COLUMN_PROPERTIES_FILTER
        },
        "withColumnDetail": true
    }
}
```
- Response Body
```json
[
    {
        "ColumnProperties": [
            {
                COLUMN_PROPERTIES_1_ATTRIBUTES
            },
            {
                COLUMN_PROPERTIES_2_ATTRIBUTES
            }
        ],
        "ProviderInstance": {
            PROVIDER_INSTANCE_1_ATTRIBUTES
        },
        "ActionInstance": [
            {
                ACTION_INSTANCE_1_ATTRIBUTES
            },
            {
                ACTION_INSTANCE_2_ATTRIBUTES
            }
        ],
        "ActionExecution": [
            {
                ACTION_EXECUTION_1_ATTRIBUTES
            },
            {
                ACTION_EXECUTION_2_ATTRIBUTES
            }
        ]

    }
]
```
## /jobs
### Functional Use Cases
1. Get ActionInstance
- Request Body
```json
{
    "entityName": "ActionInstance",
    "actionProperties": {
        "filter": {
            ACTION_INSTANCE_1_ATTRIBUTES
        },
        "withActionInstanceDetail": true
    },
}
```

- Response Body
```json
[
    {
        "ActionInstance": {
            ACTION_INSTANCE_1_ATTRIBUTES
        },
        "TableProperties": [
            {
                TABLE_PROPERTIES_1_ATTRIBUTES
            },
            {
                TABLE_PROPETIES_2_ATTRIUTES
            }
        ],
        "ActionExecution": [
            {
                ACTION_EXECUTION_1_ATTRIBUTES
            }.
            {
                ACTION_EXECUTION_2_ATTRIBUTES
            }.
            {
                ACTION_EXECUTION_3_ATTRIBUTES
            }
        ]
    },
    {
        "ActionInstance": {
            ACTION_INSTANCE_2_ATTRIBUTES
        },
        "TableProperties": [
            {
                TABLE_PROPERTIES_1_ATTRIBUTES
            },
            {
                TABLE_PROPETIES_2_ATTRIUTES
            }
        ],
        "ActionExecution": [
            {
                ACTION_EXECUTION_4_ATTRIBUTES
            }.
            {
                ACTION_EXECUTION_5_ATTRIBUTES
            }.
            {
                ACTION_EXECUTION_6_ATTRIBUTES
            }
        ]
    },
]
```

## / customisations
### Functional Use Cases
1. Create ActionDefinition with ActionParameterDefinition
- Request Body
```json
EndPoint: /v1/entity
RequestType: POST
{
    "entityName": "ActionDefinition",
    "actionProperties":{
        "entityProperties": {
            ACTION_DEFINITION_1_ATTRIBUTES
        },
        "ActionParameterDefinitionEntityProperties": [
            {
                ACTION_PARAMETER_DEFINITION_1_ATTRIBUTES
            },
            {
                ACTION_PARAMETER_DEFINITION_2_ATTRIBUTES
            }
        ]
        "withActionParameterDefinition": true
    }
}
```

- ResponseBody
```json
[
    {
        ACTION_DEFINITION_1_ATTRIBUTES
    }
]
```

2. Create ActionInstance with ActionParameterInstance
- Request Body
```json
EndPoint: /v1/entity/getproxy
RequestType: POST
{
    "entityName": "ActionInstance",
    "actionProperties": {
        "entityProperties": {
            ACTION_INSTANCE_1_ATTRIBUTES
        },
        "ActionParameterInstanceEntityProperties": [
            {
                ACTION_PARAMETER_INSTANCE_1_ATTRIBUTES
            },
            {
                ACTION_PARAMETER_INSTANCE_2_ATTRIBUTES
            }
        ]
        "withActionParameterInstance": true,
        "slack" : SLACK_CONNECTION,
        "email" : EMAIL CONNECTION
    }
}
```
- Response Body
```json
[
    {
        ACTION_INSTANCE_1_ATTRIBUTES
    }
]
```

3. Retrieve ActionDefinition with ActionParameterDefiniion
- Request Body
```json
Endpoint: /v1/entity/getproxy
RequestType: POST
{
    "entityName": "ActionDefinition",
    "actionProperties": {
        "filter": {
            ACTION_DEFINITION_FILTER_ATTRIBUTES
        },
        "withActionParameterDefinition": true,
    }
}
```
- Response Body
```json
[
    {
        "ActionDefintion":{
            ACTION_DEFINITION_1_ATTRIBUTES
        },
        "ActionParameterDefinition": [
            {
                ACTION_PARAMETER_DEFINITION_1_ATTRIBUTES
            },
            {
                ACTION_PARAMETER_DEFINITION_2_ATTRIBUTES
            }
        ]
    },
    {
        "ActionDefintion":{
            ACTION_DEFINITION_2_ATTRIBUTES
        },
        "ActionParameterDefinition": [
            {
                ACTION_PARAMETER_DEFINITION_3_ATTRIBUTES
            },
            {
                ACTION_PARAMETER_DEFINITION_4_ATTRIBUTES
            }
        ]
    }
]
```

4. Retrieve ActionInstance with Detail
- Request Body
```json
EndPoint: /v1/entity/getproxy
RequestType: POST
{
    "entityName": "ActionInstance",
    "actionProperties": {
        "filter": {
            ACTION_INSTANCE_FILTER_ATTRIBUTES
        },
        "withDetail" true
    }
}
```
- Response Body
```json
[
    {
        "ActionInstance": {
            ACTION_INSTANCE_1_ATTRIBUTES
        },
        "ActionDefinition": {
            ACTION_DEFINITION_1_ATTRIBUTES
        },
        "ProviderInstance": {
            PROVIDER_INSTANCE_1_ATTRIBUTES
        },
        "ActionParameterInstance": [
            {
                ACTION_PARAMETER_INSTANCE_1_ATTRIBUTES
            },
            {
                ACTION_PARAMETER_INSTANCE_2_ATTRIBUTES
            }
        ],
        "ActionParameterDefinition": [
            {
                ACTION_PARAMETER_DEFINITION_1_ATTRIBUTES
            },
            {
                ACTION_PARAMETER_DEFINITION_2_ATTRIBUTES
            }
        ]
    },
    {
        "ActionInstance": {
            ACTION_INSTANCE_2_ATTRIBUTES
        },
        "ActionDefinition": {
            ACTION_DEFINITION_2_ATTRIBUTES
        },
        "ProviderInstance": {
            PROVIDER_INSTANCE_2_ATTRIBUTES
        },
        "ActionParameterInstance": [
            {
                ACTION_PARAMETER_INSTANCE_3_ATTRIBUTES
            },
            {
                ACTION_PARAMETER_INSTANCE_4_ATTRIBUTES
            }
        ],
        "ActionParameterDefinition": [
            {
                ACTION_PARAMETER_DEFINITION_3_ATTRIBUTES
            },
            {
                ACTION_PARAMETER_DEFINITION_4_ATTRIBUTES
            }
        ]
    }
]
```
## / alerts
### Functional Use Cases










Update ActionDefinition with ActionParameterDefinition
{
    entityName: "ActionDefinition",
    actionProperties: {
        filter: ACTION_DEFINITION_FILTER,
        newProperties:ACTION_DEFINITION_NEW_PROPERTIES,
        withActionParameterDefinition: true,
        ActionParameterDefinitionParams: [
            [
                ACTION_PARAMETER_DEFINITION_1_FILTER,
                ACTION_PARAMETER_DEFINITION_1_NEW_PROPERTIES
            ],
            [
                ACTION_PARAMETER_DEFINITION_2_FILTER,
                ACTION_PARAMETER_DEFINITION_2_NEW_PROPERTIES
            ],
            [
                ACTION_PARAMETER_DEFINITION_3_FILTER,
                ACTION_PARAMETER_DEFINITION_3_NEW_PROPERTIES
            ]
        ]
    }
}