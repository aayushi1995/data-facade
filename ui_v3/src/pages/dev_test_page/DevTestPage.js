import { Box, Button } from '@mui/material'
import React, { useContext } from 'react'
import { useMutation } from 'react-query'
import LoadingIndicator from '../../common/components/LoadingIndicator'
import TagHandler from '../../common/components/tag-handler/TagHandler'
import { AddingActionView } from '../../common/components/workflow/create/addAction/AddingActionView'
import { StagesWithActions } from '../../common/components/workflow/create/newStage/StagesWithActions'
import { makeWorkflowTemplate } from '../../common/components/workflow/create/util/MakeWorkflowTemplate'
import labels from '../../labels/labels'
import AppContext from '../../utils/AppContext'
import { WorkflowContext } from '../applications/workflow/WorkflowContext'


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
                {(nukeMutation.isLoading || bootstrapMutation.isLoading) && <LoadingIndicator/>}
            </Box>
            <Box>
                <Button onClick={handleNuke}>Nuke</Button>
            </Box>
            <Box>
                <TagHandler entityType={labels.entities.TABLE_PROPERTIES} entityId={""} allowAdd={true} allowDelete={true}/>
            </Box>
        </Box>
    )
}

export default DevTestPage
