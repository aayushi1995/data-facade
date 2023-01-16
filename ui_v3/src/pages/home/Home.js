import React from "react";
import { Avatar, Grid, Typography } from "@mui/material";
import LoginButton from "./components/Login";
import useHomeStyles from "./../../css/home/Home";
import { DataFacadeLogo } from "../../common/components/sideBar/DataFacadeLogo";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";

import useLogin from "../../hooks/useLogin";

const Home = () => {
  const classes = useHomeStyles();
  const user = JSON.parse(localStorage.getItem("user"));
  const { handleLogin } = useLogin()
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          left: 10,
          right: 0,
          top: 10,
          bottom: 0,
        }}
        justifyContent="flex-start"
      >
        <Link to="/">
          <Box sx={{ height: "50px", width: "auto", display: "flex" }}>
            <DataFacadeLogo />
          </Box>
        </Link>
      </Box>
      <Grid container spacing={0} className={classes.welcome_header}>
        <Grid
          xs={12}
          item
          container
          justifyContent="center"
          alignItems="center"
        >
          <div>
            <Typography variant="h5" style={{ fontWeight: 800 }}>
              Login
            </Typography>
            <Typography variant="subtitle1" className={classes.linkText}>
              Please login to access your organisation
            </Typography>
            {user && user.name && (
              <Grid
                container
                spacing={2}
                sx={{ mt: 2 }}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={2}>
                  <Avatar alt={user.name} src={user.picture} />
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
                    Welcome back , {user.name}
                  </Typography>
                </Grid>
              </Grid>
            )}

            <Grid
              container
              spacing={2}
              sx={{ mt: 3, mb: 5 }}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={8}>
                <Typography variant="h6">
                  <a
                    href="#"
                    onClick={() => {
                      localStorage.removeItem('user')
                      handleLogin()
                    }}
                  >
                    Login to a different account
                  </a>
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <LoginButton />
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
