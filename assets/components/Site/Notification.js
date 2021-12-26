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
      {Array.isArray(message) ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {message.map((m, i) => {
            if (i === 0)
              return <u key={i} dangerouslySetInnerHTML={{ __html: m }}></u>
            return <span key={i} dangerouslySetInnerHTML={{ __html: m }} />
          })}
        </Box>
      ) : (
        <span dangerouslySetInnerHTML={{ __html: message }} />
      )}
    </Box>
  )
}

export default Notification
