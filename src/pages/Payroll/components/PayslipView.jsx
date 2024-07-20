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
    Paper

} from '../../../deps/ui'

const useStyles = makeStyles((theme) => ({
    // root: {
    //     flexGrow: 1,
    // },
    card: {
        // maxWidth: 345,
        width: '100%',
        margin: theme.spacing(2),
    },
    pagination: {
        marginTop: theme.spacing(2),
        justifyContent: 'center',
    },
}));

const payslips = [
    {
        id: 1,
        employeeName: 'John Doe',
        payDate: '2022-01-01',
        amount: 1000,
    },
    {
        id: 2,
        employeeName: 'Jane Doe',
        payDate: '2022-01-15',
        amount: 1500,
    },
    {
        id: 3,
        employeeName: 'Bob Smith',
        payDate: '2022-02-01',
        amount: 2000,
    },
    // ...
];

const EmptyString = "";
const PayslipView = ({
    payslip = {
        emplyeeRefNo: EmptyString,
        fullName: EmptyString,
        nic: EmptyString,
        companyInfo: {
            companyInfo: EmptyString
        },
        payroll: {
            payrollStartDate: EmptyString,
            payrollEndDate: EmptyString,
            earnings: [],
            deductions: [],
            totalSalary: EmptyString
        }

    }
}) => {
    const classes = useStyles();
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(1);

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedPayslips = payslips.slice(startIndex, endIndex);

    return (

        <Box sx={{ p: 2, borderRadius: 1, boxShadow: 2 }}>
            <Typography variant="h2" gutterBottom>
                Payslip Report
            </Typography>
            <Typography>
                Payslip Report From
            </Typography>

            <TableContainer component={Paper}>

                <Table>
                    <TableRow>
                        <TableCell>Employee Code: <b>${slip.emplyeeRefNo}</b></TableCell>
                        <TableCell>Employee Name: <b>${slip.fullName}</b></TableCell>
                        <TableCell>Area:  <b>${area.areaName}</b></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Department: <b>${department.departmentName}</b></TableCell>
                        <TableCell>Designation:<b>${designation.name}</b></TableCell>
                        <TableCell>CnicNo: <b>${slip.nic}</b></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Joining Date: ${companyInfo.joiningDate.formateDate()}</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </Table>

                <Table>
                    <TableHead>

                        <th>Earnings</th>
                        <th>Deductions</th>
                        <th>Tax</th>

                    </TableHead>
                    <tbody style='height:300px;'>
                        <tr>
                            <td><div style='height:300px;'> ${payroll.earnings.map(e => `<div style='width:100%;padding:5px;display:flex;justify-content:space-between;'> <label>${e.item}</label><label>${intFormat.format(e.amount)}</label> </div>`).join(" ")}</div></td>
                            <td><div style='height:300px;'> ${payroll.deductions.map(d => `<div style='width:100%;padding:5px;display:flex;justify-content:space-between;'><label>${d.item}</label><label>${intFormat.format(d.amount)}</label> </div>`).join(" ")}</div></td>
                            <td><div style='height:300px;'>--</div> </td>
                        </tr>

                    </tbody>
                </Table>

                <Table>
                    <TableRow>
                        <TableCell>Net Payment: ${intFormat.format(payroll.totalSalary)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Amount In Words: ${convertNumberToWords(payroll.totalSalary)}</TableCell>
                    </TableRow>
                </Table>
            </TableContainer>

            <div class="report-footer">
                <p>This is an automatically generated payslip and does not require any signature.</p>
            </div>


            <Typography variant="h5" gutterBottom>
                Payslip Report
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        Employee Details
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Employee Code</TableCell>
                                    <TableCell>Department</TableCell>
                                    <TableCell>Joining Date</TableCell>
                                    <TableCell>Employee Name</TableCell>
                                    <TableCell>Designation</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>L-01105</TableCell>
                                    <TableCell>Development</TableCell>
                                    <TableCell>02-June-2022</TableCell>
                                    <TableCell>Muhammad Faizan Ahmed Siddiqui</TableCell>
                                    <TableCell>Senior Software Engineer</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        Earnings
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Basic Salary</TableCell>
                                    <TableCell>42,000</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>House Allowance</TableCell>
                                    <TableCell>15,000</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Fuel</TableCell>
                                    <TableCell>3,000</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        Deductions
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>EOBI</TableCell>
                                    <TableCell>300</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Absent Deduction (20)</TableCell>
                                    <TableCell>38,710</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Loan Deduction</TableCell>
                                    <TableCell>2,000</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        Net Payment
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        18,990
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Amount in Words: Three hundred and Thirty-Seven thousand Six hundred and
                        Twenty-Six
                    </Typography>
                </Grid>
            </Grid>
            <Pagination
                className={classes.pagination}
                count={Math.ceil(payslips.length / rowsPerPage)}
                // page={page}
                onChange={handleChangePage}
            // rowsPerPage={rowsPerPage}
            />
        </Box>

    );
};

export default PayslipView;