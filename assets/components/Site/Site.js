import axios from 'axios'
import {CardActions, CardContent, Card, Alert, Box, Backdrop, Button, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React, {useEffect, useState} from 'react'
import HeaderBar from '../HeaderBar/HeaderBar'
import './Site.scss'

function Site({label, auth = false, admin = false, routes = {}}) {
  const [phones, setPhones] = useState([])

  async function getPhones() {
  try {
    const response = await axios.get(routes.timone_list)
    setPhones(response.data)
  } catch (error) {
    console.error(error)
  }
}

  // Récupération des numéros de poste
  useEffect(() => {
    (async function fetchData() {
      await getPhones()
    })()
  }, [])


  const columns = [
    { field: 'number', type: 'unmber', headerName: 'N° de poste', width: 120 },
    { field: 'reserved', type: 'boolean', headerName: 'Réservé ?', width: 100 },
    { field: 'cluster', type: 'number', headerName: 'Grappe', width: 80 },
    { field: 'clusterCard', type: 'number', headerName: 'G. Carte', width: 80 },
    { field: 'clusterChannel', type: 'number', headerName: 'G. Voie', width: 80 },
    { field: 'distribution', headerName: 'Distribution', width: 80 },
    { field: 'distributionCard', headerName: 'D. Carte', width: 80 },
    { field: 'distributionChannel', headerName: 'D. Voie', width: 80 },
  ]

  console.log(phones)
  const rows = phones.length === 0 
  ? undefined 
  : phones.map((phone) => {
    return { 
      id: phone.id, 
      number: phone.number,
      cluster: phone.cluster, 
      clusterCard: phone.clusterCard, 
      clusterChannel: phone.clusterChannel, 
      reserved: phone.reserved, 
    }
  })


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
            display: 'flex',
          }}
        >
          {
            (rows) 
            ? (
              <div style={{ flexGrow: 1 }}>
                <DataGrid 
                  rows={rows} 
                  columns={columns} 
                  autoHeight
                />
              </div>
            )
            : <Typography variant="h6">Aucune donnée</Typography>
          }
        </Box>
      </Box>
    </Box>
  )
}

export default Site
