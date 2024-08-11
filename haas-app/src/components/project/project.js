import React, { useState, useEffect } from "react";
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
import CommonDialog from "../common/DialogBox/dialogBox";
import { Button, Grid } from "@mui/material";
import axios from "axios";

function Row(props) {
  const { row, onCheckout, onCheckin, clearQuantities } = props;
  const [open, setOpen] = useState(false);
  const [quantities, setQuantities] = useState({});

  const handleArrowClick = () => {
    setOpen(!open);
  };

  const handleQuantityChange = (hwSetNum, value) => {
    setQuantities({
      ...quantities,
      [hwSetNum]: value,
    });
  };

  useEffect(() => {
    if (clearQuantities) {
      setQuantities({});
    }
  }, [clearQuantities]);

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
          {row.projectName}
        </TableCell>
        <TableCell align="right">{row.projectId}</TableCell>
        <TableCell align="right">{row.description}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
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
                    <TableCell align="right" style={{ fontWeight: 600 }}>
                      Checked out Units
                    </TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.hwsets.map((hwInfo, index) => (
                    <TableRow key={hwInfo.name}>
                      <TableCell component="th" scope="row"></TableCell>
                      <TableCell component="th" scope="row">
                        {hwInfo.name}
                      </TableCell>
                      <TableCell>{hwInfo.capacity}</TableCell>
                      <TableCell align="right">{hwInfo.availability}</TableCell>
                      <TableCell align="right">
                        <CommonTextBox
                          style={{ width: "124px", padding: "8px" }}
                          value={quantities[index + 1] || ""}
                          onChange={(e) =>
                            handleQuantityChange(index + 1, e.target.value)
                          }
                          type="number"
                        />
                      </TableCell>
                      <TableCell align="right">{hwInfo.checkedOut}</TableCell>
                      <TableCell align="right">
                        <Grid container spacing={2} justifyContent="end">
                          <Grid item>
                            {/* 
                            <Button
                              variant="outlined"
                              style={{ borderRadius: "16px" }}
                            >
                              CheckIn
                            </Button> */}
                            <CommonButton
                              variant="outlined"
                              style={{ borderRadius: "16px" }}
                              onClick={() =>
                                onCheckin(
                                  row.projectId,
                                  index + 1,
                                  parseInt(quantities[index + 1], 10)
                                )
                              }
                            >
                              CheckIn
                            </CommonButton>
                          </Grid>
                          <Grid item>
                            <CommonButton
                              variant="outlined"
                              style={{ borderRadius: "16px" }}
                              onClick={() =>
                                onCheckout(
                                  row.projectId,
                                  index + 1,
                                  parseInt(quantities[index + 1], 10)
                                )
                              }
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

export default function CollapsibleTable() {
  const [openCreateNew, setOpenCreateNew] = useState(false);
  const [openJoin, setOpenJoin] = useState(false);
  const [projectData, setProjectData] = useState({
    projectId: "",
    projectName: "",
    projectDesc: "",
  });
  const [projectIdToJoin, setProjectIdToJoin] = useState("");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [projectsDataList, setProjectsDataList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [clearQuantities, setClearQuantities] = useState(false);
  const [enableCreateProject, setEnableCreateProject] = useState(false);
  const [enableJoinProject, setEnableJoinProject] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleCreateClick = () => {
    setProjectIdToJoin("");
    setOpenCreateNew(true);
    setOpenJoin(false);
    setValidationError("");
  };

  const handleJoinClick = () => {
    setProjectData({
      projectId: "",
      projectName: "",
      projectDesc: "",
    });
    setOpenJoin(true);
    setOpenCreateNew(false);
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
    setValidationError("");
  };

  const handleProjectIdToJoin = (e) => {
    setProjectIdToJoin(e.target.value);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    fetchProjectData();
    setClearQuantities((prevState) => !prevState);
  };

  const handleCreateProject = () => {
    const token = localStorage.getItem("token");
    const projectId = parseInt(projectData.projectId, 10);

    if (isNaN(projectId) || projectId <= 0) {
      setValidationError(
        "Invalid Project ID: Project ID must be a positive number greater than zero."
      );
      return;
    }
    setValidationError("");

    axios
      .post(
        "http://127.0.0.1:5000/createProject",
        {
          projectId: projectData.projectId,
          projectName: projectData.projectName,
          projectDesc: projectData.projectDesc,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setOpenDialog(true);
        setDialogMessage(response.data);
      })
      .catch((error) => {
        console.error("There was an error!");
        setOpenDialog(true);
        setDialogMessage(error.message);
      });
  };

  const handleJoinProject = () => {
    const token = localStorage.getItem("token");
    axios
      .post(
        "http://127.0.0.1:5000/joinProject",
        {
          projectId: projectIdToJoin,
          username: user,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        fetchProjectData();
        setOpenCreateNew(false);
        setOpenDialog(true);
        setDialogMessage(response.data.message);
      })
      .catch((error) => {
        console.error("There was an error!", error.response.data.message);
        setOpenDialog(true);
        setDialogMessage(error.response.data.message);
      });
  };

  // Function to handle hardware checkout
  const handleCheckout = (projectId, hwSetNum, value) => {
    const token = localStorage.getItem("token");
    if (value > 0) {
      axios
        .post(
          "http://127.0.0.1:5000/checkOut",
          {
            projectId: projectId,
            hwSetNum: hwSetNum,
            value: value,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setOpenDialog(true);
          setDialogMessage(response.data);
        })
        .catch((error) => {
          setDialogMessage("Error during checkout!");
          setOpenDialog(true);
          console.error("There was an error during checkout!", error);
        });
    } else {
      alert("Invalid quantity: Quantity must be greater than zero.");
    }
  };

  // Function to handle hardware checkin
  const handleCheckin = (projectId, hwSetNum, value) => {
    const token = localStorage.getItem("token");
    if (value > 0) {
      axios
        .post(
          "http://127.0.0.1:5000/checkIn",
          {
            projectId: projectId,
            hwSetNum: hwSetNum,
            value: value,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setOpenDialog(true);
          setDialogMessage(response.data);
        })
        .catch((error) => {
          setDialogMessage("Error during check-in!");
          setOpenDialog(true);
          console.error("There was an error during checkout!", error);
        });
    } else {
      alert("Invalid quantity: Quantity must be greater than zero.");
    }
  };

  const fetchProjectData = async () => {
    const token = localStorage.getItem("token");
    try {
      const [firstHwResponse, secondHwResponse, projectsResponse] =
        await Promise.all([
          axios.post(
            "http://127.0.0.1:5000/queryHardwareSet",
            {
              hwSetNum: 1,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
          axios.post(
            "http://127.0.0.1:5000/queryHardwareSet",
            {
              hwSetNum: 2,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
          axios.post(
            "http://127.0.0.1:5000/getUserProjects",
            {
              username: user,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

      const hwFirstInfo = {
        name: "Hardware Set 1",
        capacity: firstHwResponse.data.capacity,
        availability: firstHwResponse.data.availability,
      };

      const hwSecondInfo = {
        name: "Hardware Set 2",
        capacity: secondHwResponse.data.capacity,
        availability: secondHwResponse.data.availability,
      };

      const combinedProjectsDataList = projectsResponse.data.projects.map(
        (project) => ({
          projectName: project.projectName,
          projectId: project.projectId,
          description: project.description,
          hwsets: [
            {
              ...hwFirstInfo,
              checkedOut: project.checkedOutList[0] || 0,
            },
            {
              ...hwSecondInfo,
              checkedOut: project.checkedOutList[1] || 0,
            },
          ],
        })
      );
      setProjectsDataList(combinedProjectsDataList);
      setClearQuantities(true);
    } catch (error) {
      console.error("There was an error fetching data!", error);
    }
  };

  //Enables the join project button only if the projectID is provided by user
  useEffect(() => {
    if (projectIdToJoin.trim() !== "") {
      setEnableJoinProject(true);
    } else {
      setEnableJoinProject(false);
    }
  }, [projectIdToJoin]);

  //Enables the create project button only if the details are filled
  useEffect(() => {
    const { projectName, projectDesc, projectId } = projectData || {};

    if (
      projectName?.trim() !== "" &&
      projectDesc?.trim() !== "" &&
      projectId?.trim() !== ""
    ) {
      setEnableCreateProject(true);
    } else {
      setEnableCreateProject(false);
    }
  }, [projectData]);

  useEffect(() => {
    if (user) {
      fetchProjectData();
    }
    // eslint-disable-next-line
  }, [user]);

  return (
    <Grid container style={{ margin: "24px", width: "auto" }}>
      <Grid
        container
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "24px",
        }}
      >
        <Button onClick={handleLogout} variant="outlined">
          Logout
        </Button>
      </Grid>
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
            {projectsDataList.map((project) => (
              <Row
                key={project.projectId}
                row={project}
                onCheckout={handleCheckout}
                onCheckin={handleCheckin}
                clearQuantities={clearQuantities}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CommonDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        content={dialogMessage}
      ></CommonDialog>
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
              {validationError && (
                <div style={{ color: "red", marginTop: "8px" }}>
                  {validationError}
                </div>
              )}
              <Grid
                item
                justifyContent="center"
                display="flex"
                style={{ marginTop: "24px" }}
              >
                <CommonButton
                  onClick={handleCreateProject}
                  disabled={!enableCreateProject}
                >
                  Create
                </CommonButton>
              </Grid>
            </Grid>
          </Grid>
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
              <CommonTextBox
                label="Project ID"
                name="projectId"
                value={projectIdToJoin}
                onChange={handleProjectIdToJoin}
              />
              <Grid
                item
                justifyContent="center"
                display="flex"
                style={{ marginTop: "24px" }}
              >
                <CommonButton
                  onClick={handleJoinProject}
                  disabled={!enableJoinProject}
                >
                  Join
                </CommonButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
