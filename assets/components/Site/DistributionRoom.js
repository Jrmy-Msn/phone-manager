import axios from "axios"
import React, { useEffect, useState } from "react"
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Collapse,
  IconButton,
  Autocomplete,
  TextField,
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { GRID_FR_LOCALE_TEXT } from "./GridLocaleText"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"

function DistributionRow({
  distribution,
  headBand,
  grid,
  open,
  onOpenCLick,
  onCellEditStart,
  onCellEditCommit,
  onCellEditStop,
}) {
  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            size="small"
            onClick={() => onOpenCLick(distribution.id, headBand.id)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Typography
            sx={{ fontWeight: "bold", fontSize: "1rem" }}
            variant="overline"
            gutterBottom
            component="span"
          >
            {distribution.label} &mdash; {headBand.label}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <DataGrid
                rows={grid.rows || []}
                columns={grid.columns || []}
                disableSelectionOnClick
                disableColumnMenu
                disableColumnSelector
                autoHeight
                hideFooter
                onCellEditStart={(event) => onCellEditStart(event)}
                onCellEditCommit={(event) => onCellEditCommit(event)}
                onCellEditStop={(event) => onCellEditStop(event)}
                localeText={GRID_FR_LOCALE_TEXT}
                components={
                  {
                    //   LoadingOverlay: CustomLoadingOverlay,
                    //   Toolbar: GridToolbar,
                    //   NoRowsOverlay: CustomNoRowsOverlay,
                  }
                }
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

function DistributionRoom({ tab, phones, distributions }) {
  const [distributionHeadBandOpen, setDistributionHeadBandOpen] = useState()
  const [grid, setGrid] = useState({
    columns: [],
    rows: [],
  })

  /**
   * Renvoi le bandeau qui est entrain d'être visualisé ou modifié.
   */
  const getCurrentDistributionHeadBand = () => {
    if (!distributionHeadBandOpen) return

    const distribution = distributions.find(
      (distribution) =>
        distribution.id === distributionHeadBandOpen.distributionId
    )

    if (!distribution) return

    const headBand = distribution.headBands.find(
      (headBand) => headBand.id === distributionHeadBandOpen.headBandId
    )

    return headBand
  }

  /**
   * Construit la grille de donnée en fonction de celle que l'on souhaite afficher (onglet...)
   */
  const constructGrid = () => {
    let columns = [],
      rows = []
    const headBand = getCurrentDistributionHeadBand()

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
              value={params.value}
              noOptionsText="Aucun n°"
              options={phones}
              onChange={(event, newValue) => {
                params.api.setEditCellValue(
                  {
                    id: params.id,
                    field: params.field,
                    value: newValue,
                  },
                  event
                )
              }}
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
    setGrid({ columns, rows })
  }

  /**
   * Met à jour un bandeau d'un redistributeur.
   * L'ancien numéro de poste est modifié par le nouveau sur le connecteur sélectionné (mise à jour en BDD).
   * Le nouveau numéro de poste est alors "débranché" de son ancien connecteur (mise à jour en BDD).
   * En retour, ce qui est enregistré en base de donnée est retourné est utilisé pour faire correspondre la donnée en base de donnée
   * et ce qui est affiché.
   * En cas d'erreur une notification est affichée, et les modifications sont annulées.
   */
  const updateDistribution = async (event) => {
    const formData = new FormData()
    try {
      const headBand = getCurrentDistributionHeadBand()
      if (!headBand)
        throw new Error("Aucun bandeau n'est en cours de modification")

      const connector = headBand.connectors[Number(event.field)]

      if (!connector) throw new Error("Le connecteur à modifier n'existe pas")

      const oldPhoneId =
        event.row &&
        event.row[Number(event.field)] &&
        Number(event.row[Number(event.field)].id)

      if (oldPhoneId) {
        const { data } = await axios.post(
          `${routes.timone_phone_unplug}/${oldPhoneId}`
        )
        handleConnectorChange(data.id, data)
      }

      const newPhoneId = event.value && Number(event.value.id)
      newPhoneId && formData.append(`connector[phone]`, newPhoneId)

      const { data } = await axios.post(
        `${routes.timone_connector_update}/${connector.id}`,
        formData
      )
      handleConnectorChange(data.id, data)
    } catch (error) {
      console.error(error)
      if (error.response && error.response.data) {
        handleConnectorChangeError(error.response.data)
      } else if (error) {
        handleConnectorChangeError(error.message)
      }
      handleConnectorChange(event.id, connector)
    } finally {
    }
  }

  /**
   * Ouvre le panneau du bandeau cliqué et ferme celui qui était ouvert.
   * Si celui qui est ouvert, est le bandeau cliqué, c'est celui-ci qui se ferme,
   * ce qui a pour action d'avoir tous les bandeaux fermés.
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

  const handleDistributionEditStart = (event) => {
    console.log(
      "🚀 ~ file: DistributionRoom.js ~ line 152 ~ DistributionRoom ~ handleDistributionEditStart ~ event",
      event
    )
  }

  const handleDistributionEditCommit = (event) => {
    console.log(
      "🚀 ~ file: DistributionRoom.js ~ line 161 ~ DistributionRoom ~ handleDistributionEditCommit ~ event",
      event
    )
  }

  const handleDistributionEditStop = (event) => {
    console.log(
      "🚀 ~ file: DistributionRoom.js ~ line 168 ~ DistributionRoom ~ handleDistributionEditStop ~ event",
      event
    )
  }

  /**
   * Met en forme les éventuelles erreurs lié à la modification d'un poste
   */
  const handleConnectorChangeError = (errors) => {
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
   * Met à jour à l'affichage le connecteur qui à pour id "id" avec les données fournies "data"
   */
  const handleConnectorChange = (id, data) => {
    console.log(id, data)
  }

  // --> A chaque fois que la liste des redistributeurs change
  // Mise à jour du tableau
  useEffect(() => {
    if (tab === 'distribution') constructGrid()
  }, [tab, distributionHeadBandOpen, distributions])

  return (
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
                      distributionHeadBandOpen.headBandId === headBand.id
                    }
                    onOpenCLick={handleDistributionHeadBandOpenClick}
                    onCellEditStart={handleDistributionEditStart}
                    onCellEditCommit={handleDistributionEditCommit}
                    onCellEditStop={handleDistributionEditStop}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Box>
  )
}

export default DistributionRoom
