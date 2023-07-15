import React, { useState } from 'react';
import { TextField } from '@mui/material';
import stylesP from '../../styles/Popup.module.css';

export const FormWalletID = ({ handleAddFormData }) => {
    const [wallet, setWallet] = useState('');
    const [isWalletValid, setIsWalletValid] = useState(true);
  
    const handleWalletChange = (event) => {
      const value = event.target.value;
      setWallet(value);
  
      // Validate the ZIP code
      setIsWalletValid(isValidUSWallet(value));
      console.log("wallet", value);
      // Pass the updated value to the parent component
      handleAddFormData({ target: { name: 'walletId', value } });
    };

    const isValidUSWallet = (wallet) => {
        // Regular expression pattern for validating US ZIP codes
        const walletPattern = /^(0x)?[0-9a-fA-F]{40}$/;
      
        return walletPattern.test(wallet);
    };
    
    return (
        <TextField 
            type="text" 
            name="walletId" 
            label="Wallet ID" 
            variant="standard" 
            placeholder="Wallet ID"
            className={stylesP.formInput}
            required
            value={wallet}
            onChange={handleWalletChange}
            error={!isWalletValid}  // Add error state based on the validity
            helperText={!isWalletValid && "Please enter a valid Ethereum Wallet Address"}
        />
    );
}
