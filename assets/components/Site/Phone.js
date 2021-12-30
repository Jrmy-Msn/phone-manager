import axios from "axios"
import React, { useEffect, useState } from "react"
import {
  Box,
  Typography,
  LinearProgress,
  Autocomplete,
  TextField,
  Backdrop,
} from "@mui/material"
import CircularProgress from "@mui/material/CircularProgress"
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled"
import { DataGrid, GridToolbar, GridOverlay } from "@mui/x-data-grid"
import { GRID_FR_LOCALE_TEXT } from "./GridLocaleText"
import { PHONE_COLUMNS_DESCRIPTION } from "./PhoneColumnsDescription"

function Phone({
  routes,
  tab,
  phones,
  distributions,
  handlePhonesChange,
  handlePhonesChangeInfo,
  handlePhonesChangeError,
  loading,
}) {
  // état de la valeur d'un champ avant modification
  const [valueToModified, setValueToModified] = useState()
  // état de la valeur d'un poste après modification
  const [valueModified, setValueModified] = useState()
  // état de la valeur d'un poste en cours de modification
  const [valueChanged, setValueChanged] = useState()
  // état du backdrop lors des modifications
  const [backdropOpen, setBackdropOpen] = useState(false)
  // état du tableau de données
  const [grid, setGrid] = useState({
    columns: [],
    rows: [],
  })

  /**
   * Construit la grille de donnée en fonction de celle que l'on souhaite afficher (onglet...)
   */
  const constructGrid = () => {
    let columns = [...PHONE_COLUMNS_DESCRIPTION],
      rows = []

    columns.splice(8, 0, {
      field: "distribution",
      editable: true,
      filterable: false,
      headerName: "Distribution",
      width: 120,
      align: "center",
      renderCell: (params) => {
        return <span>{params.value ? params.value.label : ""}</span>
      },
      renderEditCell: (params) => {
        return (
          <Autocomplete
            loading={distributions.length === 0}
            fullWidth
            size="small"
            defaultValue={params.value}
            value={params.value}
            noOptionsText="-----"
            options={distributions}
            isOptionEqualToValue={(option, value) =>
              option.id === value.id && option.label === value.label
            }
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
            getOptionLabel={(option) => `${option.label}`}
            filterOptions={(options, state) => {
              return options.filter((option) =>
                `${option.label}`.includes(state.inputValue)
              )
            }}
            renderOption={(props, option) => (
              <Box component="span" {...props}>
                {option.label}
              </Box>
            )}
            renderInput={(props) => (
              <TextField
                {...props}
                label="redistributeur ?"
                variant="standard"
              />
            )}
          />
        )
      },
    })

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
              location: phone.location,
              distribution: phone.distribution,
              distributionCard: phone.distributionCard,
              distributionChannel: phone.distributionChannel,
              reserved: phone.reserved,
            }
          })
    setGrid({ columns, rows })
  }

  /**
   * Met à jour un poste
   * Toutes les données pour un poste sont récupérées et transformées en données de formulaire
   * puis envoyées au serveur pour mise à jour de la base de donnée
   * En retour, ce qui est enregistré en base de donnée est retourné est utilisé pour faire correspondre la donnée en base de donnée
   * et ce qui est affiché
   * En cas d'erreur une notification est affichée, et les modifications sont annulées
   */
  const updatePhone = async (params) => {
    // Blocage des intéractions le temps que les modifications soient prises en compte
    setBackdropOpen(true)

    try {
      // recherche du poste entrain d'être modifié
      const phone = phones.find((v) => v.id === params.row.id)

      if (!phone) throw new Error("Aucun poste n'est en cours de modification")

      // Initialisation des données de formulaire
      const formData = new FormData()

      // Dans le cas ou la modification n'a pas été confirmée (sortie de la cellule)
      // on met à jour l'affichage avec l'ancienne valeur
      if (!valueModified || !valueModified[params.id]) {
        // mise à jour des données clientes par les anciennes valeurs
        // annulation de la modification
        handlePhonesChangeInfo(phone)
        return
      }

      // Construction du formulaire de donnée pour le serveur
      // Chaque champs est créé avec sa valeur.
      // Si, le champs concerné est celui en cours de modification, c'est la valeur sauvegardée dans ("valueModified")
      // qui est prise sinon c'est la valeur présente dans la cellule.
      Object.keys(valueModified[params.id]).forEach((key) => {
        const formField = `phone[${key}]`
        const value = valueModified[params.id][key].value
        // cas particulier pour le champs "distribution", la valeur est un objet, et il faut utilisé seulement l'id comme valeur pour le formulaire
        const formValue = key === "distribution" ? value.id : value
        formField && formValue && formData.append(formField, formValue)
      })

      // Envoi des donnée de formulaire au serveur pour mettre à jour le poste
      const { data } = await axios.post(
        `${routes.timone_phone_update}/${phone.id}`,
        formData
      )
      
      // mise à jour des données clientes par les données seveurs
      handlePhonesChange(data.phone, data.otherPhone)
    } catch (error) {
      let errors = []

      // cas d'une erreur avec le serveur
      if (error && error.response && error.response.data) {
        if (Array.isArray(error.response.data)) errors = error.response.data
        else if (error.response.data.detail)
          errors.push([error.response.data.detail])
      } else if (error && error.message) {
        errors.push(error.message)
      }

      // mise à jour des données clientes par les anciennes valeurs
      handlePhonesChangeError(valueToModified, errors)
    } finally {
      // Blocage des intéractions
      setBackdropOpen(false)
    }
  }

  /**
   * Avant la modification de la cellule, nous en gardons la valeur d'origine pour permetttre
   * un retour en arrire en casd'annulation de l'opération.
   */
  const handlePhoneEditStart = (params, event) => {
    // Avant la modification de la cellule, nous en gardons la valeur d'origine pour permetttre
    // un retour en arrire en cas d'annulation de l'opération.
    setValueToModified(params.row)
  }

  /**
   * Si une valeur est modification "model" est définit et contient les valeurs de la ligne
   * en cours de modification.
   * Sinon "model" est vide et "undefined" est utilisé
   */
  const handlePhoneModelChange = (model, details) => {
    setValueModified(Object.keys(model) === 0 ? undefined : model)
  }

  /**
   * Si il y a eu annulation en cliquant à l'extérieur, "event" est de type PinterEvent,
   * alors undefined est utilisé pour effacer les traces d'une modification.
   * Sinon c'est qu'il y a eu confirmation (touche ENTREE).
   */
  const handlePhoneEditCommit = (id, event) => {
    if (event instanceof PointerEvent) {
      setValueModified(undefined)
    }
  }

  /**
   * En sortie de cellule, si une nouvelle valeur est présente (valueModified), les redistributeurs sont mis à jour
   */
  const handlePhoneEditStop = async (params, event) => {
    updatePhone(params)
  }

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

  // --> A chaque fois que la liste des redistributeurs change
  // Mise à jour du tableau
  useEffect(() => {
    if (tab === "phone") constructGrid()
  }, [tab, phones, distributions])

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
      }}
    >
      <Backdrop
        sx={{ position: "absolute", color: "#fff", zIndex: 1000 }}
        open={backdropOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div style={{ flexGrow: 1 }}>
        <DataGrid
          editMode="row"
          loading={loading}
          rows={grid.rows}
          columns={grid.columns}
          disableSelectionOnClick
          autoHeight
          onRowEditStart={handlePhoneEditStart}
          onEditRowsModelChange={handlePhoneModelChange}
          onRowEditCommit={handlePhoneEditCommit}
          onRowEditStop={handlePhoneEditStop}
          localeText={GRID_FR_LOCALE_TEXT}
          components={{
            LoadingOverlay: CustomLoadingOverlay,
            Toolbar: GridToolbar,
            NoRowsOverlay: CustomNoRowsOverlay,
          }}
        />
      </div>
    </Box>
  )
}

export default Phone
