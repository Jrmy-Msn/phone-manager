import React from "react"
import ReactDOM from "react-dom"
import CloseIcon from "@mui/icons-material/Close"
import { Box, Button } from "@mui/material"

function Notification({ message }) {

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "noWrap",
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span>{message}</span>
      <CloseIcon
        sx={{ cursor: "pointer", color: "muted" }}
        onClick={() => { this.props.closeSnackbar(key) }}
      />
    </Box>
  )
}

export default Notification
