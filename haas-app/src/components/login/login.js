import React, { useState } from "react";
import CommonTextBox from "../common/TextBox/textbox";
import CommonButton from "../common/Button/button";
import CommonDialog from "../common/DialogBox/dialogBox";
import { Grid } from "@mui/material";
import { Link } from "react-router-dom";

const Login = (props) => {
  const [open, setOpen] = useState(false);
  const [userLoginData, setUserLoginData] = useState({
    userName: "",
    password: "",
  });

  const handleClickOpen = () => {
    setOpen(true);
    setUserLoginData({
      ...userLoginData,
      userName: "",
      password: "",
    })
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setUserLoginData({ ...userLoginData, [name]: value });
  };

  return (
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
          style={{
            marginTop: "24px",
            display: "flex",
            justifyContent: "center",
          }}
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
        >
          Login
        </CommonButton>
        <div style={{ marginTop: "8px", textDecoration: "underline" }}>
          <Link to="/register">New User?</Link>
        </div>
        <CommonDialog
          open={open}
          title="Message"
          content="User Logged in Successfully!!"
          handleClose={handleClose}
        />
      </Grid>
    </Grid>
  );
};

export default Login;
