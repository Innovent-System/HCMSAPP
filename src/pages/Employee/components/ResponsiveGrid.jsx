import React from 'react';
import { Grid } from 'react-window';
import { useTheme, useMediaQuery } from '@mui/material';
import EmployeeCard from './EmployeeCard';


function Cell({ data, columnIndex, rowIndex, style, columnCount, handleEdit, handleActive, ...th }) {
    const index = (rowIndex * columnCount) + columnIndex;
    const employee = data[index];
    return (
        employee && (
            <div style={style}>
                <EmployeeCard handleEdit={handleEdit} handleActive={handleActive} employeeInfo={employee} />
            </div>
        )
    );
}
const ResponsiveEmployeeGrid = ({ data, totalRecord = 0, handleEdit, handleActive, setGridFilter }) => {
    const theme = useTheme();

    // Use Media Queries to determine screen size
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Mobile screen
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // Tablet screen
    const isLaptop = useMediaQuery(theme.breakpoints.up('md')); // Laptop and larger screens
    const isLarge = useMediaQuery(theme.breakpoints.up('xl')); // Laptop and larger screens

    // Calculate column count and column width based on screen size
    const columnCount = isMobile ? 1 : isTablet ? 2 : isLarge ? 5 : 4; // 1 for mobile, 2 for tablet, 4 for laptop+
    const columnWidth = isMobile ? 360 : isTablet ? 400 : 375; // Adjust widths for each screen size
    const gridHeight = isMobile ? 550 : isLarge ? 700 : 500;

    const rowCount = Math.ceil(data.length / columnCount); // Calculate rows based on total items and columns
    const handleScroll = ({ currentTarget }) => {

        const totalHeight = rowCount * 210; // Total content height
        const bottomReached = Math.floor(totalHeight - currentTarget.scrollTop) <= (isMobile ? gridHeight + 10 : gridHeight); // 100px threshold


        if (bottomReached && data.length < totalRecord) {
            setGridFilter(prev => {
                const rec = prev.startIndex + prev.limit;
                return { ...prev, startIndex: rec, isFromScroll: true }
            })
        }
    }


    return (
        <Grid

            columnCount={columnCount}
            cellComponent={Cell}
            cellProps={{ data, columnCount, handleEdit, handleActive }}
            rowCount={rowCount}
            columnWidth={columnWidth}
            rowHeight={210} // Fixed height for each row
            //width={isMobile ? 360 : columnCount * columnWidth} // Total grid width
           // height={gridHeight} // Total grid height
            style={{ height: gridHeight }}
            className='no-scroll-grid'
            overscanCount={3}
            onScroll={handleScroll} // Handle scroll event
        />


    );
};

export default ResponsiveEmployeeGrid;
