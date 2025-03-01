import React, { useState } from 'react'
import { formateISODateTime, getMonthStartEnd } from '../../../../services/dateTimeService';
import { BaseReportWrapper } from '../../../../components/ReportViewer';
import { Box, Stack, TableCell, TableRow, Typography, IconButton, ButtonGroup, TableHead } from '../../../../deps/ui'
import { DirectionsWalk, AvTimer } from '../../../../deps/ui/icons'
import { AttendanceflagMap } from '../../../../util/common';
import ReportTable from '../../../../components/ReportTable';
import { AddLeaveRequest } from '../../../Leave/Request';
import { AddAttendanceRequest } from '../../Request';

const ActionModel = {
    leaveReq: { Element: AddLeaveRequest, Icon: DirectionsWalk, title: "Leave Request" },
    attendanceReq: { Element: AddAttendanceRequest, Icon: AvTimer, title: "Attendance Request" }
}

const AddAction = ({ name, ...others }) => {
    const [openPopup, setOpenPopup] = useState(false);
    const Action = ActionModel[name];

    return (
        < >
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
    { field: 'scheduleStartDt', headerName: 'Schedule Start', valueGetter: ({ row }) => formateISODateTime(row.scheduleStartDt) },
    { field: 'scheduleEndDt', headerName: 'Schedule End', valueGetter: ({ row }) => formateISODateTime(row.scheduleEndDt) },
    { field: 'startDateTime', headerName: 'Actual In', valueGetter: ({ row }) => formateISODateTime(row.startDateTime) },
    { field: 'endDateTime', headerName: 'Actual Out', valueGetter: ({ row }) => formateISODateTime(row.endDateTime) },
    { field: "workHrs", headerName: "Work Hrs" },
    { field: "lateArr", headerName: "Late" },
    { field: "earlyOut", headerName: "Early" },
    { field: "overTime", headerName: "O.T" },
    { field: 'status', disableSorting: false, headerName: 'Remarks', valueGetter: ({ row }) => AttendanceflagMap[row?.status]?.tag },
    {
        field: 'action', disableSorting: false, headerName: 'Actions', renderCell: ({ row }) => <ButtonGroup flexDirection="row">
            {attendaceWillBeSHow.includes(row?.status) || row.earlyOut ? <AddAction key={`leave-${row.fkEmployeeId}-${row.scheduleStartDt}`} name="leaveReq" requestedDate={row.scheduleStartDt} requestedEmployee={row.fkEmployeeId} /> : null}
            {attendaceWillBeSHow.includes(row?.status) || !row.scheduleEndDt || row.earlyOut ?
                <AddAction key={`attendance-${row.fkEmployeeId}-${row.scheduleStartDt}`} name="attendanceReq" reqDate={row.scheduleStartDt} reqEmployee={row.fkEmployeeId} /> : null}
        </ButtonGroup>


    }
];
const { monthStart, monthEnd } = getMonthStartEnd();
const TableFooter = ({ row, summary = [], index }) => {
    return <TableRow><TableCell variant='footer' colSpan={reportColumns.length}>
        {summary?.filter(e => e.fkEmployeeId == row.fkEmployeeId).map(e => <Box key={`footer-${e.fkEmployeeId}`} pb={1} pl={1} borderRadius={1} borderColor="whitesmoke" component="fieldset">
            <Typography component="legend">Summary</Typography>
            <Stack flexDirection="row" justifyContent="space-evenly">
                <Stack>
                    <Typography variant='subtitle2'>OnTime : {e.present}</Typography>
                    <Typography variant='subtitle2'>Absents : {e.absent}</Typography>
                    <Typography variant='subtitle2'>Holidays : {e.holiday}</Typography>
                </Stack>
                <Stack>
                    <Typography variant='subtitle2'>Late : {e.late}</Typography>
                    <Typography variant='subtitle2'>Leaves : {e.leaves}</Typography>
                    <Typography variant='subtitle2'>Total Present : {e.actualPresent}</Typography>

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

const HeadElement = ({ row, index }) => {
    return <TableHead> <TableRow><TableCell sx={{ backgroundColor: '#fff' }} colSpan={reportColumns.length}>
        <Box pb={1} pl={1} borderRadius={1} borderColor="whitesmoke" component="fieldset">
            <Typography component="legend">Detail</Typography>
            <Stack flexDirection="row" justifyContent="space-evenly">
                <Stack>
                    <Typography variant='caption' >EmployeeRef : {row.emplyeeRefNo}</Typography>
                    <Typography variant='caption'>Name : {row.fullName}</Typography>
                    <Typography variant='caption'>Designation : {row.designation}</Typography>
                </Stack>
                <Stack>
                    <Typography variant='caption'>Department : {row.department}</Typography>
                    <Typography variant='caption'>Area : {row.area}</Typography>
                    <Typography variant='caption'>Group : {row.group}</Typography>

                </Stack>
                {/* <Stack>
                    <Typography variant='subtitle2'>Half Days : {e.halfDay}</Typography>
                    <Typography variant='subtitle2'>Short Days : {e.shortDay}</Typography>
                </Stack> */}


            </Stack>

        </Box>
    </TableCell>
    </TableRow>
    </TableHead>
}

const GrandTotal = ({ row, minutesDetail }) => {
    const detail = minutesDetail.find(m => m.fkEmployeeId === row.fkEmployeeId);
    return <><TableRow >
        <TableCell colSpan={5}>
            Total
        </TableCell>
        <TableCell>{detail?.totalWorkHr}</TableCell>
        <TableCell>{detail?.totalLateHr}</TableCell>
        <TableCell>{detail?.totalEarly}</TableCell>
        <TableCell colSpan={4}>{detail?.totalOverTime}</TableCell>
    </TableRow>
        <TableRow>

            <TableCell colSpan={6}>
                Total Overtime
            </TableCell>
            <TableCell colSpan={2} align='center'>{detail?.reminingOTHr}</TableCell>
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
                pageBreakOn='fkEmployeeId'
                reportData={records?.attendanceList}
                HeadElement={HeadElement}
                Summary={TableFooter}
                GrandTotal={GrandTotal}
                summaryProps={{
                    summary: records?.summary
                }}
                grandTotalProps={{
                    minutesDetail: records?.minutesDetail
                }}
            />
        </BaseReportWrapper>
    )
}

export default AttendanceViewer