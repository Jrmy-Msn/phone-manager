import { frFR } from "@mui/material/locale"
import { createTheme } from "@mui/material/styles"

const AppTheme = createTheme(
  {
    palette: {
      mode: "dark",
      primary: {
        main: "#6b84b1",
        light: "rgb(136, 156, 192)",
        dark: "rgb(74, 92, 123)",
        contrastText: "#fff",
      },
      secondary: {
        main: "#837b52",
        light: "#9b9574",
        dark: "#5b5639",
        contrastText: "#fff",
      },
      background: {
        default: "#1c1c1c",
        paper: "#252525",
      },
      error: {
        main: "#7f504e",
        light: "#987371",
        dark: "#583836",
      },
      warning: {
        main: "#b57722",
        light: "#c3924e",
        dark: "#7e5317",
        contrastText: "#fff",
      },
      info: {
        main: "#507f8a",
        light: "#7398a1",
        dark: "#385860",
        contrastText: "#fff",
      },
      success: {
        main: "#629a64",
        light: "#81ae83",
        dark: "#446b46",
        contrastText: "#fff",
      },
      text: {
        primary: "#fff",
      },
      divider: "rgba(255,255,255,0.12)",
      muted: "rgba(0, 0, 0, 0.54);",
    },
    components: {},
  },
  frFR
)

export default AppTheme
