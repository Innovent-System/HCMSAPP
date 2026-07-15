import React, { useState } from 'react'
import { formateISODateTime, getMonthStartEnd } from '../../../../services/dateTimeService';
import { BaseReportWrapper } from '../../../../components/ReportViewer';
import { Box, Stack, TableCell, TableRow, Typography, IconButton, ButtonGroup, TableHead } from '../../../../deps/ui'
import { DirectionsWalk, AvTimer, Difference } from '../../../../deps/ui/icons'
import { AttendanceflagMap } from '../../../../util/common';
import ReportTable from '../../../../components/ReportTable';
import { AddLeaveRequest } from '../../../Leave/Request';
import { AddAttendanceRequest } from '../../Request';
import { AddExemptionRequest } from '../../Exemption';

const ActionModel = {
    leaveReq: { Element: AddLeaveRequest, Icon: DirectionsWalk, title: "Leave Request" },
    attendanceReq: { Element: AddAttendanceRequest, Icon: AvTimer, title: "Attendance Request" },
    exmptionReq: { Element: AddExemptionRequest, Icon: Difference, title: "Exemption Request" }
}

const AddAction = ({ name, ...others }) => {
    const [openPopup, setOpenPopup] = useState(false);
    const Action = ActionModel[name];

    return (
        <>
            <IconButton size='small' onClick={() => {
                setOpenPopup(true);
            }}>
                <Action.Icon titleAccess={Action.title} fontSize="small" sx={{ fontSize: '0.9rem' }} />
            </IconButton>
            <Action.Element openPopup={openPopup} setOpenPopup={setOpenPopup} {...others} />
        </>
    )
}

const attendaceWillBeSHow = [1, 2, 3, 7];
const reportColumns = [
    // { field: 'employeeCode', headerName: 'Code' },
    { field: 'shiftName', headerName: 'Shift' },
    // { field: 'scheduleStartDt', headerName: 'Schedule Start', valueGetter: ({ row }) => `${formateISODateTime(row.scheduleStartDt)} ${row.isModified ? '*' : ''}` },
    { field: 'scheduleStartDt', headerName: 'Schedule Start', valueGetter: ({ row }) => formateISODateTime(row.scheduleStartDt) },
    { field: 'scheduleEndDt', headerName: 'Schedule End', valueGetter: ({ row }) => formateISODateTime(row.scheduleEndDt) },
    { field: 'startDateTime', headerName: 'Actual In', valueGetter: ({ row }) => formateISODateTime(row.startDateTime) },
    { field: 'endDateTime', headerName: 'Actual Out', valueGetter: ({ row }) => formateISODateTime(row.endDateTime) },
    { field: "workHrs", headerName: "Work Hrs" },
    { field: "lateArr", headerName: "Late" },
    { field: "early", headerName: "Early" },
    { field: "overTime", headerName: "O.T" },
    { field: 'remarks', disableSorting: false, headerName: 'Remarks' },
    {
        field: 'action', disableSorting: false, headerName: 'Actions', renderCell: ({ row }) => <ButtonGroup flexDirection="row">
            {attendaceWillBeSHow.includes(row?.status) || row.earlyOut ?
                <>
                    <AddAction key={`leave-${row.employeeId}-${row.scheduleStartDt}`} name="leaveReq" requestedDate={row.scheduleStartDt} requestedEmployee={row.employeeId} />
                    <AddAction key={`exemption-${row.employeeId}-${row.scheduleStartDt}`} name="exmptionReq" reqDate={row.scheduleStartDt} reqEmployee={row.employeeId} />
                </>
                : null}
            {attendaceWillBeSHow.includes(row?.status) || !row.scheduleEndDt || row.earlyOut ?
                <AddAction key={`attendance-${row.employeeId}-${row.scheduleStartDt}`} name="attendanceReq" reqDate={row.scheduleStartDt} reqEmployee={row.employeeId} /> : null}
        </ButtonGroup>


    }
];
const { monthStart, monthEnd } = getMonthStartEnd();
const TableFooter = ({ row, summary = [], index }) => {
    return <TableRow><TableCell variant='footer' colSpan={reportColumns.length}>
        {summary?.filter(e => e.employeeId == row.employeeId).map(e => <Box key={`footer-${e.employeeId}`} pb={1} pl={1} borderRadius={1} borderColor="whitesmoke" component="fieldset">
            <Typography component="legend">Summary</Typography>
            <Stack flexDirection="row" justifyContent="space-evenly">
                <Stack>
                    <Typography variant='subtitle2'>OnTime : {e.present}</Typography>
                    <Typography variant='subtitle2'>Absents : {e.absent}</Typography>
                    <Typography variant='subtitle2'>Holidays : {e.holidays}</Typography>
                </Stack>
                <Stack>
                    <Typography variant='subtitle2'>Late : {e.late}</Typography>
                    <Typography variant='subtitle2'>Leaves : {e.leaves}</Typography>
                    <Typography variant='subtitle2'>Total Days : {e.totalDays}</Typography>

                </Stack>
                <Stack>
                    <Typography variant='subtitle2'>Half Days : {e.halfDay}</Typography>
                    <Typography variant='subtitle2'>Short Days : {e.shortDay}</Typography>
                </Stack>


            </Stack>

        </Box>)}
    </TableCell>
    </TableRow>
}

const HeadElement = ({ row, index, summary }) => {
    return <TableHead><TableRow><TableCell sx={{ backgroundColor: '#fff' }} colSpan={reportColumns.length}>
        {summary?.filter(e => e.employeeId == row.employeeId).map(h => <Box key={`attHead-${row.employeeId}`} pb={1} pl={1} borderRadius={1} borderColor="whitesmoke" component="fieldset">
            <Typography component="legend">Detail</Typography>
            <Stack flexDirection="row" justifyContent="space-evenly">
                <Stack>
                    <Typography variant='caption' >EmployeeRef : {h.employeeRefNo}</Typography>
                    <Typography variant='caption'>Name : {h.fullName}</Typography>
                    <Typography variant='caption'>Designation : {h.designation}</Typography>
                </Stack>
                <Stack>
                    <Typography variant='caption'>Department : {h.department}</Typography>
                    <Typography variant='caption'>Area : {h.area}</Typography>
                    <Typography variant='caption'>Group : {h.group}</Typography>

                </Stack>
                {/* <Stack>
                    <Typography variant='subtitle2'>Half Days : {e.halfDay}</Typography>
                    <Typography variant='subtitle2'>Short Days : {e.shortDay}</Typography>
                </Stack> */}


            </Stack>

        </Box>)}

    </TableCell>
    </TableRow>
    </TableHead>
}

const GrandTotal = ({ row, minutesDetail }) => {
    const detail = minutesDetail.find(m => m.employeeId === row.employeeId);
    return <><TableRow >
        <TableCell colSpan={5}>
            Total
        </TableCell>
        <TableCell>{detail?.totalWorkHrs}</TableCell>
        <TableCell>{detail?.totalLateHrs}</TableCell>
        <TableCell>{detail?.totalEarlyHrs}</TableCell>
        <TableCell colSpan={4}>{detail?.totalOverTimeHrs}</TableCell>
    </TableRow>
        <TableRow>

            <TableCell colSpan={6}>
                Total Overtime
            </TableCell>
            <TableCell colSpan={2} align='center'>{detail?.remainingOTHrs}</TableCell>
            <TableCell colSpan={3}></TableCell>

        </TableRow>
    </>
}

const AttendanceViewer = ({ API_NAME, fileName }) => {

    const [records, setRecords] = useState({
        attendanceList: [],
        summary: []
    });
    const handleRecord = (data) => {
        setRecords(data)
    }

    return (

        <BaseReportWrapper API_NAME={API_NAME} fileName={fileName}
            handleRecord={handleRecord}
            thunk={{ employee: true }}
        >
            <ReportTable columnPrint={reportColumns}
                pageBreak={true}
                pageBreakOn='employeeId'
                reportData={records?.attendanceList}
                HeadElement={HeadElement}
                Summary={TableFooter}
                grandTotal={{
                    Element: GrandTotal,
                    isShow: true,
                    props: {
                        minutesDetail: records?.summary
                    }
                }}
                tableProps={{
                    summary: records?.summary
                }}
            />
        </BaseReportWrapper>
    )
}

export default AttendanceViewer