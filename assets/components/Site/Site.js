import axios from 'axios'
import {CardActions, CardContent, Card, Alert, Box, Backdrop, Button, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography, LinearProgress } from '@mui/material'
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled'
import { DataGrid, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarExport, GridOverlay } from '@mui/x-data-grid'
import React, {useEffect, useState} from 'react'
import HeaderBar from '../HeaderBar/HeaderBar'
import './Site.scss'

function Site({label, auth = false, admin = false, routes = {}}) {
  const [phones, setPhones] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoadState] = useState(true)

  /**
   * Met à jour à l'affichage le poste qui à pour id "id" avec les données fournies "data"
   */
  function handlePhoneChange(id, data) {
    setPhones(phones.map(v => v.id === id ? data : v))
  }

  /**
   * Met en forme les éventuelles erreurs lié à la modification d'un poste
   */
  function handlePhoneChangeError(errors) {
    let message = (
      <ul>
        {
          errors.map((error, index) => (<li key={index}>{error}</li>))
        }
      </ul>
    )
    
    setErrorMessage(message)
  }

  /**
   * Récupère la liste des numéros de tous les postes depuis le serveur
   * Après que les données est été chargées, l'indicateur de chargement est retiré
   * En cas d'erreur on affcihe une notification d'erreur (TODO)
   */
  async function getPhones() {
    try { 
      const response = await axios.get(routes.timone_list)
      setPhones(response.data)
    } catch (error) {
      setErrorMessage(error.response ? error.response.data.message : error.message)
    } finally {
      setLoadState(false)
    }
  }

  /**
   * Met à jour un poste 
   * Toutes les données pour un poste sont récupérées et transformées en données de formulaire
   * puis envoyées au serveur pour mise à jour de la base de donnée
   * En retour, ce qui est enregistré en base de donnée est retourné est utilisé pour faire correspondre la donnée en base de donnée
   * et ce qui est affiché
   * En cas d'erreur une notification est affichée, et les modifications sont annulées
   */
  async function updatePhone(event) {
    try {
      const formData = new FormData()
      for (const [ key, value ] of Object.entries(event.row)) {
        if (key === 'id') continue
        const field = `phone[${(key === event.field) ? event.field : key}]`
        field 
        && (key === event.field && event.value || key !== event.field)
        && formData.append(field, (key === event.field) ? event.value : value)
      }
      const {data} = await axios.post(`${routes.timone_update}/${event.row.id}`, formData)
      handlePhoneChange(data.id, data)
      setPhones(phones.map(v => v.id === data.id ? data : v))
    } catch (error) {
      if (error.response && error.response.data) handlePhoneChangeError(error.response.data)
      handlePhoneChange(event.id, event.row)
      setPhones(phones.map(v => v.id === event.id ? event.row : v))
    } finally {
    }
  }

  // --> Seulement au chargement de la page 
  // Récupération des numéros de poste
  useEffect(() => {
    (async function fetchData() {
      await getPhones()
    })()
  }, [])

  const columns = [
    { 
      field: 'number',
      sortable: true,
      type: 'unmber', 
      headerName: 'N° de poste', 
      width: 120 
    },
    { 
      field: 'reserved', 
      editable: true,
      type: 'boolean', 
      headerName: 'Réservé ?', 
      width: 100 
    },
    { 
      field: 'cluster', 
      editable: true,
      filterable: false, 
      type: 'number', 
      headerName: 'Grappe', 
      width: 80 
    },
    { 
      field: 'clusterCard', 
      editable: true,
      filterable: false, 
      type: 'number', 
      headerName: 'G. Carte', 
      width: 80 
    },
    { 
      field: 'clusterChannel', 
      editable: true,
      filterable: false, 
      type: 'number', 
      headerName: 'G. Voie', 
      width: 80 
    },
    { 
      field: 'distribution',  
      editable: true,
      filterable: false,
      headerName: 'Distribution', 
      width: 80 
    },
    { 
      field: 'distributionCard', 
      editable: true,
      filterable: false, 
      type: 'number',
      headerName: 'D. Carte', 
      width: 80 
    },
    { 
      field: 'distributionChannel', 
      editable: true,
      filterable: false, 
      type: 'number',
      headerName: 'D. Voie', 
      width: 80 
    },
  ]

  const rows = phones.length === 0 
  ? [] 
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

  function CustomLoadingOverlay() {
    return (
      <GridOverlay>
        <div style={{ position: 'absolute', top: 0, width: '100%' }}>
          <LinearProgress />
        </div>
      </GridOverlay>
    )
  }

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  function CustomNoRowsOverlay() {
    return (
      <GridOverlay sx={{display: 'flex', flexDirection: 'column'}}>
        <PhoneDisabledIcon sx={{fontSize: '3rem'}} color='disabled' />
        <Typography component="em">Aucun poste</Typography>
      </GridOverlay>
    );
  }

  return (
    <Box 
       className={`Site`}
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
        { 
          (errorMessage) ? <Alert severity="error">{errorMessage}</Alert> : ''
        }
        <Box
          sx={{
            display: 'flex',
          }}
        >
          <div style={{ flexGrow: 1 }}>
            <DataGrid 
              loading={loading}
              rows={rows} 
              columns={columns} 
              disableSelectionOnClick
              autoHeight
              onCellEditCommit={updatePhone}
              components={{
                LoadingOverlay: CustomLoadingOverlay,
                Toolbar: CustomToolbar,
                NoRowsOverlay: CustomNoRowsOverlay,
              }}
            />
          </div>
        </Box>
      </Box>
    </Box>
  )
}

export default Site
