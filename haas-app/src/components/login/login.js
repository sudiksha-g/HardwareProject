import React from 'react';
import CommonTextBox from '../common/TextBox/textbox';
import CommonButton from '../common/Button/button';
import { Grid } from "@mui/material";

const Login = (props) => {
  return (
    <Grid container display='flex' justifyContent='center'>    
        <Grid item></Grid>    
        <Grid item>
      <CommonTextBox
        label="Username"
        onChange={(e) => console.log(e.target.value)}
      />
      <CommonTextBox
        label="Password"
        onChange={(e) => console.log(e.target.value)}
      />
      <CommonButton
        variant="contained"
        color="primary"
        onClick={() => alert("User Logged In Successfully!!!")}
      >
        Login
      </CommonButton>
      </Grid>
      </Grid>
  );
};

export default Login;