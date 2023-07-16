import React from "react";
import styles from '../../styles/TenderForm.module.css';
import { Select, Typography, TextField, Button, ButtonGroup, Input, MenuItem, OutlinedInput, InputLabel, Divider, InputAdornment } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const injuryTypes = [
    'Broken Bone',
    'Sprain',
    'Laceration',
    'Concussion',
    'Hemorrhage',
    'Traumatic Brain Injury',
    'Skull fracture',
    'Other'
];

const mechanismsOfOnjury = [
    'Vehicular Crash',
    'Assault',
    'Battery',
    'Stab',
    'Gunshot',
    'Fall',
    'Fire',
    'Other'
]

function getStyles(name, injuryType, theme) {
    return {
      fontWeight:
        injuryType.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
}

/**
 * Handles adding data to the MongoDB data for patients and tenders
 * @param {*} patient 
 * @param {*} tender 
 * @returns 
 */
 async function handlePost(patient, tender) {

    let patients = await fetch('api/patients', {
        method: 'POST',
        body: JSON.stringify(patient)
    });
    let patientData = await patients.json();

    let tenders = await fetch('api/tenders', {
        method: 'POST',
        body: JSON.stringify(tender)
    });

    let tendersData = await tenders.json();

    if (patientData.success && tendersData.success) {
        return true;
    } else {
        return false;
    }
}

export const FormInjury = (props) => {
    const theme = useTheme();

    return (
        <div>
            <h2 className={styles.headingText}>Incident Information</h2>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div className={styles.injuryDiv}>
                <InputLabel id="injuryType">Injury Type</InputLabel>
                <Select
                    labelId="injuryType"
                    id={styles.injuryType}
                    multiple
                    value={props.injuryType}
                    onChange={props.handleChangeInjury}
                    input={<OutlinedInput label="Name" />}
                    MenuProps={MenuProps}
                    >
                    {injuryTypes.map((name) => (
                        <MenuItem
                        key={name}
                        value={name}
                        style={getStyles(name, props.injuryType, theme)}
                        >
                        {name}
                        </MenuItem>
                    ))}
                </Select>
            </div>
            <div className={styles.injuryDiv}>
                <InputLabel id="severity">Severity</InputLabel>
                <Select
                labelId="severity"
                id={styles.severity}
                value={props.severity}
                label="Severity Level"
                required
                onChange={props.handleChangeSeverity}
                >
                    <MenuItem value={"Low"}>Low</MenuItem>
                    <MenuItem value={"Medium"}>Medium</MenuItem>
                    <MenuItem value={"High"}>High</MenuItem>
                    <MenuItem value={"Critical"}>Critical</MenuItem>
                </Select>
            </div>
            </div>
            <div className={styles.injuryDiv}>
                <InputLabel id="severity">Mechanism of Injury</InputLabel>
                <Select
                    labelId="mechanism_of_injury"
                    id={styles.mechanism}
                    multiple
                    value={props.mechanismofInjury}
                    label="Mechanism of Injury"
                    onChange={props.handleSetMechOfInjury}
                >
                    {mechanismsOfOnjury.map((name) => (
                        <MenuItem
                        key={name}
                        value={name}
                        style={getStyles(name, props.mechanismofInjury, theme)}
                        >
                        {name}
                        </MenuItem>
                    ))}
                </Select>
            </div>
        </div>
    );
}