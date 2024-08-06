import React, { useState, useEffect } from "react";
import CommonTextBox from "../common/TextBox/textbox";
import CommonButton from "../common/Button/button";
import { Grid } from "@mui/material";


const Project = (props) => {

  return (
    <Grid container spacing={2} padding="48px">
      <Grid item xs={6}>
        <div style={{ marginTop: "8px", textDecoration: "underline", cursor: "pointer" }}>
          Create a New Project
        </div>
        <Grid item xs={8}>
          <CommonTextBox label="Project Name" name="projectName" />
          <CommonTextBox label="Project Id" name="projectId" />
          <CommonTextBox label="Project Description" name="projectDesc" />
          <Grid
            item
            justifyContent="center"
            display="flex"
            style={{ marginTop: "24px" }}
          >
            <CommonButton>Create</CommonButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <div style={{ marginTop: "8px", textDecoration: "underline",cursor: "pointer" }}>
          Join an existing project
        </div>
        <Grid item xs={6}>
          <CommonTextBox label="Project ID" name="projectId" />
          <Grid
            item
            justifyContent="center"
            display="flex"
            style={{ marginTop: "24px" }}
          >
            <CommonButton>Join</CommonButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Project;
