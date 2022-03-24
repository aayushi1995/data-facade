import React from 'react'
import {Grid, Table, TableBody, TableCell, TableRow} from '@mui/material'
import {useTranslation} from "react-i18next";
import './../../../css/alerts/AlertRow.css'
import {useRouteMatch} from "react-router-dom";
import {useRetreiveData} from "../../../data_manager/data_manager";
import {PageHeader} from "../../../common/components/header/PageHeader";

import labels from './../../../labels/labels';
import LoadingIndicator from "../../../common/components/LoadingIndicator";
import NoData from "../../../common/components/NoData";

/* Render each alert row */


const AlertDetails = () => {
    const match = useRouteMatch()
    const alertId = match.params.alertId;
    const {t, i18n} = useTranslation()

    const {data, isLoading, error} = useRetreiveData(labels.entities.Alert, {
        "filter": {
            Id: alertId
        }
    });
    const alert = data?.[0];
    if (isLoading) {
        return (<LoadingIndicator/>)
    } else if (error) {
        return (<NoData/>)
    } else {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <PageHeader path={match.path} url={match.url} pageHeading={alert?.ShortDescription}/>
                </Grid>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>{t("short_description")}</TableCell>
                            <TableCell>{alert?.ShortDescription}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>{t("long_description")}</TableCell>
                            <TableCell>{alert?.LongDescription}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Grid>
        )
    }
}

export default AlertDetails