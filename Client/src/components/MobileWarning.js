import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";

const MobileWarning = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 2,
        textAlign: "center",
        minHeight: "100vh",
      }}
    >
      <Stack spacing={3} alignItems="center">
        <SmartphoneIcon
          sx={{ fontSize: 64, color: "error.main", transform: "rotate(45deg)" }}
        />
        <Typography variant="h4" fontWeight="bold">
          Mobile Access Not Allowed
        </Typography>
        <Typography color="text.secondary">
          This application is designed for laptop and desktop viewing only.
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" color="primary.main">
          <LaptopMacIcon sx={{ fontSize: 20 }} />
          <Typography>Please visit from your laptop</Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default MobileWarning;
