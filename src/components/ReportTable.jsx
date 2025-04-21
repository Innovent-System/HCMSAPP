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
        '& tr': {
            // '&:hover': {
            //     bgcolor: '#fffbf2',
            //     cursor: 'pointer',
            // },
            '&:nth-of-type(even)': {
                bgcolor: '#f2f2f2'
            }

        },
    }
}

const ROW_PER_PAGE = 30;
/**
 * ReportTable component for rendering tabular reports with optional grouping, subtotals, grand totals, and printing logic.
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.pageBreak=false] - Whether to insert page breaks in printed output.
 * @param {string} [props.pageBreakOn=''] - The field name on which to break the page (e.g., on group change).
 * @param {boolean} [props.isGroupBy=false] - Enables grouping of report data.
 * @param {Function|null} [props.groupByField=null] - Function to extract group key from a data item (used when isGroupBy is true).
 * @param {boolean} [props.isPrintHeader=true] - Whether to print the header row in each page/group.
 * @param {React.ElementType} props.HeadElement - The component used to render the table header.
 * @param {React.ElementType|null} [props.Summary=null] - Optional summary component to render after data.
 * @param {Object|null} [props.summaryProps=null] - Props to pass into the Summary component.
 * @param {Object} [props.grandTotal] - Configuration for rendering grand total.
 * @param {React.ElementType|null} [props.grandTotal.Element=null] - Component to render grand total row.
 * @param {Object} [props.grandTotal.fields={}] - Object defining which fields to include in grand total calculation.
 * @param {boolean} [props.grandTotal.isShow=false] - Whether to show grand total row.
 * @param {string} [props.grandTotal.parentPath=""] - Path to access nested fields (if needed).
 * @param {Object} [props.grandTotal.props={}] - Extra props passed to the grand total component.
 * @param {Object} [props.subTotal] - Configuration for rendering subtotal per group.
 * @param {React.ElementType|null} [props.subTotal.Element=null] - Component to render subtotal row.
 * @param {Object} [props.subTotal.fields={}] - Object defining which fields to include in subtotal calculation.
 * @param {boolean} [props.subTotal.isShow=false] - Whether to show subtotal per group.
 * @param {string} [props.subTotal.parentPath=""] - Path to access nested fields (if needed).
 * @param {Object} [props.subTotal.props={}] - Extra props passed to the subtotal component.
 * @param {string[]} [props.columnPrint=[]] - Array of column keys to include in print view.
 * @param {Object[]} [props.reportData=[]] - The array of data to be rendered in the report table.
 */

const ReportTable = ({ pageBreak = false,
    pageBreakOn = '',
    isGroupBy = false,
    groupByField = null,// should function
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
        let preValue = '';
        let groupValue = null;
        let isFirst = true;

        const _count = records.length;
        const _subTotal = (groupByField && subTotal.isShow) ? Object.keys(subTotal.fields).reduce((pre, curr) => {
            pre[curr] = 0;
            return pre;
        }, {}) : null;


        for (let rowsLength = 0; rowsLength < _count; rowsLength++) {
            const row = records[rowsLength];
            const isNew = String(row[pageBreakOn]) !== String(preValue);
            const isNewGroup = String(typeof groupByField == "function" ? groupByField(row) : null) !== String(groupValue);

            _subTotal && Object.keys(_subTotal).forEach(e => _subTotal[e] += (subTotal.parentPath ? row[subTotal.parentPath][e] : row[e] ?? 0));
            // grandTotalSum.current && Object.keys(grandTotalSum.current).forEach(e => grandTotalSum.current[e] += (grandTotal.parentPath ? row[grandTotal.parentPath][e] : row[e] ?? 0));
            if (isFirst || isNewGroup) {
                if (HeadElement) elements.push(<HeadElement key={`headElement-${row._id}`} row={row} />);

                elements.push(<TblHead key={`head-${row._id}`} cols={columnPrint} />);
            }

            elements.push(<Row key={`row-${row._id}`} row={row} cols={columnPrint} />)

            if (groupByField && String(groupByField(row)) !== String(groupByField(records[rowsLength == _count ? rowsLength : rowsLength + 1]))) {
                // GrandTotal && elements.push(<GrandTotal key={`grand-${groupByField}-${row._id}`} row={row} {...(grandTotalProps && { ...grandTotalProps })} />);
                // Summary && elements.push(<Summary key={`summary-${groupByField}-${row._id}`} row={row} {...(summaryProps && { ...summaryProps })} />);
                subTotal?.Element && elements.push(<subTotal.Element key={`subtotal-${groupByField(row)}-${row._id}`} row={row} subTotal={{ ..._subTotal }} />);
                _subTotal && Object.keys(_subTotal).forEach(e => _subTotal[e] = 0);
            }

            if ((_count - 1) === rowsLength && isLastPage.current) {
                grandTotal?.Element && elements.push(<grandTotal.Element key={`grand-${row._id}`} row={row} grandTotal={grandTotalSum.current} {...(grandTotal?.props && { ...grandTotal?.props })} />);
                Summary && elements.push(<Summary key={`summary-${row._id}`} row={row} {...(summaryProps && { ...summaryProps })} />);
            }


        preValue = row[pageBreakOn];
            groupValue = typeof groupByField == "function" ? groupByField(row) : null;
            isFirst = false;
        }

        return elements;
    }, [records]);


    return <TableContainer>
        {records.length ? <Pagination shape='rounded'
            sx={{ display: 'flex', justifyContent: 'center' }}
            page={page}
            onChange={handlePage}
            count={resultCount}
        /> : null}
        <Table sx={Styles.table} >
            {generateReport()}

        </Table>


    </TableContainer >
}

export default ReportTable;