import React, { useState } from 'react';
import {
    Grid, Card, CardContent, Typography, Pagination, makeStyles,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Divider

} from '../../../deps/ui'
import { convertNumberToWords } from '../../../util/common';
import { formateISODate } from '../../../services/dateTimeService';

const labelStyle = {
    width: '100%', padding: 5,
    display: 'flex', justifyContent: 'space-between'
}


const EmptyString = "";
const PayslipView = ({
    companyName = EmptyString,
    employeeRefNo = EmptyString,
    fullName = EmptyString,
    nic = EmptyString,
    companyInfo = {
        joiningDate: EmptyString
    },
    area, department, designation,
    payroll = {
        payrollStartDate: EmptyString,
        payrollEndDate: EmptyString,
        earnings: [],
        deductions: [],
        others:[],
        totalSalary: EmptyString
    }

}) => {

    return (

        <Box>

            <TableContainer component={Paper}>
                <Typography textAlign="center" variant="h4" p={2} gutterBottom>
                    {companyName}
                </Typography>
                <Typography textAlign="center" gutterBottom>
                    Payslip Report From {payroll.payrollStartDate} to {payroll.payrollEndDate}
                </Typography>
                <Divider />
                <Table size='small'>
                    <TableRow>
                        <TableCell>Employee Code: <b>{employeeRefNo}</b></TableCell>
                        <TableCell>Employee Name: <b>{fullName}</b></TableCell>
                        <TableCell>Area:  <b>{area}</b></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Department: <b>{department}</b></TableCell>
                        <TableCell>Designation:<b>{designation}</b></TableCell>
                        <TableCell>CnicNo: <b>{nic}</b></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Joining Date: <b>{formateISODate(companyInfo.joiningDate)}</b></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </Table>

                <Table>
                    <TableHead>
                        <TableCell>Earnings</TableCell>
                        <TableCell>Deductions</TableCell>
                        <TableCell>Tax</TableCell>
                    </TableHead>
                    <TableBody >
                        <TableRow>
                            <TableCell><div > {payroll.earnings.map(e => <div key={e.item} style={labelStyle}> <label>{e.item}</label><label>{e.amount}</label> </div>)}</div></TableCell>
                            <TableCell><div > {payroll.deductions.map(d => <div key={d.item} style={labelStyle}><label>{d.item}</label><label>{d.amount}</label> </div>)}</div></TableCell>
                            <TableCell><div > {payroll.others.map(e => <div key={e.item} style={labelStyle}> <label>{e.item}</label><label>{e.amount}</label> </div>)}</div></TableCell>
                        </TableRow>

                    </TableBody>
                </Table>

                <Table>
                    <TableRow>
                        <TableCell>Net Payment: {payroll.totalSalary}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Amount In Words: {convertNumberToWords(payroll.totalSalary)}</TableCell>
                    </TableRow>
                </Table>
            </TableContainer>

            {/* <div className="report-footer">
                <p>This is an automatically generated payslip and does not require any signature.</p>
            </div> */}


        </Box>

    );
};

export default PayslipView;