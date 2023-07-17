import React from "react";
import styles from '../../styles/TenderForm.module.css';
import PropTypes from 'prop-types';
import { Select, Typography, TextField, Button, ButtonGroup, Input, MenuItem, OutlinedInput, InputLabel, Divider, Tab, Tabs, InputAdornment, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FormInjury } from "./FormInjury";
import { FormFacility } from "./FormFacility";

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
}  

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};
  
function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}

export const FormPrivate = ( props ) => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <Box>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Emergency Info" className={styles.tabText} {...a11yProps(0)} />
                    <Tab label="Appointment" className={styles.tabText} {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <FormInjury injuryType={props.injuryType} handleChangeInjury={props.handleChangeInjury} severity={props.severity} 
                                handleChangeSeverity={props.handleChangeSeverity} mechanismofInjury={props.mechanismofInjury} handleSetMechOfInjury={props.handleSetMechOfInjury} hideMsg={true}/>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <FormFacility allowedHospitals={props.allowedHospitals} selectedData={props.selectedData}/>
                </TabPanel>
            </Box>
        </div>
    );
}