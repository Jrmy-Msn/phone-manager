import { Visibility, VisibilityOff } from "@mui/icons-material"
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material"
import React, { useEffect, useState } from "react"
import HeaderBar from "../HeaderBar/HeaderBar"
import "./Login.scss"

function Login({ auth = false, admin = false }) {
  const [errorMessage, setErrorMessage] = useState(undefined)
  const [lastUserName, setLastUsername] = useState("")
  const [csrf, setCsrf] = useState("")
  const [showPassword, setPasswordVisibility] = useState(false)
  const [loginValues, setLoginValues] = useState({
    username: "",
    password: "",
  })

  useEffect(() => {
    const rootElement = document.querySelector("#root")
    setLastUsername(rootElement.dataset.loginLastUsername)
    setCsrf(rootElement.dataset.loginCsrf)
    setErrorMessage(rootElement.dataset.loginError)
  })

  const handleLoginValuesChange = (prop) => (event) => {
    setLoginValues({ ...loginValues, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setPasswordVisibility(!showPassword)
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <HeaderBar auth={auth} admin={admin} noActions />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            minWidth: "60vw",
            mx: "auto",
            my: 2,
            p: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            bgcolor: "background.paper",
            boxShadow: 2,
          }}
          component="form"
          autoComplete="off"
          method="post"
        >
          <Typography
            variant="h4"
            align="left"
            color="primary"
            sx={{
              mb: 2,
              fontWeight: "500",
            }}
          >
            Authentification
          </Typography>
          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : ""}
          <FormControl sx={{ my: 2 }} variant="outlined" required>
            <InputLabel htmlFor="login_username">Nom utilisateur</InputLabel>
            <OutlinedInput
              id="login_username"
              name="username"
              autoFocus
              value={loginValues.username || lastUserName}
              onChange={handleLoginValuesChange("username")}
              label="Nom d'utilisateur"
              aria-describedby="login_username_helper"
            />
            <FormHelperText id="login_username_helper">
              Saisir votre prenom.nom
            </FormHelperText>
          </FormControl>
          <FormControl sx={{ my: 2 }} variant="outlined" required>
            <InputLabel htmlFor="login_password">Mot de passe</InputLabel>
            <OutlinedInput
              id="login_password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={loginValues.password}
              onChange={handleLoginValuesChange("password")}
              label="Mot de passe"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Change la visibility du mot de passe"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <TextField
            sx={{ display: "none" }}
            name="_csrf_token"
            type="hidden"
            value={csrf}
          />
          <Button
            sx={{ my: 4, flexShrink: 1 }}
            variant="contained"
            type="submit"
          >
            S'authentifier
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default Login
