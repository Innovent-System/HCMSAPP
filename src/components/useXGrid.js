import React from 'react'
import PropTypes from 'prop-types';
import { XGrid,GridToolbar,LicenseInfo } from '@material-ui/x-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';


LicenseInfo.setLicenseKey(
    '0f94d8b65161817ca5d7f7af8ac2f042T1JERVI6TVVJLVN0b3J5Ym9vayxFWFBJUlk9MTY1NDg1ODc1MzU1MCxLRVlWRVJTSU9OPTE=',
  );

 

 

export default function TableGrid () {

    const { loading, data, setRowLength, loadNewData } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 100,
        maxColumns: 20,
      });

      console.table(data);
    return (
        <div style={{height:600}} >
            <XGrid
            {...data}
            loading={false}
            components={{
                Toolbar: GridToolbar,
              }}
            rowHeight={38}
            checkboxSelection
        />
            
        </div>
    )

}

TableGrid.propTypes = {

}


