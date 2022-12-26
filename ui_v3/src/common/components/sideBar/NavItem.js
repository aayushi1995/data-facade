import {useState} from 'react';
import {NavLink as RouterLink} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Box, Button, Collapse, ListItem, useTheme} from '@mui/material';
import ChevronDownIcon from '../icons/ChevronDown';
import ChevronRightIcon from '../icons/ChevronRight';

const NavItem = (props) => {
    const {active, children, depth, icon, info, open: openProp, path, title, ...other} = props;
    const [open, setOpen] = useState(openProp);
    const theme = useTheme();
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    let paddingLeft = 16;

    if (depth > 0) {
        paddingLeft = 32 + 8 * depth;
    }

    // Branch
    if (children) {
        return (
            <ListItem
                disableGutters
                sx={{
                    display: 'block',
                    paddingTop: 0,
                    paddingBottom: 0
                }}
                {...other}
            >
                <Button
                    endIcon={!open ? <ChevronRightIcon fontSize="small"/>
                        : <ChevronDownIcon fontSize="small"/>}
                    onClick={handleToggle}
                    startIcon={icon}
                    style={{
                        color: theme.palette.text.secondary,
                        fontWeight: theme.typography.fontWeightMedium,
                        justifyContent: 'flex-start',
                        padding: `12px 8px 12px ${paddingLeft}px`,
                        textAlign: 'left',
                        textTransform: 'none',
                        width: '100%'
                    }}
                    variant="text"
                >
                    <Box sx={{flexGrow: 1}}>
                        {title}
                    </Box>
                    {info}
                </Button>
                <Collapse in={open}>
                    {children}
                </Collapse>
            </ListItem>
        );
    }
    // Leaf
    return (
        <ListItem
            disableGutters
            style={{
                display: 'flex',
                paddingTop: 0,
                paddingBottom: 0
            }}
        >
            <Button
                component={path && RouterLink}
                startIcon={icon}
                style={{
                    color: theme.palette.text.secondary,
                    fontWeight: theme.typography.fontWeightMedium,
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    padding: `12px 8px 12px ${paddingLeft}px`,
                    textTransform: 'none',
                    width: '100%',
                    fill: theme.palette.text.secondary,
                    ...(active && {
                        color: theme.palette.primary.main,
                        fontWeight: theme.typography.fontWeightBold,
                        fill: theme.palette.primary.main
                    })
                }}
                variant="text"
                to={path}
            >
                <Box sx={{flexGrow: 1}}>
                    {title}
                </Box>
                {info}
            </Button>
        </ListItem>
    );
};

NavItem.propTypes = {
    active: PropTypes.bool,
    children: PropTypes.node,
    depth: PropTypes.number.isRequired,
    icon: PropTypes.node,
    info: PropTypes.node,
    open: PropTypes.bool,
    path: PropTypes.string,
    title: PropTypes.string.isRequired
};

NavItem.defaultProps = {
    active: false,
    open: false
};

export default NavItem;