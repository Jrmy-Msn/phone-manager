import React, { useState, useEffect } from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import MenuItem from "@mui/material/MenuItem"
import Menu from "@mui/material/Menu"
import LogoutIcon from "@mui/icons-material/Logout"
import MoreIcon from "@mui/icons-material/MoreVert"

import "./HeaderBar.scss"

/**
 * Barre d'en-tête
 * @param {Boolean} noActions - Masque les actions possible à droite de la barre d'en-tête
 * @returns
 */
function HeaderBar({ auth = false, routes = {}, noActions = false }) {
  const [appName, setAppName] = useState("")

  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState(null)
  const isMoreMenuOpen = Boolean(moreMenuAnchorEl)

  const handleMoreMenuClose = () => {
    setMoreMenuAnchorEl(null)
  }

  const handleMoreMenuOpen = (event) => {
    setMoreMenuAnchorEl(event.currentTarget)
  }

  // Récupération du nom de l'application
  useEffect(() => {
    const rootElement = document.querySelector("#root")
    setAppName(rootElement.dataset.appName)
  })

  const moreMenuId = "more_menu"
  const renderMoreMenu = (
    <Menu
      anchorEl={moreMenuAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={moreMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMoreMenuOpen}
      onClose={handleMoreMenuClose}
    >
      <MenuItem onClick={(event) => (window.location.href = routes.logout)}>
        <IconButton
          size="large"
          aria-label="Se déconnecter de l'application"
          color="inherit"
        >
          <LogoutIcon />
        </IconButton>
        <Typography>Se déconnecter</Typography>
      </MenuItem>
    </Menu>
  )

  return (
    <Box sx={{ flexGrow: 0, height: "65px" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {appName}
          </Typography>
          {noActions ? (
            ""
          ) : !auth ? (
            <Button
              color="inherit"
              onClick={(event) => (window.location.href = routes.login)}
            >
              {" "}
              S'authentifier
            </Button>
          ) : (
            <Box sx={{ display: { xs: "flex" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={moreMenuId}
                aria-haspopup="true"
                onClick={handleMoreMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {renderMoreMenu}
    </Box>
  )
}

export default HeaderBar
