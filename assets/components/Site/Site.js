import axios from "axios"
import React, { useEffect, useState } from "react"
import { useSnackbar } from "notistack"
import { NavLink } from "react-router-dom"
import { Alert, Box, Typography, Snackbar, Tab } from "@mui/material"
import { TabContext, TabList, TabPanel } from "@mui/lab"
import DnsIcon from "@mui/icons-material/Dns"
import PhoneIcon from "@mui/icons-material/Phone"
import HeaderBar from "../HeaderBar/HeaderBar"
import DistributionRoom from "./DistributionRoom"
import Notification from "./Notification"
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
  const { enqueueSnackbar } = useSnackbar()

  /**
   * Met à jour l'affichage du panneau en fonction de l'onglet sélectionné
   */
  const handleTabChange = (event, newTab) => {
    setTab(newTab)
  }

  /**
   * Met à jour à l'affichage, les postes avec les données fournies.
   * Affiche eventuellement un message de réussite
   */
  const handlePhonesChange = (phone, otherPhone) => {
    setPhones(
      phones.map((v) => {
        if (phone && v.id === phone.id) return phone
        if (otherPhone && v.id === otherPhone.id) return otherPhone
        return v
      })
    )
    enqueueSnackbar(
      <Notification
        message={`Mise à jour du N° ${phone.number} : <strong>RÉUSSIE</strong>`}
      ></Notification>,
      {
        variant: "success",
      }
    )
  }

  /**
   * Met à jour à l'affichage, le poste avec les données fournies.
   * Affiche éventuellement un message d'information
   */
  const handlePhonesChangeInfo = (phone) => {
    setPhones(phones.map((v) => (phone && v.id === phone.id ? phone : v)))
    enqueueSnackbar(
      <Notification
        message={`Modification du N° ${phone.number} : <strong>ANNULÉE</strong>`}
      ></Notification>,
      {
        variant: "info",
      }
    )
  }

  /**
   * Met à jour à l'affichage, le poste avec les données fournies.
   * Affiche éventuellement un message d"erreur
   */
  const handlePhonesChangeError = (phone, errors = []) => {
    setPhones(phones.map((v) => (phone && v.id === phone.id ? phone : v)))
    if (errors) {
      enqueueSnackbar(
        <Notification
          message={`Modification du N° ${phone.number} : <strong>ECHOUÉE</strong>`}
        ></Notification>,
        {
          variant: "error",
        }
      )
      errors.forEach((v) =>
        enqueueSnackbar(<Notification message={v}></Notification>, {
          variant: "error",
        })
      )
    }
  }

  /**
   * Met à jour à l'affichage, le/les connecteur(s) et le/les poste(s) avec les données fournies
   * "fromPhone" corespond au numéro de poste déjà présent sur un conecteur avant la modification
   * "toPhone" corespond au numéro de poste souhaité, sur le connecteur
   * "fromConnector" correspond au connecteur en cours de modification
   * "toConnector" correspond au connecteur du nouveau numéro de poste souhaité
   * "fromPhone" peut être "undefined" si le nouveu numéro est inséré sur un connecteur vide
   * "toConnector" peut être "undefined" si le nouveu numéro n'était déjà pas connecté
   * La valeur des 4 arguments est obtenue à partir du serveur
   */
  const handleDistributionsChangeCallback = (
    fromPhone,
    fromConnector,
    toPhone,
    toConnector
  ) => {
    // mise à jour des données clientes des numéros de poste
    setPhones(
      phones.map((v) => {
        if (fromPhone && v.id === fromPhone.id) return fromPhone
        if (toPhone && v.id === toPhone.id) return toPhone
        return v
      })
    )

    // récupération des du redistributeur du "fromConnector"
    // const distributionId1 =
      // fromConnector && fromConnector.headBand.distributionRoom.id
    // récupération des du bandeau du "fromConnector"
    // const headBandId1 = fromConnector && fromConnector.headBand.id
    // récupération des du redistributeur du "toConnector"
    // const distributionId2 =
      // toConnector && toConnector.headBand.distributionRoom.id
    // récupération des du bandeau du "toConnector"
    // const headBandId2 = toConnector && toConnector.headBand.id

    // mise à jour des données clientes des redistributeurs
    // setDistributions(
    //   distributions.map((distribution) => {
    //     // recherche du bandeau du "fromConnector" dans les données clientes
    //     const headBand1 = distribution.headBands.find(
    //       (h) => h.id === headBandId1
    //     )
    //     // recherche du bandeau du "toConnector" dans les données clientes
    //     const headBand2 = distribution.headBands.find(
    //       (h) => h.id === headBandId2
    //     )

    //     // si la donnée courante correspond au bandeau et redistributeur du "fromConnector"
    //     // on remplace la donnée du connecteur actuel par celle récupérée du serveur, à savoir "fromConnector"
    //     if (distribution.id === distributionId1 && headBand1) {
    //       headBand1.connectors.map((c) =>
    //         c.id === fromConnector.id ? fromConnector : c
    //       )
    //       // si la donnée courante correspond au bandeau et redistributeur du "toConnector"
    //       // on remplace la donnée du connecteur actuel par celle récupérée du serveur, à savoir "toConnector"
    //     } else if (distribution.id === distributionId2 && headBand2) {
    //       headBand2.connectors.map((c) =>
    //         c.id === toConnector.id ? fromConnector : c
    //       )
    //     }
    //     // la valuer modifiée ou non est retournée
    //     return distribution
    //   })
    // )
  }

  /**
   * Met à jour à l'affichage, le/les connecteur(s) et le/les poste(s) avec les données fournies lors d'un succès
   */
  const handleDistributionsChange = (...args) => {
    handleDistributionsChangeCallback(...args)
    let [fromPhone, fromConnector, toPhone, toConnector] = args
    let messages = []

    // Affichage d'un résumé des optérations pour le poste déjà présent sur la connecteur à modifier
    // e.g : N XXXXX :
    // SRx - X port x => SRx - X port x
    if (fromPhone) {
      messages = [
        ...messages,
        [
          `N° ${fromPhone.number} :`,
          `${toConnector.headBand.distributionRoom.label} &ndash; ${toConnector.headBand.label} &#9635; ${toConnector.number} &rArr; &#9723;`,
        ],
      ]
    }

    // Affichage d'un résumé des optérations pour le poste à insérer sur la connecteur à modifier
    // e.g : N XXXXX :
    // SRx - X port x => SRx - X port x
    // SRy - Y port y => SRy - Y port y
    if (toPhone) {
      if (fromConnector) {
        messages = [
          ...messages,
          [
            `N° ${toPhone.number} :`,
            `${fromConnector.headBand.distributionRoom.label} &ndash; ${fromConnector.headBand.label} &#9635; ${fromConnector.number} &rArr; ${toConnector.headBand.distributionRoom.label} &ndash; ${toConnector.headBand.label} &#9635; ${toConnector.number}`,
          ],
        ]
      } else {
        messages = [
          ...messages,
          [
            `N° ${toPhone.number} :`,
            `&#9723; &rArr; ${toConnector.headBand.distributionRoom.label} &ndash; ${toConnector.headBand.label} &#9635; ${toConnector.number}`,
          ],
        ]
      }
    }
    messages.forEach((msg) => {
      enqueueSnackbar(<Notification message={msg}></Notification>, {
        variant: "success",
      })
    })
  }

  /**
   * Met à jour à l'affichage, le poste avec les données fournies.
   * Affiche éventuellement un message d'information
   */
  const handleDistributionsChangeInfo = (distribution, headBand, connector) => {
    // mise à jour des données clientes du redistributeur
    // setDistributions(
    //   distributions.map((d) => {
    //     // si la donnée courante correspond au bandeau et redistributeur du "connector"
    //     // on remplace la donnée du connecteur actuel par celle récupérée du serveur, à savoir "connector"
    //     if (d.id === distribution.id && headBand) {
    //       headBand.connectors.map((c) =>
    //         c.id === connector.id ? connector : c
    //       )
    //     }
    //     // la valuer modifiée ou non est retournée
    //     return d
    //   })
    // )
    enqueueSnackbar(
      <Notification
        message={`Modification de ${distribution.label} &ndash; ${headBand.label} &rArr; ${connector.number}  : <strong>ANNULÉE</strong>`}
      ></Notification>,
      {
        variant: "info",
      }
    )
  }

  /**
   * Met à jour à l'affichage, le/les connecteur(s) et le/les poste(s) avec les données fournies pour un échec
   */
  const handleDistributionsChangeError = (...args) => {
    handleDistributionsChangeCallback(...args)
    let [fromPhone, fromConnector, toPhone, toConnector] = args
    let message = fromPhone ? `N° ${fromPhone.number}` : ""
    message += message && toPhone ? " et " : ""
    message += toPhone ? `N° ${toPhone.number}` : ""
    enqueueSnackbar(
      <Notification
        message={`Modification de ${message} : <strong>ÉCHOUÉE</strong>`}
      ></Notification>,
      {
        variant: "error",
      }
    )
    if (fromConnector && toPhone) {
      message = [
        `N° ${toPhone.number} :`,
        `&#8618 ${fromConnector.headBand.distributionRoom.label} &ndash; ${fromConnector.headBand.label} &#9635; ${fromConnector.number}`,
      ]
      enqueueSnackbar(
        <Notification
          message={message}
          notice={`la restauration des données ci-dessus doit être faite manuellement`}
        ></Notification>,
        {
          variant: "warning",
          autoHideDuration: null,
        }
      )
    }
    if (fromPhone && toConnector) {
      message = [
        `N° ${fromPhone.number} :`,
        `&#8618 ${toConnector.headBand.distributionRoom.label} &ndash; ${toConnector.headBand.label} &#9635; ${toConnector.number}`,
      ]
      enqueueSnackbar(
        <Notification
          message={message}
          notice={`la restauration des données ci-dessus doit être faite manuellement`}
        ></Notification>,
        {
          variant: "warning",
          autoHideDuration: null,
        }
      )
    }
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
              handlePhonesChangeInfo={handlePhonesChangeInfo}
              handlePhonesChangeError={handlePhonesChangeError}
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
              handleDistributionsChangeInfo={handleDistributionsChangeInfo}
              handleDistributionsChangeError={handleDistributionsChangeError}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  )
}

export default Site
