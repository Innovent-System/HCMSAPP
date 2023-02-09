import React, { useCallback, useState } from 'react'
import { Table, TableHead, TableRow, TableBody, TableCell, TablePagination, TableSortLabel, TableContainer, Paper } from '../deps/ui'

const Styles = {
    table: {
        mt: 3,
        '& thead th': {
            fontWeight: '600',
            color: 'primary.main',
            bgcolor: 'primary.light',
        },
        '& tbody td': {
            fontWeight: '300',
        },
        '& tbody tr:hover': {
            bgcolor: '#fffbf2',
            cursor: 'pointer',
        },
    }
}

/**
 * 
 * @param {Array<any>} records 
 * @param {Array<{id:string,disableSorting:boolean,label:string}>} headCells 
 * @param {Function} filterFn 
 * @returns 
 */
export default function useTable(records, headCells, filterFn) {



    const pages = [5, 10, 25]
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(pages[page])
    const [order, setOrder] = useState()
    const [orderBy, setOrderBy] = useState()

    const TblContainer = useCallback(props => (
        <TableContainer sx={{ px: 5 }} >
            <Table>
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
        return (<TableBody>
            {records.map((row) => (
                <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    {cols.map((_key, index) =>
                        <>
                            {index === 0 ? <TableCell component="th" scope="row">
                                {row[_key.id]}
                            </TableCell> : <TableCell sx={{ paddingLeft: 4 }} >{row[_key.id]}</TableCell>}
                        </>
                    )
                    }
                </TableRow>
            ))}
        </TableBody>)
    }
        , [records])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0);
    }

    const TblPagination = () => (<TablePagination
        component="div"
        page={page}
        rowsPerPageOptions={pages}
        rowsPerPage={rowsPerPage}
        count={records.length}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
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
