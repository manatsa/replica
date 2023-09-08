import * as React from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {PrimaryColor} from "./Constants.jsx";

const TabPanel=(props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            //style={{border:`0px 0.1px  dotted ${PrimaryColor}`}}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export default TabPanel;