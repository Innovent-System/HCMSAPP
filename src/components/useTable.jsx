import React, { useCallback, useEffect, useState } from 'react'
import { Table, TableHead, TableRow, TableBody, TableCell, TablePagination, TableSortLabel, TableContainer, Paper } from '../deps/ui'

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
const groupedData = (data) => data.reduce((acc, curr) => {
    if (!acc[curr.employeeId]) {
        acc[curr.employeeId] = [];
    }
    acc[curr.employeeId].push(curr);
    return acc;
}, {});
/**
 * 
 * @param {Array<any>} records 
 * @param {Array<{id:string,disableSorting:boolean,label:string}>} headCells 
 * @param {Function} filterFn 
 * @returns 
 */
const pages = [30, 50, 100]
export default function useTable(data, headCells, filterFn, pagination = true) {

    const [records, setRecords] = useState([]);
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(pages[page])
    const [order, setOrder] = useState()
    const [orderBy, setOrderBy] = useState()

    useEffect(() => {
        if (data) {
            if (pagination)
                setRecords(data.slice(0 * rowsPerPage, (0 + 1) * rowsPerPage));
            else setRecords(data)

            setPage(0);
        }

    }, [data])

    const TblContainer = useCallback(props => (
        <TableContainer sx={{ px: 1, overflow: 'auto' }} >
            <Table sx={Styles.table}>
                {props.children}
            </Table>
        </TableContainer>
    ), []);


    const TblHead = useCallback(props => {

        const handleSortRequest = cellId => {
            const isAsc = orderBy === cellId && order === "asc";
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(cellId)
        }

        return (<TableHead>
            <TableRow>
                {
                    headCells.map(headCell => (
                        <TableCell key={headCell.id}
                            sortDirection={orderBy === headCell.id ? order : false}>
                            {headCell.disableSorting ? headCell.label :
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : 'asc'}
                                    onClick={() => { handleSortRequest(headCell.id) }}>
                                    {headCell.label}
                                </TableSortLabel>
                            }
                        </TableCell>))
                }
            </TableRow>
        </TableHead>)
    }, [])

    const TblBody = useCallback((props) => {

        const cols = records.length ? headCells.filter(f => Object.keys(records[0]).includes(f.id)) : [];
        return (<TableBody >
            {records.map((row) => (
                <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    {cols.map((_key, index) =>
                        <TableCell key={'cell-' + index} sx={{ paddingLeft: 4 }} >{typeof _key?.valueGetter === "function" ? _key?.valueGetter({ row }) : row[_key.id]}</TableCell>
                    )
                    }
                </TableRow>
            ))}
        </TableBody>)
    }
        , [records])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        setRecords(data.slice(newPage * rowsPerPage, (newPage + 1) * rowsPerPage));
    }

    const handleChangeRowsPerPage = event => {
        const per = parseInt(event.target.value, 10);
        setRowsPerPage(per)
        setPage(0);
        setRecords(data.slice(0 * per, (0 + 1) * per));
    }

    const TblPagination = () => (<TablePagination
        component="div"
        page={page}
        rowsPerPageOptions={pages}
        rowsPerPage={rowsPerPage}
        count={data?.length}
        onPageChange={handleChangePage}
        // onChangePage={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
    />)

    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    const recordsAfterPagingAndSorting = () => {
        return stableSort(filterFn.fn(records), getComparator(order, orderBy))
            .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    }

    return {
        TblContainer,
        TblHead,
        TblBody,
        TblPagination,
        recordsAfterPagingAndSorting
    }
}


const ReportTable = ({ data, headCells, options = { isPageBreak: false, pageBreakOn: "" } }) => {
    const [records, setRecords] = useState([]);
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(pages[page])
    const [order, setOrder] = useState()
    const [orderBy, setOrderBy] = useState()
    const { isPageBreak } = options;

    useEffect(() => {
        if (data) {
            if (pagination)
                setRecords(data.slice(page * rowsPerPage, (page + 1) * rowsPerPage));
            else setRecords(data)
        }

    }, [data])

    return (
        <TableContainer>
            {records.map((rec, i) => {

                <TableHead>
                    <TableRow>
                        {
                            headCells.map(headCell => (
                                <TableCell key={headCell.id}
                                    sortDirection={orderBy === headCell.id ? order : false}>
                                    {headCell.disableSorting ? headCell.label :
                                        <TableSortLabel
                                            active={orderBy === headCell.id}
                                            direction={orderBy === headCell.id ? order : 'asc'}
                                            onClick={() => { handleSortRequest(headCell.id) }}>
                                            {headCell.label}
                                        </TableSortLabel>
                                    }
                                </TableCell>))
                        }
                    </TableRow>
                </TableHead>

            })}

        </TableContainer>
    )

}