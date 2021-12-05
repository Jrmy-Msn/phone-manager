import axios from "axios"
import {
  Alert,
  Box,
  Typography,
  LinearProgress,
  Snackbar,
  Tab,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Autocomplete,
  TextField,
  InputAdornment,
} from "@mui/material"
import { createFilterOptions } from "@mui/material/Autocomplete"
import { TabContext, TabList, TabPanel } from "@mui/lab"
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled"
import DnsIcon from "@mui/icons-material/Dns"
import PhoneIcon from "@mui/icons-material/Phone"
import { DataGrid, GridToolbar, GridOverlay } from "@mui/x-data-grid"
import React, { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import HeaderBar from "../HeaderBar/HeaderBar"
import { DistributionRow } from "./DistributionRoom"
import { GRID_FR_LOCALE_TEXT } from "./GridLocaleText"
import { PHONE_COLUMNS_DESCRIPTION } from "./PhoneColumnsDescription"
import "./Site.scss"

function Site({
  label,
  auth = false,
  admin = false,
  routes = {},
  activeTab = "phone",
}) {
  const [phones, setPhones] = useState([])
  const [distributions, setDistributions] = useState([])
  const [distributionHeadBandOpen, setDistributionHeadBandOpen] = useState()
  const [tab, setTab] = useState(activeTab)
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
   * Ouvre le panneau du bandeau cliqué et ferme celui qui était ouvert
   * Si celui ouvert est le bandeau cliqué, c'est celui-ci qui se ferme,
   * ce qui a pour action d'avoir tous les bandeaux fermés
   */
  const handleDistributionHeadBandOpenClick = (distributionId, headBandId) => {
    if (
      distributionHeadBandOpen &&
      headBandId === distributionHeadBandOpen.headBandId
    ) {
      setDistributionHeadBandOpen(undefined)
    } else {
      setDistributionHeadBandOpen({ distributionId, headBandId })
    }
  }

  const handleDistributionEditCommit = (event) => {
    console.log(event)
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
    let columns = [],
      rows = []

    switch (tab) {
      case "phone":
        columns = PHONE_COLUMNS_DESCRIPTION

        rows =
          phones.length === 0
            ? []
            : phones.map((phone) => {
                return {
                  id: phone.id,
                  number: phone.number,
                  type: phone.type,
                  assignedTo: phone.assignedTo,
                  location: phone.location,
                  cluster: phone.cluster,
                  clusterCard: phone.clusterCard,
                  clusterChannel: phone.clusterChannel,
                  reserved: phone.reserved,
                }
              })
        break
      case "distribution":
        if (!distributionHeadBandOpen) return
        const distribution = distributions.find(
          (distribution) =>
            distribution.id === distributionHeadBandOpen.distributionId
        )

        if (!distribution) return

        const headBand = distribution.headBands.find(
          (headBand) => headBand.id === distributionHeadBandOpen.headBandId
        )

        if (!headBand) return

        columns = headBand.connectors.map((connector) => {
          return {
            field: String(connector.number),
            type: "string",
            editable: true,
            filterable: false,
            sortable: false,
            headerAlign: "center",
            renderCell: (params) => {
              return (
                <span>
                  <strong>{params.value ? params.value.type[0] : ""}.</strong>
                  {params.value ? params.value.number : ""}
                </span>
              )
            },
            renderEditCell: (params) => {
              return (
                <Autocomplete
                  fullWidth
                  size="small"
                  defaultValue={params.value}
                  noOptionsText="Aucun n°"
                  options={phones}
                  getOptionLabel={(option) => `${option.number}`}
                  filterOptions={(options, state) => {
                    return options.filter((option) =>
                      `${option.type[0]}.${option.number}`.includes(
                        state.inputValue
                      )
                    )
                  }}
                  renderOption={(props, option) => (
                    <Box component="span" {...props}>
                      <strong>{option.type[0]}</strong>.{option.number}
                    </Box>
                  )}
                  renderInput={(props) => (
                    <TextField {...props} label="N°" variant="standard" />
                  )}
                />
              )
            },
            preProcessEditCellProps: (params) => {
              const isValid =
                params.props.value && params.props.value.number >= 1000
              return { ...params.props, error: !isValid }
            },
            align: "center",
            width: 120,
          }
        })

        const row = {}
        headBand.connectors.forEach((connector) => {
          const phone = phones.find(
            (phone) => phone.connector && phone.connector.id === connector.id
          )
          row.id = connector.id
          row[connector.number] = phone ? phone : null
        })
        rows = [row]
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
    ;(async function fetchData() {
      await getDistributions()
    })()
  }, [])

  // --> A chaque fois que la liste des postes change
  // Mise à jour du tableau
  useEffect(() => {
    constructGrid()
  }, [tab, distributionHeadBandOpen, phones, distributions])

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
      <HeaderBar auth={auth} admin={admin} routes={routes} />
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
                component={NavLink}
                to={routes.timone_phone}
                icon={<PhoneIcon />}
                iconPosition="start"
                label="Les postes"
                value="phone"
              />
              <Tab
                component={NavLink}
                to={routes.timone_distribution}
                icon={<DnsIcon />}
                iconPosition="start"
                label="Les Redistributeurs"
                value="distribution"
              />
            </TabList>
          </Box>
          <TabPanel sx={{ px: 0 }} value="phone">
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
          <TabPanel sx={{ px: 0 }} value="distribution">
            <Box
              sx={{
                display: "flex",
              }}
            >
              <div style={{ flexGrow: 1 }}>
                <TableContainer component={Paper}>
                  <Table aria-label="collapsible table">
                    <TableBody>
                      {distributions.map((distrib) =>
                        distrib.headBands.map((headBand) => (
                          <DistributionRow
                            key={`${distrib.id}_${headBand.id}`}
                            distribution={distrib}
                            headBand={headBand}
                            grid={grid}
                            open={
                              distributionHeadBandOpen &&
                              distributionHeadBandOpen.headBandId ===
                                headBand.id
                            }
                            onOpenCLick={handleDistributionHeadBandOpenClick}
                            onCellEditCommit={handleDistributionEditCommit}
                          />
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  )
}

export default Site
