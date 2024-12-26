import { useCallback, useState, useEffect } from 'react'
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Pagination } from '../deps/ui'

//{ field: 'requestDate', headerName: 'Request Date', flex: 1 },
const TblHead = ({ cols = [] }) => (
    <TableHead>
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
        {cols.map((_key, index) =>
            <TableCell key={'cell-' + index} sx={{ paddingLeft: 4 }} >{typeof _key?.valueGetter === "function" ? _key?.valueGetter({ row }) : row[_key.field]}</TableCell>
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
    columnPrint = [], reportData = [] }) => {

    const [page, setPage] = useState(1)
    const [resultCount, setResultCount] = useState(0)
    const [records, setRecords] = useState([])
    const handlePage = (event, value) => {
        setRecords(reportData.filter(e => e.pageIndex == value))
        setPage(value);
    }

    useEffect(() => {

        if (pageBreak) {
            setRecords(reportData.filter(e => e.pageIndex === 1));
            setResultCount(reportData[reportData?.length - 1]?.pageIndex ?? 0);
        }
        else {
            setRecords(reportData.slice(page * ROW_PER_PAGE, (page + 1) * ROW_PER_PAGE));
            setResultCount(reportData.length);
        }


    }, [reportData])


    const generateReport = useCallback(() => {


        let elements = [];
        let preValue = '';
        let groupValue = '';
        let isFirst = true;

        const _count = records.length;

        for (let rowsLength = 0; rowsLength < _count; rowsLength++) {
            const row = records[rowsLength];
            const isNew = String(row[pageBreakOn]) !== String(preValue);
            const isNewGroup = String(row[groupByField]) !== String(groupValue);

            if (isFirst || isNewGroup) {
                if (HeadElement) elements.push(<HeadElement key={`headElement-${row.id}`} data={row} />)
                elements.push(<TblHead key={`head-${row.id}`} cols={columnPrint} />)

            }

            elements.push(<Row key={`row-${row.id}`} row={row} cols={columnPrint} />)

            if (groupByField && !isFirst && String(row[groupByField]) !== String(records[rowsLength == _count ? rowsLength : rowsLength + 1]?.[groupByField])) {
                GrandTotal && elements.push(<GrandTotal row={row} />);
                Summary && elements.push(<Summary row={row} {...(summaryProps && { ...summaryProps })} />);
            }

            if((_count - 1) === rowsLength) {
                GrandTotal && elements.push(<GrandTotal row={row} />);
                Summary && elements.push(<Summary row={row} {...(summaryProps && { ...summaryProps })} />);
            }   

            preValue = row[pageBreakOn];
            groupValue = row[groupByField];
            isFirst = false;
        }

        return elements;
    }, [records]);


    return <TableContainer>
        <Table sx={Styles.table}>
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