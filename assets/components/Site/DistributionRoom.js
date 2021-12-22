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

/**
 * Ce composant correspond à une ligne du tableau des redistributeur
 * La ligne corespond à un bandeau dans un redistributeur (e.g SR-1 Bandeau A )
 */
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
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

/**
 * Ce composant correspond à un bandeau dans un redistributeur
 *  -------------------------------------
 * |    1    |   2    |    3   |    4    |
 * |-------------------------------------
 * | A2xxxx  | N2xxxx | N2xxxx | A2xxxx  |
 * ----------------------------------------
 */
function DistributionRoom({
  tab,
  phones,
  distributions,
  routes,
  handleDistributionsChange,
}) {
  // état du bandeau actif
  const [distributionHeadBandOpen, setDistributionHeadBandOpen] = useState()
  // état de la valeur d'un connecteur avant modification
  const [valueToModified, setValueToModified] = useState()
  // état de la valeur d'un connecteur après modification
  const [valueModified, setValueModified] = useState()
  // état du tableau de donnée actif
  const [grid, setGrid] = useState({
    columns: [],
    rows: [],
  })

  /**
   * Renvoi le bandeau qui est entrain d'être visualisé ou modifié.
   * Peut renvoyer "undefined" si aucun bandeau n'est actif
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
   * Construit le tableau de donnée du bandeau actif d'un redistributeur à partir des données
   * clientes récupérées depuis le serveur au démarrage de l'application
   * (cf documentation MUI DATAGRID)
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
   * L'ancien numéro de poste est alors "débranché" de son connecteur (mise à jour en BDD).
   * Le nouveau numéro de poste lui est mis à jour avec son nouveau conecteur.
   * En retour, ce qui est enregistré en base de donnée est retourné et utilisé pour faire mettre à jour l'affichage.
   * En cas d'erreur une notification est affichée, et les modifications sont annulées.
   */
  const updateDistribution = async (event) => {
    const formData = new FormData()
    let phone1, phone2, connector1, connector2

    try {
      // récpération du bandeau ouvert (qui est entrain d'être modifié)
      const headBand = getCurrentDistributionHeadBand()
      if (!headBand)
        throw new Error("Aucun bandeau n'est en cours de modification")

      // récupération du connecteur à modifier
      const connector = headBand.connectors[Number(event.field)]
      if (!connector) throw new Error("Le connecteur à modifier n'existe pas")

      // Si une valeur est déjà présente => le poste correspondant est "débranché" (plus de liaison à ce connecteur)
      if (valueToModified) {
        const { data } = await axios.post(
          `${routes.timone_phone_unplug}/${valueToModified.id}`
        )
        phone1 = data.phone
        connector1 = data.connector
      }

      // Si le poste de remplacement est déjà "branché" ailleurs, on le "débranche" (plus de liaison à ce connecteur)
      if (valueModified.connector) {
        const { data } = await axios.post(
          `${routes.timone_phone_unplug}/${valueModified.id}`
        )
        phone2 = data.phone
        connector2 = data.connector
      }

      // mise à jour du nouveau poste choisit pour le connecteur
      valueModified && formData.append(`connector[phone]`, valueModified.id)
      const { data } = await axios.post(
        `${routes.timone_connector_update}/${connector.id}`,
        formData
      )
      phone2 = data.phone
      connector1 = data.connector

      // mise à jour des données clientes par les données seveurs
      handleDistributionsChange(phone1, phone2, connector1, connector2)
    } catch (error) {
      // retour arrière sur les données clientes
      console.error(error)
      // cas d'une erreur avec le serveur
      if (error && error.response && error.response.data) {
        handleConnectorChangeError(error.response.data)
      }
      // autres cas
      else if (error) handleConnectorChangeError(error.message)
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
    // Avant la modification de la cellule, nous en gardons la valeur d'origine pour permetttre
    // un retour en arrire en casd'annulation de l'opération.
    setValueToModified(event.value)
  }

  const handleDistributionEditCommit = (event) => {
    console.log(
      "🚀 ~ file: DistributionRoom.js ~ line 161 ~ DistributionRoom ~ handleDistributionEditCommit ~ event",
      event
    )
    // Dans ce cas, la validation par la touche "ENTREE" n'a pas été effectuée, cela revient à annuler l'opération
    // en quittant la cellule sans confirmation.
    setValueModified(event.cellMode ? undefined : event.value)
  }

  const handleDistributionEditStop = (event) => {
    console.log(
      "🚀 ~ file: DistributionRoom.js ~ line 168 ~ DistributionRoom ~ handleDistributionEditStop ~ event",
      event
    )
    // En sortie de cellule, si une nouvelle valeur est présente (valueModified), les redistributeurs sont mis à jour
    if (valueModified) updateDistribution(event)
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

  // --> A chaque fois que la liste des redistributeurs change
  // Mise à jour du tableau
  useEffect(() => {
    if (tab === "distribution") constructGrid()
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
