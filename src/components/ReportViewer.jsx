import React, { useState, useEffect } from 'react'
import { Toolbar, AppBar, Grid, IconButton, ButtonGroup, Paper, Typography } from '../deps/ui'
import { LocalPrintshop, PictureAsPdf, Description, OpenInNew } from '../deps/ui/icons'
import CommonDropDown from './CommonDropDown'
import useTable from './useTable'
import { showFilterProps } from './useDropDown'
import Controls from './controls/Controls'
import CircularLoading from './Circularloading'
import { useAppDispatch, useAppSelector } from '../store/storehook'
import { useLocation, useSearchParams } from 'react-router-dom'
import { EmployeeDataThunk, useEntitiesQuery, useLazyFileQuery } from '../store/actions/httpactions'
import { GET_EMPLOYEE_DATA } from '../services/UrlService'
import { decompressQuery } from '../util/reporthelper'

const BREAK_POINTS = { xs: 12, md: 12 };

export const ReportHeader = ({ handleReport, component: { pagination } }) => {

    return <AppBar color='default' sx={{ borderRadius: 1, mb: 1 }} position='sticky'><Toolbar variant='dense'>
        <Grid container width="100%" justifyContent="space-between">
            <Grid item size={{ xs: 2, md: 2 }} >

            </Grid>
            <Grid item >
                {pagination}
            </Grid>

            <Grid item>
                <ButtonGroup variant='text'>
                    <IconButton title='Print'>
                        <LocalPrintshop />
                    </IconButton>
                    <IconButton title='Download Pdf' onClick={() => handleReport(true, 'pdf')}>
                        <PictureAsPdf />
                    </IconButton>
                    <IconButton title='Download Excel' onClick={() => handleReport(true, 'excel')}>
                        <Description />
                    </IconButton>
                </ButtonGroup>

            </Grid>

        </Grid>
    </Toolbar>
    </AppBar>
}

export const BaseReportWrapper = ({ API_NAME, header, subHeader, fileName, children, handleRecord, pagination = null, thunk = { employee: false } }) => {
    const dispatch = useAppDispatch();
    const [loader, setLoader] = useState(false);
    const [searchParams] = useSearchParams();
    const [repotFilter, setReportFilter] = useState({
        limit: 30,
        page: 0,
        totalRecord: 0
    })

    const [getReport] = useLazyFileQuery();

    useEffect(() => {
        if (thunk?.employee)
            dispatch(EmployeeDataThunk({ url: GET_EMPLOYEE_DATA }));
        if (searchParams.get('data')) {
            const queryData = decompressQuery(searchParams.get("data"));
            handleReport(false, 'pdf', queryData);
            setReportFilter(queryData);
        }

        return () => {
            document.cookie !== "is_Auth=true" && window.close();
        }
    }, [searchParams])

    const handleReport = (isDownload = false, type = 'pdf', queryData = repotFilter) => {
        setLoader(true);
        getReport({
            url: `${API_NAME}/${isDownload ? 'download' : 'view'}`,
            fileName,
            data: { ...queryData, type }
        }).then(c => {

            if (!isDownload)
                handleRecord(c.data.result, queryData)
        }).finally(() => setLoader(false))

    }
    return (
        <Paper sx={{ p: 3, height: "100vh", overflow: 'auto' }}>
            <Grid container spacing={1}>
                <Grid position='sticky' top={0} item size={BREAK_POINTS}>
                    <ReportHeader handleReport={handleReport} component={{
                        pagination
                    }} />
                </Grid>
                <Grid item>
                    <Typography>{header}</Typography>
                    {subHeader && <Typography variant='subtitle1'>{subHeader}</Typography>}
                </Grid>
                <Grid item size={BREAK_POINTS}>
                    {children}
                </Grid>
            </Grid>
            <CircularLoading open={loader} />
        </Paper>

    )
}
