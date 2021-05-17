import React,{useEffect} from 'react'
import PropTypes from 'prop-types';
import { XGrid,GridToolbar,LicenseInfo,GridDensitySelector } from '@material-ui/x-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';



LicenseInfo.setLicenseKey(
    '0f94d8b65161817ca5d7f7af8ac2f042T1JERVI6TVVJLVN0b3J5Ym9vayxFWFBJUlk9MTY1NDg1ODc1MzU1MCxLRVlWRVJTSU9OPTE=',
  );

  const areEqual = (prevProps, nextProps) =>  (JSON.stringify(prevProps.rows) === JSON.stringify(nextProps.rows));
function TableGrid ({rows, columns,loader,...other}) {

 console.log("grid");
      
    return (
        <div >
            <XGrid
            {...other}
            pageSize={10} 
            rowsPerPageOptions={[10, 30, 50]} pagination
            autoHeight
            filterMode='server'
          //  {...data}
            rows={rows}
            columns={columns}
            loading={loader}
            components={{
                Toolbar: GridToolbar
              }}
            rowHeight={38}
            checkboxSelection
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

export default React.memo(TableGrid,areEqual);

