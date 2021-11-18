import {CardActions, CardContent, Card, Alert, Box, Backdrop, Button, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material'
import React, {useEffect, useState} from 'react'
import HeaderBar from '../HeaderBar/HeaderBar'
import './Home.scss'

function Home({auth = false, admin = false, routes = {}}) {

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
        {
          (auth) 
          ? (
            <Backdrop
              sx={{ top: '65px', color: '#fff', zIndex: 1000 }}
              open={true}
            ></Backdrop>
          )
          : ''
        }
        <Typography
          variant='h4'
          align='center'
          sx={{mb: 2, fontWeight: '500'}}
        >CHOIX DU SITE</Typography>
        <Box
          sx={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', jutifyContent: 'center'
          }}
        >
          <Card 
            id='home_site_timone'
            sx={{ 
              minWidth: '33.33333vw',
              '&:hover': {
                boxShadow: 5,
                cursor: 'pointer'
              }
            }}
            onClick={event => window.location.href = routes.timone}
          >
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Site région
              </Typography>
              <Typography variant="h5" component="div">
                Caserne La Timone
              </Typography>
              <Typography component="em" variant="caption" sx={{ mb: 1.5 }} color="text.secondary">
                anciennement Hetzel
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  )
}

export default Home
