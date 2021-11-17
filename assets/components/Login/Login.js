import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Button, FormControl, FormHelperText, IconButton, Input, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material'
import { Box } from '@mui/system'
import React, {useEffect, useState} from 'react'
import HeaderBar from '../HeaderBar/HeaderBar'
import './Login.scss'

function Login() {
  const [lastUserName, setLastUsername] = useState('')
  const [csrf, setCsrf] = useState('')
  const [showPassword, setPasswordVisibility] = useState(false)
  const [loginValues, setLoginValues] = useState({
    username: '',
    password: ''
  })

  useEffect(() => {
      const rootElement = document.querySelector('#root')
      setLastUsername(rootElement.dataset.loginLastUsername)
      console.log(rootElement.dataset.loginError)
      setCsrf(rootElement.dataset.loginCsrf)
  })

  const handleChange = (prop) => (event) => {
    setLoginValues({ ...loginValues, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setPasswordVisibility(!showPassword)
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <HeaderBar noActions/>
      
      <Box 
        component="form"
        autoComplete="off"
        method="post"
      >
        <div>
          <FormControl 
            variant="outlined"
            required
            fullWidth
          >
            <InputLabel htmlFor="login_username">Nom utilisateur</InputLabel>
            <OutlinedInput
              id="login_username"
              name="username"
              autoFocus
              value={loginValues.username || lastUserName} 
              onChange={handleChange('username')} 
              label="Nom utilisateur"
              aria-describedby="login_username_helper"
            />
            <FormHelperText id="login_username_helper">Saisir votre prenom.nom</FormHelperText>
          </FormControl>
        </div>
        <div>
          <FormControl 
            variant="outlined"
            required
            fullWidth
          >
            <InputLabel htmlFor="login_password">Mot de passe</InputLabel>
            <OutlinedInput
              id="login_password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={loginValues.password}
              onChange={handleChange('password')}
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
        </div>
        <div>
          <TextField
            name="_csrf_token"
            type="hidden"
            value={csrf}
          />
          <Button 
            variant="contained"
            type="submit"
          >
          Authentification</Button>
        </div>
      </Box>
    </div>
  )
}

export default Login
