import React, { useState } from 'react'
import { Toolbar, AppBar, Grid, IconButton } from '../deps/ui'
import { LocalPrintshop, PictureAsPdf, Description, OpenInNew } from '../deps/ui/icons'
import CommonDropDown from './CommonDropDown'
import useTable from './useTable'
import { showFilterProps } from './useDropDown'
import Controls from './controls/Controls'
import CircularLoading from './Circularloading'
import { useAppSelector } from '../store/storehook'

const BREAK_POINTS = { xs: 10, sm: 10, md: 10 };

export const DetailPanelContent = ({ row, headCells, Footer = {
    Element: null,
    data: []
}, isSingleEmployee = false, pagination = true }) => {

    const { TblContainer, TblHead, TblBody, TblPagination } = useTable(row, headCells, Footer, {}, isSingleEmployee, pagination)
    return (
        <>
            <TblContainer>
                <TblHead />
                <TblBody />
            </TblContainer>
            <TblPagination />
        </>

    )
}


export const ReportHeader = ({ handleReport, component: { pagination } }) => {

    return <AppBar color='transparent' sx={{ borderRadius: 1, mb: 1 }} position='sticky'><Toolbar variant='dense'>
        <Grid container justifyContent="space-between">
            <Grid item sm={2} md={2} lg={2}>

            </Grid>
            <Grid item >
                {pagination}
            </Grid>

            <Grid item>
                <IconButton title='Print'>
                    <LocalPrintshop />
                </IconButton>
                <IconButton title='Download Pdf' onClick={() => handleReport(true)}>
                    <PictureAsPdf />
                </IconButton>
                <IconButton title='Download Excel'>
                    <Description />
                </IconButton>
                <IconButton title='New Tab'>
                    <OpenInNew />
                </IconButton>
            </Grid>

        </Grid>
    </Toolbar>
    </AppBar>
}
const ReportViewer = ({ records, TableHeaders, loader, showFilters = showFilterProps, handleReport, children, breakpoints = BREAK_POINTS }) => {
    return (
        <Grid container spacing={3}>
            <Grid item sm={3} md={3} lg={3}>
                <CommonDropDown isMultiple={true} breakpoints={breakpoints} flexDirection='column'
                    showFilters={showFilters} >
                    {children}
                    <Grid item {...breakpoints} pr={1}>
                        <Controls.Button text="Generate" onClick={() => handleReport()} fullWidth />
                    </Grid>
                </CommonDropDown>

            </Grid>

            <Grid item sm={9} md={9} lg={9}>
                <ReportHeader handleReport={handleReport} component={{ pagination: null }} />
                <CircularLoading open={loader} />
                <DetailPanelContent row={records} headCells={TableHeaders} />
            </Grid>

        </Grid>
    )
}

export default ReportViewer