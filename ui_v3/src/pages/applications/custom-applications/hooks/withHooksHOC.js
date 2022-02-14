import React from 'react';
import {useRunActions} from "./useRunActions";

export const withHooksHOC = (Component) => {
  return (props) => {
    const hookProps = useRunActions(props.data, props.tableMeta.Table);
    return <Component {...hookProps} {...props} />;
  };
};