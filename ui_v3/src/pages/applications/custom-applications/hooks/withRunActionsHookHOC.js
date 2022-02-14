import React from 'react';
import { useRunActions } from "./useRunActions";


export const withRunActionsHookHOC = (Component) => {
  return (props) => {
    const hookProps = useRunActions();

    return <Component {...hookProps} {...props} />;
  };
};