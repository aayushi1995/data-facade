import { Box, Tab, Tabs } from "@mui/material"
import React from "react"
import CodeEditor from "../../../../../common/components/CodeEditor"
import LoadingWrapper from "../../../../../common/components/LoadingWrapper"
import { ActionDefinitionDetail } from "../../../../../generated/interfaces/Interfaces"
import { TabPanel } from "../../../workflow/create/SelectAction/SelectAction"
import useActionDefinitionDetail from "../../hooks/useActionDefinitionDetail"
import ViewActionParameters, { ViewActionParametersProps } from "../common-components/ViewActionParameters"

export interface ShowActionInfoProps {
    actionId?: string
}

const ShowActionInfo = (props: ShowActionInfoProps) => {
    const [activeTab, setActiveTab] = React.useState(1)
    const {data, error, isLoading} = useActionDefinitionDetail({
        options: {
            enabled: true,
        },
        actionDefinitionId: props.actionId
    })

    const getActionDefinitionDetailFromResponse = (data: unknown) => !!data ? (data as unknown[])[0] as ActionDefinitionDetail : undefined

    return (
        <LoadingWrapper isLoading={isLoading} error={error} data={data}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2}}>
                <Box>
                    <Tabs value={activeTab} onChange={((event, newValue) => setActiveTab(newValue))}>
                        <Tab label="Parameters" value={0} sx={{
                                fontFamily: "SF Pro Text",
                                fontStyle: "normal",
                                fontWeight: 600,
                                fontSize: "14px",
                                lineHeight: "24px",
                                display: "flex",
                                alignItems: "center",
                                textAlign: "center",
                                opacity: 0.7
                        }}/>
                        <Tab label="Code" value={1} sx={{
                                fontFamily: "SF Pro Text",
                                fontStyle: "normal",
                                fontWeight: 600,
                                fontSize: "14px",
                                lineHeight: "24px",
                                display: "flex",
                                alignItems: "center",
                                textAlign: "center",
                                opacity: 0.7
                        }}/>
                    </Tabs>
                </Box>
                <Box>
                    <TabPanel value={activeTab} index={0}>
                        <ParameterView actionDetail={getActionDefinitionDetailFromResponse(data)!}/>
                    </TabPanel>
                    <TabPanel value={activeTab} index={1}>
                        <TemplateView actionDetail={getActionDefinitionDetailFromResponse(data)!}/>
                    </TabPanel>
                </Box>
            </Box>
        </LoadingWrapper>
    )
}


const ParameterView = (props: { actionDetail: ActionDefinitionDetail}) => {
    const activeTemplateWithParams = (props?.actionDetail?.ActionTemplatesWithParameters || []).find(at => at?.model?.Id===props.actionDetail.ActionDefinition?.model?.DefaultActionTemplateId)

    const viewActionParameterProps: ViewActionParametersProps = {
        template: activeTemplateWithParams?.model,
        paramsWithTag: (activeTemplateWithParams?.actionParameterDefinitions || []).map(apd => ({parameter: apd.model!, tags: (apd.tags||[]), existsInDB: true}))
    }

    return (
        <ViewActionParameters {...viewActionParameterProps}/>
    )
}

const TemplateView = (props: { actionDetail: ActionDefinitionDetail}) => {
    const activeTemplateWithParams = (props?.actionDetail?.ActionTemplatesWithParameters || []).find(at => at?.model?.Id===props.actionDetail.ActionDefinition?.model?.DefaultActionTemplateId)

    const codeEditorProps = {
        readOnly: true,
        code: activeTemplateWithParams?.model?.Text,
        language: activeTemplateWithParams?.model?.Language
    }

    return (
        <CodeEditor {...codeEditorProps}/>
    )
}

export default ShowActionInfo;