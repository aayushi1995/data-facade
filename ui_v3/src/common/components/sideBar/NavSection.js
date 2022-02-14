import React from "react";
import PropTypes from 'prop-types';
import {matchPath} from 'react-router-dom';
import {List, ListSubheader, useTheme} from '@material-ui/core';
import NavItem from './NavItem';

const renderNavItems = ({depth = 0, items, pathname}) => (
    <List disablePadding>
        {items.reduce(
            // eslint-disable-next-line no-use-before-define
            (acc, item) => reduceChildRoutes({
                acc,
                item,
                pathname,
                depth
            }), []
        )}
    </List>
);

const reduceChildRoutes = ({acc, pathname, item, depth}) => {
    const key = `${item.name}-${depth}`;
    const exactMatch = item.linkTo ? !!matchPath(pathname, {
        path: item.linkTo,
        end: true
    }) : false;

    if (item.children) {
        const partialMatch = item.linkTo ? !!matchPath(pathname, {
            path: item.linkTo,
            end: false
        }) : false;

        acc.push(
            <NavItem
                active={partialMatch}
                depth={depth}
                icon={item.icon}
                info={item.info}
                key={key}
                open={partialMatch}
                path={item.linkTo}
                title={item.name}
            >
                {renderNavItems({
                    depth: depth + 1,
                    items: item.children,
                    pathname
                })}
            </NavItem>
        );
    } else {
        acc.push(
            <NavItem
                active={exactMatch}
                depth={depth}
                icon={item.icon}
                info={item.info}
                key={key}
                path={item.linkTo}
                title={item.name}
            />
        );
    }

    return acc;
};

const NavSection = (props) => {
    const {items, pathname, title, ...other} = props;
    const theme = useTheme();
    return (
        <List
            subheader={(
                <ListSubheader
                    disableGutters
                    disableSticky
                    style={{
                        color: theme.palette.text.primary,
                        fontSize: '0.75rem',
                        lineHeight: 2.5,
                        fontWeight: 700,
                        textTransform: "uppercase"
                    }}
                >
                    {title}
                </ListSubheader>
            )}
            {...other}
        >
            {renderNavItems({
                items,
                pathname
            })}
        </List>
    );
};

NavSection.propTypes = {
    items: PropTypes.array,
    pathname: PropTypes.string,
    title: PropTypes.string
};

export default NavSection;
