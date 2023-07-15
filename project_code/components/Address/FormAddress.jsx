import React, { useState } from 'react';
import { TextField, FormControl, Autocomplete } from '@mui/material';
import * as Constants from '../../pages/constants';
import stylesP from '../../styles/Popup.module.css';

const stateOptions = [
    { value: 'Alabama', label: 'Alabama' },
    { value: 'Alaska', label: 'Alaska' },
    { value: 'Arizona', label: 'Arizona' },
    { value: 'Arkansas', label: 'Arkansas' },
    { value: 'California', label: 'California' },
    { value: 'Colorado', label: 'Colorado' },
    { value: 'Connecticut', label: 'Connecticut' },
    { value: 'Delaware', label: 'Delaware' },
    { value: 'Florida', label: 'Florida' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Hawaii', label: 'Hawaii' },
    { value: 'Idaho', label: 'Idaho' },
    { value: 'Illinois', label: 'Illinois' },
    { value: 'Indiana', label: 'Indiana' },
    { value: 'Iowa', label: 'Iowa' },
    { value: 'Kansas', label: 'Kansas' },
    { value: 'Kentucky', label: 'Kentucky' },
    { value: 'Louisiana', label: 'Louisiana' },
    { value: 'Maine', label: 'Maine' },
    { value: 'Maryland', label: 'Maryland' },
    { value: 'Massachusetts', label: 'Massachusetts' },
    { value: 'Michigan', label: 'Michigan' },
    { value: 'Minnesota', label: 'Minnesota' },
    { value: 'Mississippi', label: 'Mississippi' },
    { value: 'Missouri', label: 'Missouri' },
    { value: 'Montana', label: 'Montana' },
    { value: 'Nebraska', label: 'Nebraska' },
    { value: 'Nevada', label: 'Nevada' },
    { value: 'New Hampshire', label: 'New Hampshire' },
    { value: 'New Jersey', label: 'New Jersey' },
    { value: 'New Mexico', label: 'New Mexico' },
    { value: 'New York', label: 'New York' },
    { value: 'North Carolina', label: 'North Carolina' },
    { value: 'North Dakota', label: 'North Dakota' },
    { value: 'Ohio', label: 'Ohio' },
    { value: 'Oklahoma', label: 'Oklahoma' },
    { value: 'Oregon', label: 'Oregon' },
    { value: 'Pennsylvania', label: 'Pennsylvania' },
    { value: 'Rhode Island', label: 'Rhode Island' },
    { value: 'South Carolina', label: 'South Carolina' },
    { value: 'South Dakota', label: 'South Dakota' },
    { value: 'Tennessee', label: 'Tennessee' },
    { value: 'Texas', label: 'Texas' },
    { value: 'Utah', label: 'Utah' },
    { value: 'Vermont', label: 'Vermont' },
    { value: 'Virginia', label: 'Virginia' },
    { value: 'Washington', label: 'Washington' },
    { value: 'West Virginia', label: 'West Virginia' },
    { value: 'Wisconsin', label: 'Wisconsin' },
    { value: 'Wyoming', label: 'Wyoming' },
  ];

const FormAddress = ({ handleAddFormData }) => {
    const handleStateChange = (_, value) => {
        handleAddFormData({ target: { name: 'state', value: value?.value || '' } });
    };

    const [zipcode, setZipcode] = useState('');
    const [isZipcodeValid, setIsZipcodeValid] = useState(true);
  
    const handleZipcodeChange = (event) => {
      const value = event.target.value;
      setZipcode(value);
  
      // Validate the ZIP code
      setIsZipcodeValid(isValidUSZipcode(value));
  
      // Pass the updated value to the parent component
      handleAddFormData({ target: { name: 'zipcode', value } });
    };

    const isValidUSZipcode = (zipcode) => {
        // Regular expression pattern for validating US ZIP codes
        const zipcodePattern = /^\d{5}(?:-\d{4})?$/;
      
        return zipcodePattern.test(zipcode);
    };

    return (
        <div>
        <TextField
            type="text"
            name="address"
            label="Street Address"
            variant="standard"
            placeholder="Street Address"
            className={stylesP.formInput}
            required
            onChange={handleAddFormData}
        />
        <br />
        <TextField
            type="text"
            name="city"
            label="City"
            variant="standard"
            placeholder="City"
            className={stylesP.formInput}
            required
            onChange={handleAddFormData}
        />
        <br />
        <FormControl className={stylesP.formInput}>
            <Autocomplete
                name="state"
                options={stateOptions}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => <TextField {...params} label="State" variant="standard" required />}
                onChange={handleStateChange}
            />
        </FormControl>
        <TextField
            type="text"
            name="zipcode"
            label="Zipcode"
            variant="standard"
            placeholder="Zipcode"
            className={stylesP.formInput}
            required
            value={zipcode}
            onChange={handleZipcodeChange}
            error={!isZipcodeValid}  // Add error state based on the validity
            helperText={!isZipcodeValid && "Please enter a valid US ZIP code"}
        />
        </div>
  );
};

export default FormAddress;
