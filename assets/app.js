import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import { ThemeProvider } from "@mui/material/styles"
import CloseIcon from "@mui/icons-material/Close"
import { SnackbarProvider } from "notistack"
import App from "./components/App/App"
import AppTheme from "./AppTheme"
import reportWebVitals from "./reportWebVitals"

import "./styles/global.scss"

const notistackRef = React.createRef()
const onClickDismiss = (key) => () => {
  notistackRef.current.closeSnackbar(key)
}

ReactDOM.render(
  <Router>
    <ThemeProvider theme={AppTheme}>
      <SnackbarProvider
        sx={{
          "& .SnackbarItem-message": {
            maxWidth: 5 / 6,
          },
          "& .SnackbarItem-variantSuccess": {
            backgroundColor: AppTheme.palette.success.main,
          },
          "& .SnackbarItem-variantError": {
            backgroundColor: AppTheme.palette.error.main,
          },
          "& .SnackbarItem-variantWarning": {
            backgroundColor: AppTheme.palette.warning.main,
          },
          "& .SnackbarItem-variantInfo": {
            backgroundColor: AppTheme.palette.info.main,
          },
        }}
        maxSnack={5}
        autoHideDuration={1000000}
        ref={notistackRef}
        action={(key) => (
          <CloseIcon
            sx={{ cursor: "pointer", color: "muted" }}
            onClick={onClickDismiss(key)}
          />
        )}
      >
        <App />
      </SnackbarProvider>
    </ThemeProvider>
  </Router>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
