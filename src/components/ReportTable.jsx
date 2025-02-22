import { useCallback, useState, useEffect, useRef } from 'react'
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Pagination } from '../deps/ui'

//{ field: 'requestDate', headerName: 'Request Date', flex: 1 },
const TblHead = ({ cols = [] }) => (
    <TableHead >
        <TableRow>
            {cols.map(c => <TableCell key={c.headerName}>{c.headerName}</TableCell>)}
        </TableRow>
    </TableHead>
)

const Row = ({ cols, row }) => (
    <TableRow
        key={row.id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
        {cols.map(({ valueGetter, field, renderCell }, index) =>
            <TableCell key={'cell-' + index} sx={{ paddingLeft: 4 }} >{typeof valueGetter === "function" ? valueGetter({ row }) : renderCell ? renderCell({ row }) : row[field]}</TableCell>
        )
        }
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
        '& tbody tr': {
            '&:hover': {
                bgcolor: '#fffbf2',
                cursor: 'pointer',
            },
            '&:nth-child(even)': {
                bgcolor: '#f2f2f2'
            }

        },
    }
}

const ROW_PER_PAGE = 30;
const ReportTable = ({ pageBreak = false,
    pageBreakOn = '',
    isGroupBy = false,
    groupByField = '',
    isPrintHeader = true,
    HeadElement,
    Summary = null,
    summaryProps = null,
    GrandTotal = null,
    grandTotalProps = null,
    subTotalBy = null,
    SubTotal = null,
    subTotalpath = "",
    columnPrint = [], reportData = [] }) => {

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

        grandTotalSum.current = (groupByField && subTotalBy) ? Object.keys(subTotalBy).reduce((pre, curr) => {
            pre[curr] = 0;
            return pre;
        }, {}) : null;

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
        let preValue = '';
        let groupValue = '';
        let isFirst = true;

        const _count = records.length;
        const subTotal = (groupByField && subTotalBy) ? Object.keys(subTotalBy).reduce((pre, curr) => {
            pre[curr] = 0;
            return pre;
        }, {}) : null;


        for (let rowsLength = 0; rowsLength < _count; rowsLength++) {
            const row = records[rowsLength];
            const isNew = String(row[pageBreakOn]) !== String(preValue);
            const isNewGroup = String(row[groupByField]) !== String(groupValue);

            subTotal && Object.keys(subTotal).forEach(e => subTotal[e] += (subTotalpath ? row[subTotalpath][e] : row[e] ?? 0));
            subTotal && Object.keys(grandTotalSum.current).forEach(e => grandTotalSum.current[e] += (subTotalpath ? row[subTotalpath][e] : row[e] ?? 0));
            if (isFirst || isNewGroup) {
                if (HeadElement) elements.push(<HeadElement key={`headElement-${row._id}`} row={row} />);

                elements.push(<TblHead key={`head-${row._id}`} cols={columnPrint} />);
            }

            elements.push(<Row key={`row-${row._id}`} row={row} cols={columnPrint} />)

            if (groupByField && String(row[groupByField]) !== String(records[rowsLength == _count ? rowsLength : rowsLength + 1]?.[groupByField])) {
                // GrandTotal && elements.push(<GrandTotal key={`grand-${groupByField}-${row._id}`} row={row} {...(grandTotalProps && { ...grandTotalProps })} />);
                // Summary && elements.push(<Summary key={`summary-${groupByField}-${row._id}`} row={row} {...(summaryProps && { ...summaryProps })} />);
                SubTotal && elements.push(<SubTotal key={`subtotal-${groupByField}-${row._id}`} row={row} subTotal={{ ...subTotal }} />);
                subTotal && Object.keys(subTotal).forEach(e => subTotal[e] = 0);
            }

            if ((_count - 1) === rowsLength && isLastPage.current) {
                GrandTotal && elements.push(<GrandTotal key={`grand-${row._id}`} row={row} grandTotal={grandTotalSum.current} {...(grandTotalProps && { ...grandTotalProps })} />);
                Summary && elements.push(<Summary key={`summary-${row._id}`} row={row} {...(summaryProps && { ...summaryProps })} />);
            }


            preValue = row[pageBreakOn];
            groupValue = row[groupByField];
            isFirst = false;
        }

        return elements;
    }, [records]);


    return <TableContainer>
        <Table sx={Styles.table} >
            {generateReport()}

        </Table>

        {records.length ? <Pagination
            page={page}
            onChange={handlePage}
            count={resultCount}
        /> : null}
    </TableContainer >
}

export default ReportTable;