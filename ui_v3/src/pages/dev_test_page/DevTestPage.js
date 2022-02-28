import React, {useContext} from 'react'
import {Button, Box} from '@material-ui/core'
import {useMutation} from 'react-query'
import ColumnRangeChartVisualizer from '../../common/components/ColumnRangeChartVisualizer'
import AppContext from '../../utils/AppContext'
import labels from '../../labels/labels'
import TagHandler from '../../common/components/tag-handler/TagHandler'
import SelectAction from '../../common/components/workflow/create/SelectAction/SelectAction'
import { AddActionToWorkflowStage } from '../../common/components/workflow/create/addAction/AddActionToWorkflowStage'
import { WorkflowContext, WorkflowContextProvider } from '../applications/workflow/WorkflowContext'
import ViewSelectedAction from '../../common/components/workflow/create/ViewSelectedAction/ViewSelectedAction'
import { StagesWithActions } from '../../common/components/workflow/create/newStage/StagesWithActions'
import { AddingActionView } from '../../common/components/workflow/create/addAction/AddingActionView'
import { makeWorkflowTemplate } from '../../common/components/workflow/create/util/MakeWorkflowTemplate'


const endPoint = require("../../common/config/config").FDSEndpoint


const DevTestPage = () => {
    const appcontext = useContext(AppContext)
    const email = appcontext.userEmail
    const token = appcontext.token

    const bootstrapMutation = useMutation((job) => {


        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }

        }

        let response = fetch(endPoint + "/bootstrap?email=" + email, config).then(res => res.json())
        return response

    })

    const nukeMutation = useMutation((job) => {

        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                "entityName": "nuke"
            })

        }
        let response = fetch(endPoint + "/sampledata?email=" + email, config).then(res => res.json())
        return response

    })

    const handleBootstrap = () => {
        bootstrapMutation.mutate({})
    }
    const handleNuke = () => {
        nukeMutation.mutate({})
    }

    return (
        <Box sx={{display: "flex", flexDirection: "column", gap:10}}>
            <Box>
                <Button onClick={handleBootstrap}>Bootstrap</Button>
            </Box>
            <Box>
                <Button onClick={handleNuke}>Nuke</Button>
            </Box>
            <Box>
                <TagHandler entityType={labels.entities.TABLE_PROPERTIES} entityId={""} allowAdd={true} allowDelete={true}/>
            </Box>
            <WorkflowContextProvider>
                <Test/>
            </WorkflowContextProvider>   
            {/* <Box>
                <ViewSelectedAction
                    actionDefinitionId="c18e6c3a-8d43-441e-bf63-263a191c7d22"
                />
            </Box> */}
        </Box>
    )
}

const Test = () => {
    const workflowContext = React.useContext(WorkflowContext)

    return (
        <>
            {workflowContext.currentSelectedStage ? (
                <Box pt={1} sx={{maxHeight: '1000px'}}>
                    <AddingActionView/>
                </Box>
            ) : (
                <Box sx={{overflow: 'clip'}}>  
                    <StagesWithActions/>    
                    <Button onClick={() => {const template = makeWorkflowTemplate(workflowContext); console.log(template)}}>
                        save
                    </Button>
                </Box>
                
            )}
        </>
    )
}

export default DevTestPage
