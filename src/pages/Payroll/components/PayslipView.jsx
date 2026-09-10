import React from 'react';
import {
    Box, Typography, Table, TableBody, TableCell, TableRow, Paper, Divider, Grid
} from '../../../deps/ui'
import { convertNumberToWords } from '../../../util/common';
import { formateISODate } from '../../../services/dateTimeService';

const EmptyString = "";
const EmptyArray = [];

// ── Reusable: label-value row ──────────────────────────
const InfoRow = ({ label, value, bold = false }) => (
    <Box display="flex" justifyContent="space-between" py={0.5}>
        <Typography variant="body2" color="textSecondary">{label}</Typography>
        <Typography variant="body2" fontWeight={bold ? 600 : 400}>{value}</Typography>
    </Box>
);

// ── Reusable: Earnings/Deductions amount table ─────────
const AmountTable = ({ title, items, totalLabel, total }) => (
    <Box border="0.5px solid #e0e0e0" borderRadius={1}
        sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
        }}
    >
        <Box display="flex" justifyContent="space-between" bgcolor="#f5f5f5" px={1.5} py={1}>
            <Typography variant="caption" fontWeight={700}>{title}</Typography>
            <Typography variant="caption" fontWeight={700}>AMOUNT (PKR)</Typography>
        </Box>
        {items.map((item) => (
            <Box key={item.item} display="flex" justifyContent="space-between" px={1.5} py={0.75}>
                <Typography variant="body2">{item.item}</Typography>
                <Typography variant="body2">{Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
            </Box>
        ))}
        <Divider />
        <Box display="flex" justifyContent="space-between" px={1.5} py={1}>
            <Typography variant="body2" fontWeight={700}>{totalLabel}</Typography>
            <Typography variant="body2" fontWeight={700}>{Number(total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
        </Box>
    </Box>
);

// ── Reusable: conditional 2-col detail block (Tax/PF/Leave/YTD) ──
const DetailBlock = ({ title, rows }) => (
    <Box>
        <Typography variant="caption" fontWeight={700} display="block" mb={0.5}>{title}</Typography>
        {rows.map((r) => (
            <InfoRow key={r.label} label={r.label} value={r.value} />
        ))}
    </Box>
);

const PayslipView = ({
    companyName = EmptyString,
    logoUrl = null,
    employeeCode = EmptyString,
    employeeName = EmptyString,
    nic = EmptyString,
    dateOfJoining = EmptyString,
    area, department, designation,
    employmentType = EmptyString,
    bankName = EmptyString,
    accountNo = EmptyString,
    payPeriod = EmptyString,
    paymentDate = EmptyString,
    monthLabel = EmptyString,

    earnings = EmptyArray,
    deductions = EmptyArray,
    totalEarnings = 0,
    totalDeductions = 0,
    netSalary = 0,

    // Conditional sections — sirf tab render honge jab data provided ho
    taxDetail = null,        // { taxableIncome, taxSlab, incomeTax }
    pfBalance = null,        // { employeeContribution, employerContribution, totalBalance }
    leaveBalance = null,     // [{ leaveType, remaining }]
    ytdSummary = null,       // { grossEarningsYTD, totalDeductionsYTD, incomeTaxPaidYTD, netSalaryPaidYTD }

    generatedOn = EmptyString,
}) => {

    // Enabled detail-blocks ko collect karo, phir 2-per-row pair karo
    const detailBlocks = [];

    if (taxDetail) {
        detailBlocks.push({
            title: 'TAX DETAILS',
            rows: [
                { label: 'Taxable Income', value: Number(taxDetail.taxableIncome).toLocaleString(undefined, { minimumFractionDigits: 2 }) },
                { label: 'Tax Slab', value: taxDetail.taxSlab },
                { label: 'Income Tax', value: Number(taxDetail.incomeTax).toLocaleString(undefined, { minimumFractionDigits: 2 }) },
            ]
        });
    }

    if (pfBalance) {
        detailBlocks.push({
            title: 'PF BALANCE',
            rows: [
                { label: 'Employee Contribution', value: Number(pfBalance.employeeContribution).toLocaleString(undefined, { minimumFractionDigits: 2 }) },
                { label: 'Employer Contribution', value: Number(pfBalance.employerContribution).toLocaleString(undefined, { minimumFractionDigits: 2 }) },
                { label: 'Total Balance', value: Number(pfBalance.totalBalance).toLocaleString(undefined, { minimumFractionDigits: 2 }) },
            ]
        });
    }

    if (leaveBalance && leaveBalance.length > 0) {
        detailBlocks.push({
            title: 'LEAVE BALANCE',
            rows: leaveBalance.map(l => ({ label: l.leaveType, value: l.remaining }))
        });
    }

    if (ytdSummary) {
        detailBlocks.push({
            title: 'YEAR TO DATE SUMMARY',
            rows: [
                { label: 'Gross Earnings YTD', value: Number(ytdSummary.grossEarningsYTD).toLocaleString(undefined, { minimumFractionDigits: 2 }) },
                { label: 'Total Deductions YTD', value: Number(ytdSummary.totalDeductionsYTD).toLocaleString(undefined, { minimumFractionDigits: 2 }) },
                { label: 'Income Tax Paid YTD', value: Number(ytdSummary.incomeTaxPaidYTD).toLocaleString(undefined, { minimumFractionDigits: 2 }) },
                { label: 'Net Salary Paid YTD', value: Number(ytdSummary.netSalaryPaidYTD).toLocaleString(undefined, { minimumFractionDigits: 2 }) },
            ]
        });
    }

    return (
        <Paper variant="outlined" sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>

            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" pb={1.5}>
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Box width={48} height={48} bgcolor="#f0f0f0" borderRadius={1}
                        display="flex" alignItems="center" justifyContent="center">
                        {logoUrl ? <img src={logoUrl} alt="logo" style={{ maxWidth: '100%', maxHeight: '100%' }} /> : null}
                    </Box>
                    <Typography variant="h6" fontWeight={700}>{companyName}</Typography>
                </Box>
                <Box textAlign="right">
                    <Typography variant="h6" fontWeight={700}>PAYSLIP</Typography>
                    <Typography variant="body2" color="textSecondary">{monthLabel}</Typography>
                </Box>
            </Box>
            <Divider />

            {/* Pay period / payment date */}
            <Box display="flex" justifyContent="space-between" py={1.5}>
                <Typography variant="body2">Pay Period: {payPeriod}</Typography>
                {/* <Typography variant="body2">Payment Date: {paymentDate}</Typography> */}
            </Box>

            {/* Employee info grid */}
            <Grid container height="100%" spacing={2} pb={2}>
                <Grid item size={{ xs: 6 }} >
                    <Typography variant="body2">Employee Name: <b>{employeeName}</b></Typography>
                    <Typography variant="body2">Employee ID: <b>{employeeCode}</b></Typography>
                    <Typography variant="body2">Designation: <b>{designation}</b></Typography>
                    <Typography variant="body2">Department: <b>{department}</b></Typography>
                </Grid>
                <Grid item size={{ xs: 6 }}>
                    <Typography variant="body2">Date of Joining: <b>{dateOfJoining}</b></Typography>
                    <Typography variant="body2">Employment Type: <b>{employmentType}</b></Typography>
                    <Typography variant="body2">Bank Name: <b>{bankName}</b></Typography>
                    <Typography variant="body2">Account No.: <b>{accountNo}</b></Typography>
                </Grid>
            </Grid>

            {/* Earnings | Deductions */}
            <Grid container spacing={2}>
                <Grid item size={{ xs: 6 }}>
                    <AmountTable title="EARNINGS" items={earnings} totalLabel="TOTAL EARNINGS" total={totalEarnings} />
                </Grid>
                <Grid item size={{ xs: 6 }}>
                    <AmountTable title="DEDUCTIONS" items={deductions} totalLabel="TOTAL DEDUCTIONS" total={totalDeductions} />
                </Grid>
            </Grid>

            {/* Net Salary bar */}
            <Box display="flex" justifyContent="space-between" alignItems="center"
                bgcolor="#eeeeee" borderRadius={1} px={2} py={1.5} my={2}>
                <Typography variant="body2" fontWeight={600}>
                    NET SALARY (In Words): {convertNumberToWords(netSalary)}
                </Typography>
                <Typography variant="h6" fontWeight={700}>PKR {Number(netSalary).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
            </Box>

            {/* Conditional detail blocks — 2 per row */}
            {detailBlocks.length > 0 && (
                <Grid container spacing={2}>
                    {detailBlocks.map((block) => (
                        <Grid item xs={6} key={block.title}>
                            <DetailBlock title={block.title} rows={block.rows} />
                        </Grid>
                    ))}
                </Grid>
            )}

            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between">
                <Typography variant="caption" color="textSecondary">
                    This is computer generated payslip and does not require signature.
                </Typography>
                <Typography variant="caption" color="textSecondary">
                    Generated On: {generatedOn}
                </Typography>
            </Box>
        </Paper>
    );
};

export default PayslipView;