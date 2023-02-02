import {Breadcrumbs, Grid, Typography, Button} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import * as PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import {decodeURL} from "./DataFacadeAppBar";
import {Route, useLocation} from "react-router-dom";
import {makeStyles} from "@mui/styles";
import { Link } from "@mui/material";
import {Link as ReactRouter} from "react-router-dom";

const useStyles = makeStyles(() => ({
    toolbar: {},
    link: {
        textDecoration: 'none!important'
    },
    breadCrumbs: {
        marginBottom: 20,
        paddingRight: 40,
        display: 'flex',
        fontSize: "14px"
    },
    title: {
        flexGrow: 1,
    },

}));
let pageHeading = "";
const listeners = [];
export const usePageHeaderState = () => {
    const listener = useState(pageHeading)[1];
    useEffect(
        () => {
            listeners.push(listener);
            const index = listeners.length - 1;
            return () => {
                delete listeners[index];
            }
        }, [listener]
    );
    return {
        setPageHeading: (heading) => {
            pageHeading = heading;
            listeners.forEach(l => l(pageHeading));
        }
    };
};

export function PageHeader(props) {
    const location = useLocation();
    const breadCrumbsToDisplay = decodeURL(location.pathname);
    const pageHeading = props.pageHeading || breadCrumbsToDisplay?.[0]?.displayName;
    const classes = useStyles();
    return pageHeading ? <Grid container style={{padding: "24px 0"}}>
        <Grid container item xs={12} justifyContent="space-between">
            <Grid item>
                <Typography variant="h6" className={classes.title}>
                    {pageHeading}
                </Typography>
            </Grid>
            <Grid item>
                    <Button variant="contained" to="/data/connections/upload-file" component={ReactRouter}>
                        Upload File
                    </Button>
            </Grid>
        </Grid>
        {breadCrumbsToDisplay?.length > 1 && <Grid item xs={12}>
            <Grid item xs={12}>
                <Breadcrumbs className={classes.breadCrumbs} separator={<NavigateNextIcon fontSize="small"/>}
                             aria-label="breadcrumb">
                    {
                        breadCrumbsToDisplay.map((elem, index, totalItems) => (
                            (totalItems?.length === index + 1) ?
                                <Typography color="textPrimary" key={`breadcrumb-${index}`} style={{fontSize: "inherit"}}>
                                    {elem.displayName}
                                </Typography> : <Link component={ReactRouter} to={elem.url} className={classes.link}
                                                      key={`breadcrumb-${index}`}> {elem.displayName} </Link>
                        ))
                    }
                </Breadcrumbs>
            </Grid>
        </Grid>}
    </Grid> : null;
}

PageHeader.propTypes = {
    classes: PropTypes.any,
    pageHeading: PropTypes.string,
    breadCrumbsToDisplay: PropTypes.arrayOf(PropTypes.any),
    callbackfn: PropTypes.func
};