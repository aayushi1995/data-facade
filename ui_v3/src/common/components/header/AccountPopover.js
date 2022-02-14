import React, {useRef, useState} from 'react';
import {Avatar, Box, ButtonBase, Divider, Popover, Typography} from '@material-ui/core';
import Logout from "../../../pages/home/components/Logout";
import {useAppBarProps} from "./DataFacadeAppBar";
import {ThemeToggle} from "./ThemeToggle";

const AccountPopover = () => {
    const anchorRef = useRef(null);
    const {appcontext, setSearchQuery} = useAppBarProps();
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <>
            <Box
                component={ButtonBase}
                onClick={handleOpen}
                ref={anchorRef}
                sx={{
                    alignItems: 'center',
                    display: 'flex'
                }}
            >
                <Avatar
                    sx={{
                        height: 32,
                        width: 32
                    }}
                />
            </Box>
            <Popover
                anchorEl={anchorRef.current}
                anchorOrigin={{
                    horizontal: 'center',
                    vertical: 'bottom'
                }}
                keepMounted
                onClose={handleClose}
                open={open}
                PaperProps={{
                    sx: {width: 240}
                }}
            >
                <Box sx={{p: 2}}>
                    <Typography
                        color="textPrimary"
                        variant="subtitle2"
                    >
                        {appcontext.userName}
                    </Typography>
                    <Typography
                        color="textSecondary"
                        variant="subtitle2"
                    >
                        {appcontext.workspaceName}
                    </Typography>
                    <Typography
                        color="textSecondary"
                        variant="subtitle2"
                    >
                        Toggle Theme: <ThemeToggle/>
                    </Typography>
                </Box>
                <Divider/>
                <Box sx={{p: 2}}>
                    <Logout/>
                </Box>
            </Popover>
        </>
    );
};

export default AccountPopover;
