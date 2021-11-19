import {CardActions, CardContent, Card, Alert, Box, Backdrop, Button, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material'
import React, {useEffect, useState} from 'react'
import HeaderBar from '../HeaderBar/HeaderBar'
import './Site.scss'

function Home({label, auth = false, admin = false, routes = {}}) {

  return (
    <Box 
      sx={{
        height: '100vh', 
        display: 'flex', flexDirection:'column'
      }}
    >
      <HeaderBar auth={auth} admin={admin} />
      <Box 
        sx={{
          display: 'flex', flexDirection:'column', 
          height: '100vh',
          padding: 2
        }}
      >
        <Typography
          variant='h4'
          align='center'
          sx={{mb: 2, fontWeight: '500'}}
        >Gestion du site : {label}</Typography>
        <Box
          sx={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', jutifyContent: 'center'
          }}
        >
          
        </Box>
      </Box>
    </Box>
  )
}

export default Home
