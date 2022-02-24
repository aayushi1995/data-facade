import React, {useContext} from 'react'
import {Button, Box} from '@material-ui/core'
import {useMutation} from 'react-query'
import ColumnRangeChartVisualizer from '../../common/components/ColumnRangeChartVisualizer'
import AppContext from '../../utils/AppContext'
import labels from '../../labels/labels'
import TagHandler from '../../common/components/tag-handler/TagHandler'
import SelectAction from '../../common/components/workflow/create/SelectAction/SelectAction'
import { AddActionToWorkflowStage } from '../../common/components/workflow/create/addAction/AddActionToWorkflowStage'
import { WorkflowContextProvider } from '../applications/workflow/WorkflowContext'


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
        <Box>
            <Box>
                <Button onClick={handleBootstrap}>Bootstrap</Button>
            </Box>
            <Box>
                <Button onClick={handleNuke}>Nuke</Button>
            </Box>
            <Box>
                <TagHandler entityType={labels.entities.TABLE_PROPERTIES} entityId={""} allowAdd={true} allowDelete={true}/>
            </Box>
            <Box pt={1}>
                {/* <SelectAction onAddAction={(ad) => console.log(ad)}/> */}
                <WorkflowContextProvider>
                    <AddActionToWorkflowStage stageId='stage1'/>
                </WorkflowContextProvider>
            </Box>
        </Box>
    )
}
export default DevTestPage
