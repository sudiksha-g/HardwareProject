import React, { useState,useEffect } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CommonButton from "../common/Button/button";
import CommonTextBox from "../common/TextBox/textbox";
import { Button, Grid } from "@mui/material";
import axios from "axios";

function createData(name, id, description) {
  return {
    name,
    id,
    description,
    hwsets: [
      {
        name: "Hardware Set 1",
        capacity: 100,
        availability: 100,
        qty: 3,
      },
      {
        name: "Hardware Set 2",
        capacity: 100,
        availability: 200,
        qty: 2,
      },
    ],
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  const handleArrowClick = () => {
    setOpen(!open);
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={handleArrowClick}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.id}</TableCell>
        <TableCell align="right">{row.description}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              {/* <Typography variant="h6" gutterBottom component="div">
                Resources
              </Typography> */}
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}></TableCell>
                    <TableCell style={{ fontWeight: 600 }}>
                      Hardware Set
                    </TableCell>
                    <TableCell style={{ fontWeight: 600 }}>Capactiy</TableCell>
                    <TableCell align="right" style={{ fontWeight: 600 }}>
                      Availability
                    </TableCell>
                    <TableCell align="right" style={{ fontWeight: 600 }}>
                      Quantity
                    </TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.hwsets.map((historyRow) => (
                    <TableRow key={historyRow.name}>
                      <TableCell component="th" scope="row"></TableCell>
                      <TableCell component="th" scope="row">
                        {historyRow.name}
                      </TableCell>
                      <TableCell>{historyRow.capacity}</TableCell>
                      <TableCell align="right">
                        {historyRow.availability}
                      </TableCell>
                      <TableCell align="right">
                        <CommonTextBox
                          style={{ width: "124px", padding: "8px" }}
                        >
                          {historyRow.qty}
                        </CommonTextBox>
                      </TableCell>
                      <TableCell align="right">
                        <Grid container spacing={2} justifyContent="end">
                          <Grid item>
                            <Button
                              variant="outlined"
                              style={{ borderRadius: "16px" }}
                            >
                              CheckIn
                            </Button>
                          </Grid>
                          <Grid item>
                            <CommonButton
                              variant="outlined"
                              style={{ borderRadius: "16px" }}
                            >
                              CheckOut
                            </CommonButton>
                          </Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const rows = [
  createData("Project 1", 1, "Project created by user1"),
  createData("Project 2", 2, "Project created by user2"),
];

export default function CollapsibleTable() {
  const [openCreateNew, setOpenCreateNew] = useState(false);
  const [openJoin, setOpenJoin] = useState(false);
  const [projectData, setProjectData] = useState({
    projectId: "",
    projectName: "",
    projectDesc: "",
  });
  const [message, setMessage] = useState("");
  const [projectIdToJoin, setProjectIdToJoin] = useState("");
  const [joinMessage, setJoinMessage] = useState("");
  const user = JSON.parse(sessionStorage.getItem('user'));



  //
  const handleCreateClick = () => {
    setOpenCreateNew(true);
    setOpenJoin(false);
  };

  const handleJoinClick = () => {
    setOpenJoin(true);
    setOpenCreateNew(false);
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };

  const handleProjectIdToJoin = (e) =>{
    setProjectIdToJoin(e.target.value)
  }

  const handleCreateProject = () => {
    axios
      .post("http://127.0.0.1:5000/createProject", {
        projectId: projectData.projectId,
        projectName: projectData.projectName,
        projectDesc: projectData.projectDesc,
      })
      .then((response) => {
        console.log("response", response);
        setMessage(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error.response.data.message);
      });
  };

  const handleJoinProject = () => {
    axios
      .post("http://127.0.0.1:5000/joinProject", {
        projectId: projectIdToJoin,
        username : user
      })
      .then((response) => {
        console.log("response", response);
        setJoinMessage(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error.response.data.message);
      });
  }

  useEffect(() => {
    // Fetch user projects when component mounts
    if (user) {
      axios
        .get("http://127.0.0.1:5000/getUserProjects", {
          username: user, // Adjust if needed to match your API
        })
        .then((response) => {
          console.log("response". response)
          //setProjects(response.data.projects || []); // Adjust based on your API response
        })
        .catch((error) => {
          console.error("There was an error fetching user projects!", error);
        });
    }
  }, [user]);


  return (
    <Grid container style={{ margin: "24px", width: "auto" }}>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell style={{ fontWeight: 600 }}>Projects Name</TableCell>
              <TableCell align="right" style={{ fontWeight: 600 }}>
                Project Id
              </TableCell>
              <TableCell align="right" style={{ fontWeight: 600 }}>
                Project Description
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row key={row.name} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container display="flex" justifyContent="center" spacing={2}>
        <Grid
          item
          justifyContent="center"
          display="flex"
          style={{ marginTop: "24px" }}
        >
          <CommonButton variant="outlined" onClick={handleCreateClick}>
            Create New Project
          </CommonButton>
        </Grid>
        <Grid
          item
          justifyContent="center"
          display="flex"
          style={{ marginTop: "24px" }}
        >
          <CommonButton variant="outlined" onClick={handleJoinClick}>
            Join
          </CommonButton>
        </Grid>
      </Grid>
      {openCreateNew && (
        <Grid container display="flex" justifyContent="center">
          <Grid item xs={6}>
            <div
              style={{
                marginTop: "8px",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Create a New Project
            </div>
            <Grid item xs={8}>
              <CommonTextBox
                label="Project Name"
                name="projectName"
                value={projectData.projectName}
                onChange={handleTextChange}
              />
              <CommonTextBox
                label="Project Id"
                name="projectId"
                value={projectData.projectId}

            onChange={handleTextChange}
              />
              <CommonTextBox
                label="Project Description"
                name="projectDesc"
                value={projectData.projectDesc}

            onChange={handleTextChange}
              />
              <Grid
                item
                justifyContent="center"
                display="flex"
                style={{ marginTop: "24px" }}
              >
                <CommonButton onClick={handleCreateProject}>
                  Create
                </CommonButton>
              </Grid>
            </Grid>
          </Grid>
          {message && (
            <Grid>{message}</Grid>
          )}
        </Grid>
      )}
      {openJoin && (
        <Grid container display="flex" justifyContent="center" spacing={2}>
          <Grid item xs={6}>
            <div
              style={{
                marginTop: "8px",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Join an existing project
            </div>
            <Grid item xs={6}>
              <CommonTextBox label="Project ID" name="projectId" 
                value={projectIdToJoin} onChange={handleProjectIdToJoin}/>
              <Grid
                item
                justifyContent="center"
                display="flex"
                style={{ marginTop: "24px" }}
              >
                <CommonButton onClick={handleJoinProject}>Join</CommonButton>
              </Grid>
            </Grid>
          </Grid>
          {joinMessage && (
            <Grid>{joinMessage}</Grid>
          )}
        </Grid>
      )}
    </Grid>
  );
}
