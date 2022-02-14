import React, {useContext} from 'react'
import {Button} from '@material-ui/core'
import {useMutation} from 'react-query'
import ColumnRangeChartVisualizer from '../../common/components/ColumnRangeChartVisualizer'
import AppContext from '../../utils/AppContext'


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
        <>
            <div>
                <Button onClick={handleBootstrap}>Bootstrap</Button>
            </div>
            <div>
                <Button onClick={handleNuke}>Nuke</Button>
            </div>
            <div>
                <ColumnRangeChartVisualizer/>
            </div>
        </>

    )

}
export default DevTestPage
