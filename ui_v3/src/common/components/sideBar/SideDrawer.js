import React, {useContext} from 'react';
import {Link as RouterLink, useLocation} from "react-router-dom";
import {Avatar, Box, Button, Divider, Drawer, Link, Typography, useTheme,} from "@material-ui/core";
import {menuItems} from "./sideMenuConfig";
import NavSection from "./NavSection";
import Scrollbar from "./Scrollbar";
import AppContext from "../../../utils/AppContext";

export const SideDrawer = () => {
    const location = useLocation();
    const appcontext = useContext(AppContext);
    const userName = appcontext.userName;
    const theme = useTheme();
    return <Drawer
        anchor="left"
        open
        PaperProps={{
            sx: {
                backgroundColor: 'background.paper',
                height: 'calc(100% - 64px) !important',
                top: '64px !Important',
                width: 220
            }
        }}
        variant="permanent"
    >
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
        >
            <Scrollbar options={{suppressScrollX: true}}>
                <Box sx={{p: 2}}>
                    <Box
                        sx={{
                            alignItems: 'center',
                            backgroundColor: theme.palette.background.default,
                            borderRadius: 1,
                            display: 'flex',
                            overflow: 'hidden',
                            p: 2
                        }}
                    >
                        <RouterLink to="/users">
                            <Avatar
                                sx={{
                                    cursor: 'pointer',
                                    height: 48,
                                    width: 48
                                }}
                            />
                        </RouterLink>
                        <Box sx={{ml: 2}}>
                            <Typography
                                color="textPrimary"
                                variant="subtitle2"
                            >
                                {userName}
                            </Typography>
                            <Typography
                                color="textSecondary"
                                variant="body2"
                            >
                                Role:
                                {' '}
                                <Link
                                    color="primary"
                                    component={RouterLink}
                                    to="/"
                                >
                                    Admin
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Divider/>
                <Box sx={{p: 2}}>
                    {menuItems.map((section) => (
                        <NavSection
                            title={section.name}
                            items={section.subItems}
                            key={section.name}
                            pathname={location.pathname}
                            style={{
                                '& + &': {
                                    marginTop: 3
                                }
                            }}
                            {...section}
                        />
                    ))}
                </Box>
                <Divider/>
                <Box sx={{p: 2}}>
                    <Typography
                        color="textPrimary"
                        variant="subtitle2"
                    >
                        <Link href="https://data-facade.readme.io/discuss" replace target="_blank">
                        Need Help?
                        </Link>
                    </Typography>
                    <Typography
                        color="textSecondary"
                        variant="body2"
                    >
                        Check our docs
                    </Typography>
                    <Button
                        color="primary"
                        fullWidth
                        style={{marginTop: 2}}
                        variant="contained"
                        target="_blank"
                        component="a"
                        href="https://data-facade.readme.io/"
                    >
                            Documentation
                    </Button>
                </Box>
            </Scrollbar></Box>
    </Drawer>;
}