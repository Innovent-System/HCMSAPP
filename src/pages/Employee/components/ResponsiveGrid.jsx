import React from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { useTheme, useMediaQuery } from '@mui/material';
import EmployeeCard from './EmployeeCard';

const ResponsiveEmployeeGrid = ({ data, totalRecord = 0, handleEdit, handleActive, setGridFilter }) => {
    const theme = useTheme();

    // Use Media Queries to determine screen size
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Mobile screen
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // Tablet screen
    const isLaptop = useMediaQuery(theme.breakpoints.up('md')); // Laptop and larger screens

    // Calculate column count and column width based on screen size
    const columnCount = isMobile ? 1 : isTablet ? 2 : 4; // 1 for mobile, 2 for tablet, 4 for laptop+
    const columnWidth = isMobile ? 360 : isTablet ? 400 : 375; // Adjust widths for each screen size
    const gridHeight = isMobile ? 550 : isLaptop ? 500 : 700;

    const rowCount = Math.ceil(data.length / columnCount); // Calculate rows based on total items and columns
    const handleScroll = ({ scrollTop }) => {
        const totalHeight = rowCount * 210; // Total content height
        const bottomReached = (totalHeight - scrollTop) <= (isMobile ? gridHeight + 10 : gridHeight); // 100px threshold
        console.log({ gridHeight, bottomReached })
        if (bottomReached && data.length < totalRecord) {
            setGridFilter(prev => {
                const rec = prev.startIndex + prev.limit;
                return { ...prev, startIndex: rec, isFromScroll: true }
            })
        }
    };

    return (
        <Grid
            columnCount={columnCount}
            rowCount={rowCount}
            columnWidth={columnWidth}
            rowHeight={210} // Fixed height for each row
            width={isMobile ? 360 : columnCount * columnWidth} // Total grid width
            height={gridHeight} // Total grid height
            className='no-scroll-grid'
            onScroll={handleScroll} // Handle scroll event
        >
            {({ columnIndex, rowIndex, style }) => {
                const index = rowIndex * columnCount + columnIndex;
                const employee = data[index];
                return (
                    employee && (
                        <div style={style}>
                            <EmployeeCard handleEdit={handleEdit} handleActive={handleActive} employeeInfo={employee} />
                        </div>
                    )
                );
            }}
        </Grid>
    );
};

export default ResponsiveEmployeeGrid;
