import { useCallback, useState, useEffect, useRef } from 'react'
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Pagination } from '../deps/ui'

const TblHead = ({ cols = [] }) => (
    <TableHead>
        <TableRow>
            {cols.map(c => <TableCell key={c.headerName}>{c.headerName}</TableCell>)}
        </TableRow>
    </TableHead>
)

const Row = ({ cols, row }) => (
    <TableRow
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
        {cols.map(({ valueGetter, field, renderCell }, index) =>
            <TableCell key={'cell-' + index} sx={{ paddingLeft: 4 }}>
                {typeof valueGetter === "function" ? valueGetter({ row }) : renderCell ? renderCell({ row }) : row[field]}
            </TableCell>
        )}
    </TableRow>
)

/**
 * @type {import('@mui/material').SxProps}
 */
const Styles = {
    table: {
        '& .MuiTableCell-root': {
            padding: 0.5,
            fontSize: 12
        },
        '& .MuiTableCell-head': {
            fontWeight: 600
        },
        '& .MuiTableRow-head': {
            bgcolor: 'primary.main',
            position: 'sticky',
            top: 0
        },
        '& tr': {
            '&:nth-of-type(even)': {
                bgcolor: '#f2f2f2'
            }
        },
    }
}

const ROW_PER_PAGE = 30;

/**
 * ReportTable component for rendering tabular reports with optional grouping, subtotals, grand totals, and printing logic.
 */
const ReportTable = ({ 
    pageBreak = false,
    pageBreakOn = '',
    isGroupBy = false,
    groupByField = null,
    isPrintHeader = true,
    HeadElement,
    Summary = null,
    summaryProps = null,
    grandTotal = {
        Element: null,
        fields: {},
        isShow: false,
        parentPath: "",
        props: {}
    },
    subTotal = {
        Element: null,
        fields: {},
        isShow: false,
        parentPath: "",
        props: {}
    },
    columnPrint = [], 
    reportData = [] 
}) => {

    const [page, setPage] = useState(1)
    const [resultCount, setResultCount] = useState(0)
    const [records, setRecords] = useState([])
    const isLastPage = useRef(false);
    const grandTotalSum = useRef(null);
    
    const handlePage = (event, value) => {
        if (pageBreak) {
            setRecords(reportData.filter(e => e.pageIndex == value))
        } else {
            isLastPage.current = false;
            setRecords(reportData.slice((value - 1) * ROW_PER_PAGE, value * ROW_PER_PAGE));
        }

        if (value === resultCount) isLastPage.current = true;
        setPage(value);
    }

    useEffect(() => {
        grandTotalSum.current = (grandTotal?.fields) ? Object.keys(grandTotal.fields).reduce((pre, curr) => {
            pre[curr] = 0;
            return pre;
        }, {}) : null;
        
        if(grandTotalSum.current){
            for (let index = 0; index < reportData.length; index++) {
                const row = reportData[index];
                Object.keys(grandTotalSum.current).forEach(e => grandTotalSum.current[e] += (grandTotal.parentPath ? row[grandTotal.parentPath][e] : row[e] ?? 0));
            }
        }
        
        if (pageBreak) {
            isLastPage.current = true;
            setRecords(reportData.filter(e => e.pageIndex === 1));
            setResultCount(reportData[reportData?.length - 1]?.pageIndex ?? 0);
        }
        else {
            setRecords(reportData.slice(0 * ROW_PER_PAGE, (0 + 1) * ROW_PER_PAGE));
            setResultCount(Math.ceil(reportData.length / ROW_PER_PAGE));
        }
    }, [reportData])

    const generateReport = useCallback(() => {
        let elements = [];
        let groupValue = null;
        let isFirst = true;
        let currentGroupRows = [];

        const _count = records.length;
        const _subTotal = (groupByField && subTotal.isShow) ? Object.keys(subTotal.fields).reduce((pre, curr) => {
            pre[curr] = 0;
            return pre;
        }, {}) : null;

        const flushGroup = (lastRow) => {
            if (currentGroupRows.length > 0) {
                // Wrap rows in TableBody
                elements.push(
                    <TableBody key={`tbody-${lastRow._id}`}>
                        {currentGroupRows}
                    </TableBody>
                );
                currentGroupRows = [];
            }
        };

        for (let rowsLength = 0; rowsLength < _count; rowsLength++) {
            const row = records[rowsLength];
            const isNewGroup = String(typeof groupByField == "function" ? groupByField(row) : null) !== String(groupValue);

            _subTotal && Object.keys(_subTotal).forEach(e => _subTotal[e] += (subTotal.parentPath ? row[subTotal.parentPath][e] : row[e] ?? 0));

            if (isFirst || isNewGroup) {
                // Flush previous group before starting new one
                if (currentGroupRows.length > 0) {
                    flushGroup(records[rowsLength - 1]);
                }

                if (HeadElement) elements.push(<HeadElement key={`headElement-${row._id}`} row={row} />);
                elements.push(<TblHead key={`head-${row._id}`} cols={columnPrint} />);
            }

            currentGroupRows.push(<Row key={`row-${row._id}`} row={row} cols={columnPrint} />);

            if (groupByField && String(groupByField(row)) !== String(groupByField(records[rowsLength == _count - 1 ? rowsLength : rowsLength + 1]))) {
                // Flush current group
                flushGroup(row);
                
                if (subTotal?.Element) {
                    currentGroupRows.push(
                        <subTotal.Element key={`subtotal-${groupByField(row)}-${row._id}`} row={row} subTotal={{ ..._subTotal }} />
                    );
                }
                _subTotal && Object.keys(_subTotal).forEach(e => _subTotal[e] = 0);
            }

            if ((_count - 1) === rowsLength && isLastPage.current) {
                // Flush remaining rows
                if (currentGroupRows.length > 0) {
                    flushGroup(row);
                }

                // Add grand total and summary in their own TableBody
                const footerRows = [];
                if (grandTotal?.Element) {
                    footerRows.push(
                        <grandTotal.Element key={`grand-${row._id}`} row={row} grandTotal={grandTotalSum.current} {...(grandTotal?.props && { ...grandTotal?.props })} />
                    );
                }
                if (Summary) {
                    footerRows.push(
                        <Summary key={`summary-${row._id}`} row={row} {...(summaryProps && { ...summaryProps })} />
                    );
                }
                
                if (footerRows.length > 0) {
                    elements.push(
                        <TableBody key={`footer-${row._id}`}>
                            {footerRows}
                        </TableBody>
                    );
                }
            }

            groupValue = typeof groupByField == "function" ? groupByField(row) : null;
            isFirst = false;
        }

        // Flush any remaining rows
        if (currentGroupRows.length > 0 && records.length > 0) {
            flushGroup(records[records.length - 1]);
        }

        return elements;
    }, [records]);

    return (
        <TableContainer>
            {records.length ? (
                <Pagination shape='rounded'
                    sx={{ display: 'flex', justifyContent: 'center' }}
                    page={page}
                    onChange={handlePage}
                    count={resultCount}
                />
            ) : null}
            <Table sx={Styles.table}>
                {generateReport()}
            </Table>
        </TableContainer>
    )
}

export default ReportTable;