import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Box, Divider, Popover, Typography, Button } from "@mui/material";
import React, { useRef, useState } from "react";
import Logout from "../../../pages/home/components/Logout";
import { useAppBarProps } from "./DataFacadeAppBar";
import { ThemeToggle } from "./ThemeToggle";

const buttonStyle = {
  background: "rgba(231, 247, 255, 0.5)",
  opacity: 0.64,
  border: "none",
  boxShadow:
    "0px 2px 6px rgba(8, 35, 48, 0.16), 0px 1px 2px rgba(8, 35, 48, 0.24)",
  color: "#fff",
};

const AccountPopover = () => {
  const anchorRef = useRef(null);
  const { appcontext, setSearchQuery } = useAppBarProps();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    appcontext && (
      <>
        <Button
          onClick={handleOpen}
          ref={anchorRef}
          variant="outlined"
          sx={buttonStyle}
          endIcon={<ArrowDropDownIcon />}
        >
          {appcontext.workspaceName}
        </Button>

        <Popover
          anchorEl={anchorRef.current}
          anchorOrigin={{
            horizontal: "center",
            vertical: "bottom",
          }}
          keepMounted
          onClose={handleClose}
          open={open}
          PaperProps={{
            sx: { width: 240 },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
            <Box>
              <Typography color="textPrimary" variant="subtitle2">
                {appcontext.userName}
              </Typography>
              <Typography color="textSecondary" variant="subtitle2">
                {appcontext.workspaceName}
              </Typography>
              {/* <ThemeToggle/> */}
            </Box>
            <Divider />
            <Box>
              <Logout />
            </Box>
          </Box>
        </Popover>
      </>
    )
  );
};

export default AccountPopover;
