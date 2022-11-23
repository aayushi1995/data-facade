import { TabContext, TabPanel } from '@mui/lab'
import { Grid, Tab, Tabs } from '@mui/material'
import React from 'react'
import { generatePath, Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom'
import { DATA_COLUMN_TAB, DATA_COLUMN_TAB_CHECKS, DATA_COLUMN_TAB_DEFAULT, DATA_COLUMN_TAB_QUICK_STATS, DATA_COLUMN_VIEW } from '../../common/components/header/data/DataRoutesConfig'
import { a11yProps } from './../table_details/TableDetails'
import Checks from './components/Checks'
import QuickStatsNewTemp from './components/QuickStatsNewTemp'

const URL_TAB_INFO = [
    {
      TabLabel: "Quick Stats",
      ViewName: DATA_COLUMN_TAB_QUICK_STATS
    },
    {
      TabLabel: "Checks",
      ViewName: DATA_COLUMN_TAB_CHECKS
    }
]

interface MatchParams {
    ColumnName: string,
    ViewName: string
} 

const ColumnDetailsView = () => {
    const match = useRouteMatch<MatchParams>()
    const history = useHistory()

    const tabState = URL_TAB_INFO.find(info => info.ViewName === match.params.ViewName)?.ViewName!
    
    const handleTabChange = (event: React.SyntheticEvent<Element, Event>, newValue: any) => {
        history.replace(generatePath(DATA_COLUMN_TAB, { ...match.params, ViewName: newValue }))
    };

    return (
        <TabContext value={tabState}>
            <React.Fragment>
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <Tabs onChange={handleTabChange} value={tabState}>
                        {
                            URL_TAB_INFO.map((info, index) => <Tab key={info.ViewName} value={info.ViewName} label={info.TabLabel} {...a11yProps(index)} />)
                        }
                        </Tabs>
                    </Grid>
                    <Grid item xs={12}>
                        <TabPanel value={DATA_COLUMN_TAB_QUICK_STATS}>
                            <QuickStatsNewTemp columnUniqueName={match.params.ColumnName}/>
                        </TabPanel>
                        <TabPanel value={DATA_COLUMN_TAB_CHECKS}>
                            <Checks columnUniqueName={match.params.ColumnName}/>
                        </TabPanel>
                    </Grid>
                </Grid>
            </React.Fragment>
        </TabContext>
    )
}

const ColumnDetails = () => {
    let match = useRouteMatch()
    return (
        <Switch>
            <Redirect exact from={DATA_COLUMN_VIEW} to={DATA_COLUMN_TAB_DEFAULT}/>
            <Route path={DATA_COLUMN_TAB}><ColumnDetailsView/> </Route>
        </Switch>
    )
}

export default ColumnDetails