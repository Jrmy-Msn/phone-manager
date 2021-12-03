import {
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import React, { useEffect, useState } from "react"

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import { DataGrid } from "@mui/x-data-grid"
import { GRID_FR_LOCALE_TEXT } from "./GridLocaleText"
import { Box } from "@mui/system"

export function DistributionRow({ label, headBand, open, onOpenCLick }) {

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton size="small" onClick={() => onOpenCLick(headBand.id)}>
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
            {label} &mdash; {headBand.label}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              {/* <DataGrid
              rows={grid.rows}
              columns={grid.columns}
              disableSelectionOnClick
              autoHeight
              // onCellEditCommit={}
              localeText={GRID_FR_LOCALE_TEXT}
              // components={{
              //   LoadingOverlay: CustomLoadingOverlay,
              //   Toolbar: GridToolbar,
              //   NoRowsOverlay: CustomNoRowsOverlay,
              // }}
            /> */}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}
