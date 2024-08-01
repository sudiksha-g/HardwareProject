import React, { useState } from "react";
import { Grid, Container, Typography } from "@mui/material";
import CommonButton from "../common/Button/button";
import { Link } from "react-router-dom";
import CommonTextBox from "../common/TextBox/textbox";

const NewUserForm = () => {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    // Add your form submission logic here
  };

  const handleClickOpen = () => {
    setFormData({
      ...formData,
      userName: "",
      password: "",
    });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        New User Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CommonTextBox
              label="Username"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
            /> 
          </Grid>
          <Grid item xs={12}>
            <CommonTextBox
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            /> 
          </Grid>
          <Grid
            container
            style={{ marginTop: "24px", margin: "24px" }}
            spacing={2}
          >
            <Grid item xs={6}>
              <CommonButton
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleClickOpen}
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
        </Grid>
      </form>
    </Container>
  );
};

export default NewUserForm;
