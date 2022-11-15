import { Box, useTheme } from "@mui/material";
import { DataGrid, GridRowId, GridRowParams, MuiEvent } from "@mui/x-data-grid";
import React, { SyntheticEvent } from "react";
import { getInputTypeFromAttributesNew } from "../../../../../../custom_enums/ActionParameterDefinitionInputMap";
import TemplateLanguage from "../../../../../../enums/TemplateLanguage";
import { ActionParameterDefinition } from "../../../../../../generated/entities/Entities";
import TagHandler from "../../../../tag-handler/TagHandler";
import { TemplateWithParams } from "../hooks/UseViewAction";

interface ActionParameterDefinitionListProps {
    templateWithParams?: TemplateWithParams;
    onParameterSelectForEdit: (actionParameter: ActionParameterDefinition) => void;
    deleteParametersWithIds: (actionParameterIds: string[]) => void;
}

const ActionParameterDefinitionList = (props: ActionParameterDefinitionListProps) => {
    const theme = useTheme();
    const [selectedParameterIds, setSelectedParameterIds] = React.useState<string[]>(new Array<string>())

    const handleParameterDelete = () => {
        if (selectedParameterIds.length > 0) {
            props.deleteParametersWithIds(selectedParameterIds)
        }
    };

    const handleRowClick = (params: GridRowParams, e: MuiEvent<SyntheticEvent<Element, Event>>, details?: any) => {
        props.onParameterSelectForEdit(params.row)
    };

    const datagridProps = {
        columns: [
            {
                field: "ParameterName",
                headerName: "Parameter Name",
            },
            {
                field: "InputType",
                headerName: "Input Type",
            },
            {
                field: "DefaultValue",
                headerName: "Default Value",
            },
            {
                field: "UserInputRequired",
                headerName: "User Input Required",
            },
            {
                field: "Tags",
                headerName: "Tags",
                width: 400,
                renderCell: (props: any) => (
                    <TagHandler
                        entityType="ActionParameterDefinition"
                        entityId={props.row.id}
                        tagFilter={{}}
                        allowAdd={false}
                        allowDelete={true}
                        inputFieldLocation="RIGHT"
                        maxNumberOfTags={1}
                    />
                ),
            },
        ].map((col) => {
            return { width: 20 * col.field.length, ...col }
        }),
        rows: (props?.templateWithParams?.actionParameterDefinitions || []).map((param) => {
            return {
                ...param.model,
                id: param.model.Id,
                "User Input Required": false,
                InputType: getInputTypeFromAttributesNew(
                    props?.templateWithParams?.model?.Language || TemplateLanguage.SQL,
                    param.model.Tag,
                    param.model.Type,
                    param.model.Datatype,
                ),
                Tags: param.tags,
            };
        }),
        autoPageSize: true,
        rowsPerPageOptions: [5, 10, 15],
        componentsProps: {
            onParameterSelectForEdit: props.onParameterSelectForEdit,
        },
        disableSelectionOnClick: true,
        onSelectionModelChange: (newSelectedParameterIds: GridRowId[]) => {
            setSelectedParameterIds(newSelectedParameterIds.map((x) => x.toString()))
        },
        onRowClick: handleRowClick,
    }

    return (
        <Box style={{ height: 300, width: "100%" }}>
            <DataGrid {...datagridProps} />
        </Box>
    )
}

export default ActionParameterDefinitionList;
