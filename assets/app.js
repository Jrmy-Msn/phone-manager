import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import CloseIcon from "@mui/icons-material/Close"
import { SnackbarProvider } from "notistack"
import { frFR } from "@mui/material/locale"
import App from "./components/App/App"
import reportWebVitals from "./reportWebVitals"

import "./styles/global.scss"

const theme = createTheme(
  {
    palette: {
      // primary: { main: '#ff0000' },
      muted: "rgba(0, 0, 0, 0.54);",
    },
  },
  frFR
)

const notistackRef = React.createRef()
const onClickDismiss = (key) => () => {
  notistackRef.current.closeSnackbar(key)
}

ReactDOM.render(
  <Router>
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        sx={{
          '& .SnackbarItem-message': {
            width: 1/1
          }
        }}
        maxSnack={5}
        autoHideDuration={500000}
        ref={notistackRef}
        // action={(key) => (
        //   <CloseIcon
        //     sx={{ cursor: "pointer", color: "muted" }}
        //     onClick={onClickDismiss(key)}
        //   />
        // )}
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
