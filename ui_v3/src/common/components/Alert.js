import React from 'react';
import MuiAlert from '@material-ui/lab/Alert';
export const Alert = React.forwardRef((props, ref) => {
    return <MuiAlert elevation={6} variant="filled" {...props} ref={ref} />;
});
