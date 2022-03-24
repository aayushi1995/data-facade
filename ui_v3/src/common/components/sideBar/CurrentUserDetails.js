import React, {useContext} from "react";
import {Grid, Typography} from "@mui/material";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AppContext from "../../../utils/AppContext";
import PersonIcon from '@mui/icons-material/Person';
import Logout from "../../../pages/home/components/Logout";

//props.appcontext.userName//workspaceName
export function CurrentUserDetails() {
    const appcontext = useContext(AppContext);
    const userName = appcontext.userName;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        userName ? <div style={{display: "flex", justifyContent: "flex-end", color: "white", position: "relative"}}>
            <Button
                id="basic-button"
                aria-controls="demo-positioned-menu"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                variant="outlined"
            >
                <Grid container
                      aria-controls="basic-menu"
                      style={{
                          display: "flex",
                          textTransform: "capitalize"
                      }}
                      alignItems="center"
                      justifyContent="center"
                >
                    <Grid item xs={2}>
                        <PersonIcon/>
                    </Grid>
                    <Grid container item xs={9}>
                        <Grid item xs={12}><Typography color="textPrimary">{userName}</Typography></Grid>
                        <Grid item xs={12}><Typography color="textPrimary">Role: Admin</Typography></Grid>
                    </Grid>
                </Grid>
            </Button>
            <Menu
                id="basic-menu"
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}><Logout/></MenuItem>
            </Menu>
        </div> : null
    );
}