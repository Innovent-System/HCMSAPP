import React from 'react'
import PropTypes from 'prop-types';
import { XGrid,GridToolbar,LicenseInfo } from '@material-ui/x-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';


LicenseInfo.setLicenseKey(
    '0f94d8b65161817ca5d7f7af8ac2f042T1JERVI6TVVJLVN0b3J5Ym9vayxFWFBJUlk9MTY1NDg1ODc1MzU1MCxLRVlWRVJTSU9OPTE=',
  );

 
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 90,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.getValue('firstName') || ''} ${params.getValue('lastName') || ''}`,
    },
    { field: 'id', hide: true},
    { field: 'groupName', headerName: 'Group Name', width: 200 },
    { field: 'createdOn', headerName: 'Creted On', width: 200 },
    { field: 'createdBy', headerName: 'Created By', width: 130 },
    { field: 'modifiedBy', headerName: 'Modified By', width: 130 },
    { field: 'modifiedOn', headerName: 'ModifiedOn On', width: 130 },
    
  ];
  
  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ];
 

export default function TableGrid ({rows, columns ,loader,checkbox = false,...other}) {

  const { loading, data, setRowLength, loadNewData } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 20,
  });
      
      
    return (
        <div >
            <XGrid
            {...other}
            pageSize={10} rowsPerPageOptions={[10, 30, 50]} pagination
            autoHeight
            rows={rows}
            columns={columns}
            loading={loading}
            components={{
                Toolbar: GridToolbar,
              }}
            rowHeight={38}
            checkboxSelection={checkbox}
        />
            
        </div>
    )

}

TableGrid.propTypes = {
  columns:PropTypes.array.isRequired,
  rows:PropTypes.array.isRequired,
  
}


TableGrid.defaultProps = {
  loader:false,
  columns:[],
  rows:[]
}

