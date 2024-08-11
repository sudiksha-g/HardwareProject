import React from 'react';
import TextField from '@mui/material/TextField';
import './textbox.css';

const CommonTextBox = (props) => {
    return (
      <TextField
        variant="outlined"
        margin="normal"
        className="inputContainer"
        fullWidth
        {...props}
      />
    );
};

export default CommonTextBox;