import React from 'react'
import { makeStyles } from '@mui/styles'
import {Grid, IconButton, Tab} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';


const useStyles = makeStyles(() => ({
    tabs: {
        maxHeight: 40,
        minHeight: 40
    }
}))


const TabWithClose = (props) => {
    const disableClose = props.disableClose || false
    const classes = useStyles()
    const onCloseTab = (event) => {
        props.onCloseTab(props.value)
    }

    const customOnChange = (event, value) => {
        if (event.target.tagName !== 'DIV') {
            event.preventDefault();
        } else {
            props.onChange(event, value)
        }
    }

    const customLabel =
        <Grid container>
            <Grid container item xs={9} alignItems="center">
                {props.label}
            </Grid>
            <Grid container item xs={3} direction="row" alignItems="center" justifyContent="flex-end">
                {
                    (!disableClose) &&
                    <IconButton onClick={onCloseTab}>
                        <CloseIcon/>
                    </IconButton>
                }
            </Grid>

        </Grid>

    const newProps = {
        ...props,
        label: customLabel,
        onChange: customOnChange
    }

    return (
        <Tab component="div" {...newProps} className={classes.tabs}/>
    )
}

export default TabWithClose;