import axios from "axios"
import {
  Alert,
  Box,
  Typography,
  LinearProgress,
  Snackbar,
  Tab,
} from "@mui/material"
import { TabContext, TabList, TabPanel } from "@mui/lab"
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled"
import { DataGrid, GridToolbar, GridOverlay } from "@mui/x-data-grid"
import React, { useEffect, useState } from "react"
import HeaderBar from "../HeaderBar/HeaderBar"
import { GRID_FR_LOCALE_TEXT } from "./GridLocaleText"
import "./Site.scss"
import { Dns, Phone } from "@mui/icons-material"

function Site({ label, auth = false, admin = false, routes = {} }) {
  const [phones, setPhones] = useState([])
  const [distributions, setDistributions] = useState([])
  const [tab, setTab] = useState("1")
  const [grid, setGrid] = useState({
    columns: [],
    rows: [],
  })
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [loading, setLoadState] = useState(true)

  /**
   * Met à jour l'affichage du panneau en fonction de l'onglet sélectionné
   */
  const handleTabChange = (event, newTab) => {
    setTab(newTab)
  }

  /**
   * Met à jour à l'affichage le poste qui à pour id "id" avec les données fournies "data"
   */
  const handlePhoneChange = (id, data) => {
    setPhones(phones.map((v) => (v.id === id ? data : v)))
  }

  /**
   * Met en forme les éventuelles erreurs lié à la modification d'un poste
   */
  const handlePhoneChangeError = (errors) => {
    let message = (
      <ul>
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    )

    setErrorMessage(message)
  }

  /**
   * Récupère la liste des numéros de tous les postes depuis le serveur
   * Après que les données est été chargées, l'indicateur de chargement est retiré
   * En cas d'erreur on affcihe une notification d'erreur (TODO)
   */
  const getPhones = async () => {
    try {
      const response = await axios.get(routes.timone_phone_list)
      setPhones(response.data)
    } catch (error) {
      setErrorMessage(
        error.response ? error.response.data.message : error.message
      )
    } finally {
      setLoadState(false)
    }
  }

  /**
   * Récupère la liste de tous les redistributeurs depuis le serveur
   * Après que les données est été chargées, l'indicateur de chargement est retiré
   * En cas d'erreur on affcihe une notification d'erreur
   */
  const getDistributions = async () => {
    try {
      const response = await axios.get(routes.timone_distribution_list)
      setDistributions(response.data)
    } catch (error) {
      setErrorMessage(
        error.response ? error.response.data.message : error.message
      )
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
  const updatePhone = async (event) => {
    const formData = new FormData()
    const cell = phones.find((v) => v.id === event.id)
    try {
      for (const [key, value] of Object.entries(cell)) {
        if (!grid.columns.find((v) => v.field === key)) continue
        const formField = `phone[${key === event.field ? event.field : key}]`
        const formValue = key === event.field ? event.value : value
        formField &&
          formValue &&
          ((key === event.field && event.value) || key !== event.field) &&
          formData.append(formField, formValue)
      }
      const { data } = await axios.post(
        `${routes.timone_phone_update}/${cell.id}`,
        formData
      )
      handlePhoneChange(data.id, data)
      setSuccessMessage(`N° ${data.number} mis à jour`)
    } catch (error) {
      if (error.response && error.response.data) {
        handlePhoneChangeError(error.response.data)
      } else if (error) {
        handlePhoneChangeError(error.message)
      }
      handlePhoneChange(event.id, cell)
    } finally {
    }
  }

  /**
   * Construit la grille de donnée en fonction de celle que l'on souhaite afficher (onglet...)
   */
  const constructGrid = () => {
    let columns, rows
    switch (tab) {
      case "1":
        columns = [
          {
            field: "number",
            sortable: true,
            type: "unmber",
            headerName: "N° de poste",
            width: 120,
          },
          {
            field: "reserved",
            editable: true,
            type: "boolean",
            headerName: "Réservé ?",
            width: 100,
          },
          {
            field: "cluster",
            editable: true,
            filterable: false,
            type: "number",
            headerName: "Grappe",
            width: 80,
          },
          {
            field: "clusterCard",
            editable: true,
            filterable: false,
            type: "number",
            headerName: "G. Carte",
            width: 80,
          },
          {
            field: "clusterChannel",
            editable: true,
            filterable: false,
            type: "number",
            headerName: "G. Voie",
            width: 80,
          },
          {
            field: "distribution",
            editable: true,
            filterable: false,
            headerName: "Distribution",
            width: 80,
          },
          {
            field: "distributionCard",
            editable: true,
            filterable: false,
            type: "number",
            headerName: "D. Carte",
            width: 80,
          },
          {
            field: "distributionChannel",
            editable: true,
            filterable: false,
            type: "number",
            headerName: "D. Voie",
            width: 80,
          },
        ]
        rows =
          phones.length === 0
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
        break
      case "2":
        break
    }
    setGrid({ columns, rows })
  }

  // --> Seulement au chargement de la page
  // Récupération des numéros de poste
  useEffect(() => {
    ;(async function fetchData() {
      await getPhones()
    })()
  }, [])

  // --> A chaque fois que la liste des postes change
  // Mise à jour du tableau
  useEffect(() => {
    constructGrid()
  }, [phones])

  const CustomLoadingOverlay = () => {
    return (
      <GridOverlay>
        <div style={{ position: "absolute", top: 0, width: "100%" }}>
          <LinearProgress />
        </div>
      </GridOverlay>
    )
  }

  const CustomNoRowsOverlay = () => {
    return (
      <GridOverlay sx={{ display: "flex", flexDirection: "column" }}>
        <PhoneDisabledIcon sx={{ fontSize: "3rem" }} color="disabled" />
        <Typography component="em">Aucun poste</Typography>
      </GridOverlay>
    )
  }

  return (
    <Box
      className={`Site`}
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <HeaderBar auth={auth} admin={admin} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          padding: 2,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{ mb: 2, fontWeight: "500" }}
        >
          Gestion du site : {label}
        </Typography>
        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : ""}
        {successMessage ? (
          <Snackbar
            open
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            autoHideDuration={5000}
            onClose={(event, reason) => setSuccessMessage("")}
          >
            <Alert severity="success" sx={{}}>
              {successMessage}
            </Alert>
          </Snackbar>
        ) : (
          ""
        )}
        <TabContext value={tab}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleTabChange}>
              <Tab
                icon={<Phone />}
                iconPosition="start"
                label="Les postes"
                value="1"
              />
              <Tab
                icon={<Dns />}
                iconPosition="start"
                label="Les Redistributeurs"
                value="2"
              />
            </TabList>
          </Box>
          <TabPanel sx={{ px: 0 }} value="1">
            <Box
              sx={{
                display: "flex",
              }}
            >
              <div style={{ flexGrow: 1 }}>
                <DataGrid
                  loading={loading}
                  rows={grid.rows}
                  columns={grid.columns}
                  disableSelectionOnClick
                  autoHeight
                  onCellEditCommit={updatePhone}
                  localeText={GRID_FR_LOCALE_TEXT}
                  components={{
                    LoadingOverlay: CustomLoadingOverlay,
                    Toolbar: GridToolbar,
                    NoRowsOverlay: CustomNoRowsOverlay,
                  }}
                />
              </div>
            </Box>
          </TabPanel>
          <TabPanel sx={{ px: 0 }} value="2"></TabPanel>
        </TabContext>
      </Box>
    </Box>
  )
}

export default Site
