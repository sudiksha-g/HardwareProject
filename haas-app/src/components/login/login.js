import React, { useEffect, useState } from "react";
import CommonTextBox from "../common/TextBox/textbox";
import CommonButton from "../common/Button/button";
import { Grid, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { fontSize } from "@mui/system";

const styles = {
  titleContainer: {
    paddingTop: "48px",
  },
  title: {
    padding: "24px",
    fontSize: "48px",
    display: "flex",
    justifyContent: "center",
  },
  button: {
    marginTop: "24px",
    display: "flex",
    justifyContent: "center",
  },
  link: {
    marginTop: "8px",
    textDecoration: "underline",
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

const Login = (props) => {
  const [userLoginData, setUserLoginData] = useState({
    userName: "",
    password: "",
  });
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    axios
      .post("http://127.0.0.1:5000/loginUser", {
        username: userLoginData.userName,
        password: userLoginData.password,
      })
      .then((response) => {
        console.log("response", response);
        setOpen(true);
        setMessage(response.data.message);
        navigate("/project");
      })
      .catch((error) => {
        console.error("There was an error!", error.response.data.message);
        setError(true);
        setMessage(error.response.data.message);
      });
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setUserLoginData({ ...userLoginData, [name]: value });
    setMessage("");
  };

  useEffect(() => {
    if (
      userLoginData &&
      userLoginData.userName.trim() !== "" &&
      userLoginData &&
      userLoginData.password.trim() !== ""
    ) {
      setEnabled(true);
    } else {
      setEnabled(false);
    }
  }, [userLoginData.userName, userLoginData.password]);

  return (
    <>
      <Grid sx={styles.titleContainer}>
        <Typography sx={styles.title}>Welcome to HaaS Application</Typography>
      </Grid>
      <Grid container display="flex" justifyContent="center">
        <Grid item></Grid>
        <Grid item>
          <CommonTextBox
            label="Username"
            name="userName"
            value={userLoginData.userName}
            onChange={handleTextChange}
          />
          <CommonTextBox
            label="Password"
            type="password"
            name="password"
            value={userLoginData.password}
            onChange={handleTextChange}
          />
          <CommonButton
            sx={styles.button}
            disabled={!enabled}
            variant="contained"
            color="primary"
            onClick={handleLogin}
          >
            Login
          </CommonButton>
          <Grid sx={styles.link}>
            <Link to="/register">New User?</Link>
          </Grid>
          {message && (
            <Grid sx={error ? styles.error : styles.success}>{message}</Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
