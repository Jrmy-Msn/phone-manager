import React from "react"
import ReactDOM from "react-dom"
import CloseIcon from "@mui/icons-material/Close"
import { Box, Button } from "@mui/material"

function Notification({ message, notice }) {
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          "& .notification-operation": {
            fontWeight: "bold",
            color: notice ? "#000" : "inherit",
          },
          "& .notification-notice": {
            mt: 1,
          },
        }}
      >
        {Array.isArray(message) ? (
          message.map((m, i) => {
            if (i === 0)
              return <u key={i} dangerouslySetInnerHTML={{ __html: m }}></u>
            return (
              <span
                className="notification-operation"
                key={i}
                dangerouslySetInnerHTML={{ __html: m }}
              />
            )
          })
        ) : (
          <span dangerouslySetInnerHTML={{ __html: message }} />
        )}

        {notice ? (
          <small
            className="notification-notice"
            dangerouslySetInnerHTML={{ __html: notice }}
          ></small>
        ) : (
          ""
        )}
      </Box>
    </Box>
  )
}

export default Notification
