import axios from "axios"
import React, { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { Alert, Box, Typography, Snackbar, Tab } from "@mui/material"
import { TabContext, TabList, TabPanel } from "@mui/lab"
import DnsIcon from "@mui/icons-material/Dns"
import PhoneIcon from "@mui/icons-material/Phone"
import HeaderBar from "../HeaderBar/HeaderBar"
import DistributionRoom from "./DistributionRoom"
import Phone from "./Phone"
import "./Site.scss"

function Site({
  label,
  auth = false,
  admin = false,
  routes = {},
  activeTab = "phone",
}) {
  // état de chargement des données du tableau de données
  const [loading, setLoadState] = useState(true)
  // état de la liste des postes téléphoniques
  const [phones, setPhones] = useState([])
  // état de la liste des redistributeurs
  const [distributions, setDistributions] = useState([])
  // état de l'onglet séléectionné
  const [tab, setTab] = useState(activeTab)
  // état d'un éventuel message d'erreur
  const [errorMessage, setErrorMessage] = useState("")
  // état d'un éventuel message de succès
  const [successMessage, setSuccessMessage] = useState("")

  /**
   * Met à jour l'affichage du panneau en fonction de l'onglet sélectionné
   */
  const handleTabChange = (event, newTab) => {
    setTab(newTab)
  }

  /**
   * Met à jour à l'affichage, le/les connecteur(s) et le/les poste(s) avec les données fournies
   */
  const handlePhonesChange = (phone) => {
    setPhones(phones.map((v) => (phone && v.id === phone.id ? phone : v)))
    setSuccessMessage(`N° ${phone.number} mis à jour`)
  }

  /**
   * Met à jour à l'affichage, le/les connecteur(s) et le/les poste(s) avec les données fournies
   * "phone1" corespond au numéro de poste déjà présent sur un conecteur avant la modification
   * "phone2" corespond au numéro de poste souhaité, sur le connecteur
   * "connector1" correspond au connecteur en cours de modification
   * "connector2" correspond au connecteur du nouveau numéro de poste souhaité
   * "phone1" peut être "undefined" si le nouveu numéro est inséré sur un connecteur vide
   * "conector2" peut être "undefined" si le nouveu numéro n'était déjà pas connecté
   * La valeur des 4 arguments est obtenue à partir du serveur
   */
  const handleDistributionsChange = (
    phone1,
    phone2,
    connector1,
    connector2
  ) => {
    // mise à jour des données clientes des numéros de poste
    setPhones(
      phones.map((v) => {
        if (phone1 && v.id === phone1.id) return phone1
        if (phone2 && v.id === phone2.id) return phone2
        return v
      })
    )

    // récupération des du redistributeur du "connector1"
    const distributionId1 =
      connector1 && connector1.headBand.distributionRoom.id
    // récupération des du bandeau du "connector1"
    const headBandId1 = connector1 && connector1.headBand.id
    // récupération des du redistributeur du "connector2"
    const distributionId2 =
      connector2 && connector2.headBand.distributionRoom.id
    // récupération des du bandeau du "connector2"
    const headBandId2 = connector2 && connector2.headBand.id

    // mise à jour des données clientes des redistributeurs
    setDistributions(
      distributions.map((distribution) => {
        // recherche du bandeau du "connector1" dans les données clientes
        const headBand1 = distribution.headBands.find(
          (h) => h.id === headBandId1
        )
        // recherche du bandeau du "connector2" dans les données clientes
        const headBand2 = distribution.headBands.find(
          (h) => h.id === headBandId2
        )

        // si la donnée courante correspond au bandeau et redistributeur du "connector1"
        // on remplace la donnée du connecteur actuel par celle récupérée du serveur, à savoir "connector1"
        if (distribution.id === distributionId1 && headBand1) {
          headBand1.connectors.map((c) =>
            c.id === connector1.id ? connector1 : c
          )
          // si la donnée courante correspond au bandeau et redistributeur du "connector2"
          // on remplace la donnée du connecteur actuel par celle récupérée du serveur, à savoir "connector2"
        } else if (distribution.id === distributionId2 && headBand2) {
          headBand2.connectors.map((c) =>
            c.id === connector2.id ? connector1 : c
          )
        }
        return distribution
      })
    )
    let message = phone1 ? `N° ${phone1.number}` : ""
    message += message && phone2 ? " et " : ""
    message += phone2 ? `N° ${phone2.number}` : ""
    setSuccessMessage(`${message} mis à jour`)
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

  // --> Seulement au chargement de la page
  // Récupération des numéros de poste
  // Récupération des redistributeurs
  useEffect(() => {
    ;(async function fetchData() {
      await getPhones()
    })()
    ;(async function fetchData() {
      await getDistributions()
    })()
  }, [])

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
            <Phone
              routes={routes}
              tab={tab}
              phones={phones}
              distributions={distributions}
              handlePhonesChange={handlePhonesChange}
              loading={loading}
            />
          </TabPanel>
          <TabPanel sx={{ px: 0 }} value="distribution">
            <DistributionRoom
              routes={routes}
              tab={tab}
              phones={phones}
              distributions={distributions}
              handleDistributionsChange={handleDistributionsChange}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  )
}

export default Site
