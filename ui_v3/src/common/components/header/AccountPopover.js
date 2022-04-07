import { Avatar, Box, ButtonBase, Divider, Popover, Typography } from '@mui/material';
import React, { useRef, useState } from 'react';
import Logout from "../../../pages/home/components/Logout";
import { useAppBarProps } from "./DataFacadeAppBar";

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
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2}}>
                    <Box>
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
                    </Box>
                    <Divider/>
                    <Box>
                        <Logout/>
                    </Box>
                </Box>
            </Popover>
        </>
    );
};

export default AccountPopover;
