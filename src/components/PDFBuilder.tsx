import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Pagination,
  Box
} from '@mui/material';

interface Column<R> {
  field: string;
  headerName: string;
  valueGetter?: (row: R) => unknown;
}

interface IPDFOption<R> {
  reportTitle?: string;
  reportSubTitle?: string;
  userName?: string;
  pageBreak?: boolean;
  pageBreakOn?: string;
  groupby?: boolean;
  groupByField?: string;
  isPrintHeader?: boolean;
  htmlString?: (row: R) => string;
}

interface PDFTableProps<R> {
  option: IPDFOption<R>;
  data: R[];
  columns: Column<R>[];
  itemsPerPage: number; // The number of items to display per page
}

const PDFBuilderTable = <R,>({ option, data, columns, itemsPerPage }: PDFTableProps<R>) => {
  const [page, setPage] = useState(1); // Current page (1-based index)

  // Handle page change for pagination
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Calculate the start and end index for the current page
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  // Generate table content
  const generateTableContent = () => {
    const { pageBreak = false, pageBreakOn, groupby, groupByField, isPrintHeader = true, htmlString } = option;
    let groupValue = '';
    let preValue = '';
    const rowsLength = paginatedData.length;
    let tableRows = [];

    let isFirst = true;

    for (let i = 0; i < rowsLength; i++) {
      const row = paginatedData[i];
      const isNew = pageBreakOn && String(row[pageBreakOn]) !== String(preValue);
      const isNewGroup = groupByField && String(row[groupByField]) !== String(groupValue);

      if (pageBreak && isNew) {
        if (htmlString) {
          tableRows.push(htmlString(row));
        }
        tableRows.push(<Table key={i} style={{ pageBreakAfter: 'always' }} />);
      } else if (isFirst || (groupby && isNewGroup)) {
        if (htmlString) {
          tableRows.push(htmlString(row));
        }
        tableRows.push(<Table key={i} />);
      }

      if (isFirst || pageBreak && isNew) {
        if (isPrintHeader) {
          tableRows.push(
            <TableHead key={`head-${i}`}>
              <TableRow>
                {columns.map((col, index) => (
                  <TableCell key={index} style={{ backgroundColor: '#3375c7', color: 'white', fontWeight: 'bold' }}>
                    {col.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
          );
        }
      }

      tableRows.push(
        <TableBody key={`body-${i}`}>
          <TableRow key={i}>
            {columns.map((col, index) => {
              const value = col.valueGetter ? col.valueGetter(row) : row[col.field];
              return (
                <TableCell key={index} style={{ padding: '8px', border: '1px solid #ddd', fontSize: '10px' }}>
                  {value}
                </TableCell>
              );
            })}
          </TableRow>
        </TableBody>
      );

      preValue = row[pageBreakOn!];
      groupValue = row[groupByField!];
      isFirst = false;
    }

    return tableRows;
  };

  return (
    <div>
      <div className="header">
        <p>Print By: {option.userName}</p>
        <p>Print Date: {new Date().toLocaleString('en-GB')}</p>
        <Typography variant="h4" style={{ textAlign: 'center' }}>
          {option.reportTitle}
        </Typography>
        <Typography variant="h6" style={{ textAlign: 'center' }}>
          {option.reportSubTitle}
        </Typography>
      </div>

      <TableContainer component={Paper}>
        {generateTableContent()}
      </TableContainer>

      {/* Pagination Component */}
      <Box display="flex" justifyContent="center" marginTop="20px">
        <Pagination
          count={Math.ceil(data.length / itemsPerPage)} // Total number of pages
          page={page} // Current page
          onChange={handlePageChange} // Page change handler
          color="primary" // Style for pagination
        />
      </Box>
    </div>
  );
};

export default PDFBuilderTable;
