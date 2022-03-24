import React from 'react';
import MuiAlert from '@mui/material/Alert';
export const Alert = React.forwardRef((props, ref) => {
    return <MuiAlert elevation={6} variant="filled" {...props} ref={ref} />;
});
