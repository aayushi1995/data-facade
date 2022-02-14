import React from 'react'
import VisibilityIcon from '@material-ui/icons/Visibility';
import {Tooltip} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles(() => ({

    icon: {
        color: 'brown'
    },
    tooltip: {
        width: 250
    }

}));

const HelpIcon = (props) => {

    const classes = useStyles()
    return (
        <Tooltip title={
            <React.Fragment>
                <div style={{maxWidth: 250}}>
                    {props.tooltipText}
                </div>

            </React.Fragment>

        }>
            <VisibilityIcon className={classes.icon}/>
        </Tooltip>
    )
}

export default HelpIcon;