import React from 'react';
import {
    Box, Typography, Paper, Divider, Grid
} from '../../../deps/ui'
import { convertNumberToWords } from '../../../util/common';

const EmptyString = "";
const EmptyArray = [];

// Amount formatting: decimals company ki currency se (PKR/SAR/AED = 2, KWD = 3)
const fmt = (value, decimals = 2) =>
    Number(value ?? 0).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

// ── Reusable: label-value row ──────────────────────────
const InfoRow = ({ label, value, bold = false }) => (
    <Box display="flex" justifyContent="space-between" py={0.5}>
        <Typography variant="body2" color="textSecondary">{label}</Typography>
        <Typography variant="body2" fontWeight={bold ? 600 : 400}>{value}</Typography>
    </Box>
);

// ── Reusable: supporting schedule block (Gratuity / Leave / PF) ──
const DetailBlock = ({ title, rows }) => (
    <Box>
        <Typography variant="caption" fontWeight={700} display="block" mb={0.5}>{title}</Typography>
        {rows.map((r, i) => (
            <InfoRow key={`${r.label}-${i}`} label={r.label} value={r.value} bold={r.bold} />
        ))}
    </Box>
);

// ── Earnings / Deductions: section-wise table ───────────
// sections = [{ title, lines: [{ item, amount }] }]
const SectionedAmountTable = ({ title, sections, totalLabel, total, currency, decimals }) => (
    <Box border="0.5px solid #e0e0e0" borderRadius={1}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
        <Box display="flex" justifyContent="space-between" bgcolor="#f5f5f5" px={1.5} py={1}>
            <Typography variant="caption" fontWeight={700}>{title}</Typography>
            <Typography variant="caption" fontWeight={700}>AMOUNT ({currency})</Typography>
        </Box>

        {sections.filter(s => s.lines?.length > 0).map((section, si) => (
            <Box key={`${section.title}-${si}`} pb={0.5}>
                <Typography variant="caption" fontWeight={700} color="textSecondary"
                    display="block" px={1.5} pt={1}>
                    {section.title}
                </Typography>
                {/* key mein index: ek hi naam ki kai lines (jaise do loans) ho sakti hain */}
                {section.lines.map((line, li) => (
                    <Box key={`${line.item}-${li}`} display="flex" justifyContent="space-between" px={1.5} py={0.5}>
                        <Typography variant="body2">{line.item}</Typography>
                        <Typography variant="body2">{fmt(line.amount, decimals)}</Typography>
                    </Box>
                ))}
            </Box>
        ))}

        <Box flexGrow={1} />
        <Divider />
        <Box display="flex" justifyContent="space-between" px={1.5} py={1}>
            <Typography variant="body2" fontWeight={700}>{totalLabel}</Typography>
            <Typography variant="body2" fontWeight={700}>{fmt(total, decimals)}</Typography>
        </Box>
    </Box>
);

// ── Signature block ─────────────────────────────────────
const SignatureBlock = ({ heading, lines }) => (
    <Box>
        <Typography variant="caption" fontWeight={700} display="block">{heading}</Typography>
        <Box mt={4} borderTop="0.5px solid #9e9e9e" pt={0.5}>
            <Typography variant="caption" color="textSecondary">Signature</Typography>
        </Box>
        {lines.map((l, i) => (
            <Typography key={i} variant="body2" mt={1}>{l}</Typography>
        ))}
        <Typography variant="body2" mt={1}>Date: ______________</Typography>
    </Box>
);

// Default statement: sirf misaal, legal wording company/wakeel se approve karwa ke acknowledgementText mein bhejo
const buildDefaultStatement = ({ employeeName, employeeCode, companyName, lastWorkingDate, currency, decimals, netPayable }) => {
    const amount = Math.abs(Number(netPayable ?? 0));
    const money = `${currency} ${fmt(amount, decimals)} (${convertNumberToWords(amount)})`;
    return Number(netPayable) < 0
        ? `I, ${employeeName} (Employee ID ${employeeCode}), confirm that my employment with ${companyName} ended on ${lastWorkingDate}, and that after adjusting all my dues an amount of ${money} is recoverable from me, which I shall pay to the Company. Subject to this payment, I have no further claim against the Company.`
        : `I, ${employeeName} (Employee ID ${employeeCode}), confirm that my employment with ${companyName} ended on ${lastWorkingDate}, and that I have received ${money} as full and final settlement of all my dues, including salary, benefits and any other claims arising out of my employment. I have no further claim against the Company.`;
};

const FnfView = ({
    companyName = EmptyString,
    logoUrl = null,
    currencyCode = 'PKR',
    decimalPlaces = 2,

    settlementDate = EmptyString,
    payPeriod = EmptyString,

    employeeCode = EmptyString,
    employeeName = EmptyString,
    designation = EmptyString,
    department = EmptyString,
    dateOfJoining = EmptyString,
    lastWorkingDate = EmptyString,
    exitType = EmptyString,
    servicePeriod = EmptyString,
    bankName = EmptyString,
    accountNo = EmptyString,

    earningSections = EmptyArray,     // [{ title, lines: [{ item, amount }] }]
    deductionSections = EmptyArray,
    totalEarnings = 0,
    totalDeductions = 0,
    netPayable = 0,                   // negative = employee se recoverable

    // Conditional schedules: sirf data ho to render honge
    gratuity = null,                  // { wageBasis, wage, serviceYears, ruleText, totalDays, payPercent, amount }
    leaveEncash = null,               // [{ leaveType, days, amount }]
    pf = null,                        // { openingBalance, contributions, payoutAmount, loanRecovered }

    remarks = null,
    acknowledgementText = null,       // null ho to default statement
    companySignatoryName = EmptyString,
    companySignatoryDesignation = EmptyString,
    preparedBy = EmptyString,
    approvedBy = EmptyString,

    isDraft = false,                  // approval se pehle "DRAFT" dikhane ke liye
    generatedOn = EmptyString,
}) => {
    const dp = decimalPlaces;
    const isRecovery = Number(netPayable) < 0;
    const netAmount = Math.abs(Number(netPayable ?? 0));

    const detailBlocks = [];

    if (gratuity) {
        detailBlocks.push({
            title: 'END OF SERVICE (GRATUITY) CALCULATION',
            rows: [
                { label: `Wage Basis (${gratuity.wageBasis})`, value: fmt(gratuity.wage, dp) },
                { label: 'Service (Years)', value: Number(gratuity.serviceYears).toFixed(2) },
                { label: gratuity.ruleText, value: `${Number(gratuity.totalDays).toFixed(2)} days` },
                { label: 'Payout %', value: `${Number(gratuity.payPercent).toFixed(2)}%` },
                { label: 'Gratuity', value: fmt(gratuity.amount, dp), bold: true },
            ]
        });
    }

    if (leaveEncash && leaveEncash.length > 0) {
        detailBlocks.push({
            title: 'LEAVE ENCASHMENT',
            rows: leaveEncash.map(l => ({
                label: `${l.leaveType} (${Number(l.days).toFixed(1)} d)`,
                value: fmt(l.amount, dp)
            }))
        });
    }

    if (pf) {
        detailBlocks.push({
            title: 'PROVIDENT FUND',
            rows: [
                { label: 'Opening Balance', value: fmt(pf.openingBalance, dp) },
                { label: 'Contributions (Employee + Employer)', value: fmt(pf.contributions, dp) },
                { label: 'PF Payout', value: fmt(pf.payoutAmount, dp), bold: true },
                { label: 'PF Loan Recovered', value: fmt(pf.loanRecovered, dp) },
            ]
        });
    }

    const statement = acknowledgementText
        ?? buildDefaultStatement({
            employeeName, employeeCode, companyName, lastWorkingDate,
            currency: currencyCode, decimals: dp, netPayable
        });

    return (
        <Paper variant="outlined" sx={{ p: 3, maxWidth: 900, mx: 'auto', '@media print': { border: 'none', boxShadow: 'none' } }}>

            {isDraft && (
                <Box bgcolor="#fff4e5" borderRadius={1} px={1.5} py={0.75} mb={1.5} textAlign="center">
                    <Typography variant="caption" fontWeight={700} color="warning.main">
                        DRAFT: PENDING APPROVAL
                    </Typography>
                </Box>
            )}

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
                    <Typography variant="h6" fontWeight={700}>FULL & FINAL SETTLEMENT</Typography>
                    <Typography variant="body2" color="textSecondary">Settlement Date: {settlementDate}</Typography>
                </Box>
            </Box>
            <Divider />

            {/* Final month salary period */}
            <Box py={1.5}>
                <Typography variant="body2">Final Month Salary Period: {payPeriod}</Typography>
            </Box>

            {/* Employee + exit info */}
            <Grid container spacing={2} pb={2}>
                <Grid size={{ xs: 6 }}>
                    <Typography variant="body2">Employee Name: <b>{employeeName}</b></Typography>
                    <Typography variant="body2">Employee ID: <b>{employeeCode}</b></Typography>
                    <Typography variant="body2">Designation: <b>{designation}</b></Typography>
                    <Typography variant="body2">Department: <b>{department}</b></Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                    <Typography variant="body2">Date of Joining: <b>{dateOfJoining}</b></Typography>
                    <Typography variant="body2">Last Working Date: <b>{lastWorkingDate}</b></Typography>
                    <Typography variant="body2">Exit Type: <b>{exitType}</b></Typography>
                    <Typography variant="body2">Service Period: <b>{servicePeriod}</b></Typography>
                </Grid>
            </Grid>

            {/* Earnings | Deductions */}
            <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                    <SectionedAmountTable title="EARNINGS" sections={earningSections}
                        totalLabel="TOTAL EARNINGS" total={totalEarnings} currency={currencyCode} decimals={dp} />
                </Grid>
                <Grid size={{ xs: 6 }}>
                    <SectionedAmountTable title="DEDUCTIONS" sections={deductionSections}
                        totalLabel="TOTAL DEDUCTIONS" total={totalDeductions} currency={currencyCode} decimals={dp} />
                </Grid>
            </Grid>

            {/* Net bar: negative ho to recoverable */}
            <Box display="flex" justifyContent="space-between" alignItems="center"
                bgcolor="#eeeeee" borderRadius={1} px={2} py={1.5} my={2}>
                <Box>
                    <Typography variant="body2" fontWeight={600}>
                        {isRecovery ? 'NET RECOVERABLE FROM EMPLOYEE' : 'NET PAYABLE'} (In Words): {convertNumberToWords(netAmount)}
                    </Typography>
                    {bankName && (
                        <Typography variant="caption" color="textSecondary">
                            Payment to: {bankName} {accountNo}
                        </Typography>
                    )}
                </Box>
                <Typography variant="h6" fontWeight={700}>{currencyCode} {fmt(netAmount, dp)}</Typography>
            </Box>

            {/* Supporting schedules: 2 per row */}
            {detailBlocks.length > 0 && (
                <Grid container spacing={2}>
                    {detailBlocks.map((block) => (
                        <Grid size={{ xs: 6 }} key={block.title}>
                            <DetailBlock title={block.title} rows={block.rows} />
                        </Grid>
                    ))}
                </Grid>
            )}

            {remarks && (
                <Typography variant="body2" mt={2}><b>Remarks:</b> {remarks}</Typography>
            )}

            {/* Statement + signatures: print mein ek saath rahen */}
            <Box mt={3} sx={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <Typography variant="body2" sx={{ textAlign: 'justify' }}>{statement}</Typography>

                <Grid container spacing={6} mt={0}>
                    <Grid size={{ xs: 6 }}>
                        <SignatureBlock
                            heading="EMPLOYEE"
                            lines={[`Name: ${employeeName}`, `Employee ID: ${employeeCode}`]}
                        />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <SignatureBlock
                            heading={`FOR AND ON BEHALF OF ${String(companyName).toUpperCase()}`}
                            lines={[
                                `Name: ${companySignatoryName || '______________________'}`,
                                `Designation: ${companySignatoryDesignation || '______________________'}`,
                            ]}
                        />
                    </Grid>
                </Grid>
            </Box>

            {(preparedBy || approvedBy) && (
                <Typography variant="caption" color="textSecondary" display="block" mt={2}>
                    Prepared by: {preparedBy}     Approved by: {approvedBy}
                </Typography>
            )}

            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between">
                <Typography variant="caption" color="textSecondary">
                    This is a computer generated statement.
                </Typography>
                <Typography variant="caption" color="textSecondary">
                    Generated On: {generatedOn}
                </Typography>
            </Box>
        </Paper>
    );
};

export default FnfView;