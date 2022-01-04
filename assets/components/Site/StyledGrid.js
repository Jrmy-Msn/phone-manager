import * as React from "react"
import { Typography, LinearProgress } from "@mui/material"
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled"
import {
  DataGrid,
  GridOverlay,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid"
import { styled } from "@mui/material/styles"
import AppTheme from "../../AppTheme"

export const CustomLoadingOverlay = () => {
  return (
    <GridOverlay>
      <div style={{ position: "absolute", top: 0, width: "100%" }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  )
}

export const CustomNoRowsOverlay = () => {
  return (
    <GridOverlay sx={{ display: "flex", flexDirection: "column" }}>
      <PhoneDisabledIcon sx={{ fontSize: "3rem" }} color="disabled" />
      <Typography component="em">Aucun poste</Typography>
    </GridOverlay>
  )
}

export const CustomGridToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton color="secondary" />
      <GridToolbarFilterButton
        sx={{
          color: AppTheme.palette.secondary.main,
        }}
      />
      <GridToolbarDensitySelector color="secondary" />
      <GridToolbarExport color="secondary" />
    </GridToolbarContainer>
  )
}

const StyledGrid = styled(DataGrid)(({ theme }) => ({
  border: 0,
  color: "rgba(255,255,255,0.85)",
  fontFamily: "Roboto",
  WebkitFontSmoothing: "auto",
  letterSpacing: "normal",
  "& .MuiDataGrid-columnsContainer": {
    backgroundColor: "#1d1d1d",
  },
  "& .MuiDataGrid-iconSeparator": {
    display: "none",
  },
  "& .MuiDataGrid-columnHeader, .MuiDataGrid-cell": {
    borderRight: "1px solid #303030",
  },
  "& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell": {
    borderBottom: "1px solid #303030",
  },
  "& .MuiDataGrid-cell": {
    color: "rgba(255,255,255,0.65)",
  },
  "& .MuiPaginationItem-root": {
    borderRadius: 0,
  },
  "& .MuiDataGrid-virtualScroller": {
    "& .MuiDataGrid-row": {
      "&:nth-of-type(2n)": {
        backgroundColor: "#202020",
      },
      "&:hover": {
        cursor: "pointer",
        backgroundColor: AppTheme.palette.primary.dark,
      },
    },
  },
  "& .MuiDataGrid-cell:focus": {
    outline: "none",
  },
  "& .MuiDataGrid-row--editing": {
    backgroundColor: AppTheme.palette.primary.light,
  },
}))

export default StyledGrid
