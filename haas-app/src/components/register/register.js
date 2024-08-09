import React, { useState } from "react";
import CommonTextBox from "../common/TextBox/textbox";
import CommonButton from "../common/Button/button";
import { Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import { display } from "@mui/system";

const styles = {
  root: {
    paddingTop: "48px",
  },
  container: {
    display: "flex",
    justifyContent: "center",
  },
  btn: {
    display: "flex",
    justifyContent: "center",
    marginTop: "24px",
  },
  error: {
    color: "red",
    paddingTop: "24px",
  },
  success: {
    color: "blue",
    paddingTop: "24px",
  },
};

const Register = (props) => {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError(false);
    setMessage("");
  };

  const handleRegister = () => {
    axios
      .post("http://127.0.0.1:5000/registerUser", {
        username: formData.userName,
        password: formData.password,
      })
      .then((response) => {
        setMessage(response.data.message);
        setOpen(true);
        setIsRegistered(true);
      })
      .catch((error) => {
        setError(true);
        setMessage(error.response.data.message);
      });
  };

  return (
    <Grid sx={styles.root}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={styles.container}
      >
        New User Form
      </Typography>
      <Grid container sx={styles.container}>
        <Grid item></Grid>
        <Grid item>
          <CommonTextBox
            label="Username"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
          />
          <CommonTextBox
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          {isRegistered ? (
            <Grid sx={styles.btn}>
              <Link to="/">Go To Login</Link>
            </Grid>
          ) : (
            <Grid container spacing={2} sx={styles.btn}>
              <Grid item xs={6}>
                <CommonButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleRegister}
                >
                  Submit
                </CommonButton>
              </Grid>
              <Grid item xs={6}>
                <Link to="/">
                  <CommonButton
                    type="submit"
                    variant="outlined"
                    color="primary"
                    fullWidth
                  >
                    Cancel
                  </CommonButton>
                </Link>
              </Grid>
            </Grid>
          )}

          {message && (
            <Grid sx={error ? styles.error : styles.success}>{message}</Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Register;
