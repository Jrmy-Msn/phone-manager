import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { frFR } from '@mui/material/locale'
import App from './components/App/App'
import reportWebVitals from './reportWebVitals'

import './styles/global.scss'

const theme = createTheme(
  {
    palette: {
      // primary: { main: '#ff0000' },
    },
  },
  frFR,
)

ReactDOM.render(
  <Router>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Router>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
