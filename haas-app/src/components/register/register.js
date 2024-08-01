import React, { useState } from 'react';
import CommonTextBox from '../common/TextBox/textbox';
import CommonButton from '../common/Button/button';
import { Grid } from "@mui/material";
import axios from 'axios';

const Register = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = () => {
    axios.post('http://127.0.0.1:5000/register', {
      username: username,
      password: password
    })
    .then(response => {
      setMessage(response.data.message);
      alert(response.data.message); // Show alert on successful Register
    })
    .catch(error => {
      console.error('There was an error!', error);
      setMessage('Register failed.');
      alert('Register failed.'); // Show alert on failed Register
    });
  };

  return (
    <Grid container display='flex' justifyContent='center'>
      <Grid item></Grid>
      <Grid item>
        <CommonTextBox
          label="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <CommonTextBox
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <CommonButton
          variant="contained"
          color="primary"
          onClick={handleRegister}
        >
          Register
        </CommonButton>
        {message && <p>{message}</p>}
      </Grid>
    </Grid>
  );
};

export default Register;
