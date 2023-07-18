import React from "react";
import styles from "../../styles/TenderForm.module.css";
import PropTypes from "prop-types";
import { Typography, Tab, Tabs, Box } from "@mui/material";
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
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const FormPrivate = (props) => {
  return (
    <div>
      <Box>
        <Tabs
          value={props.value}
          onChange={props.handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            label="Emergency Info"
            className={styles.tabText}
            {...a11yProps(0)}
          />
          <Tab
            label="Appointment Details"
            className={styles.tabText}
            {...a11yProps(1)}
          />
        </Tabs>
        <TabPanel value={props.value} index={0}>
          <FormInjury
            injuryType={props.injuryType}
            handleChangeInjury={props.handleChangeInjury}
            severity={props.severity}
            handleChangeSeverity={props.handleChangeSeverity}
            mechanismofInjury={props.mechanismofInjury}
            handleSetMechOfInjury={props.handleSetMechOfInjury}
            hideMsg={true}
          />
        </TabPanel>
        <TabPanel value={props.value} index={1}>
          <FormFacility
            allowedHospitals={props.allowedHospitals}
            selectedData={props.selectedData}
          />
        </TabPanel>
      </Box>
    </div>
  );
};
