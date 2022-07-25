import React, { useState, createRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import { Grid, Box, IconButton } from '../deps/ui'
import Controls, { Element, ElementType } from '../components/controls/Controls';
import { AutoForm } from '../components/useForm'
import { Circle, Add as AddIcon, Delete as DeleteIcon, RemoveCircleOutline } from "../deps/ui/icons";


//Array
Array.prototype.clone = function () {
    var arr = [];
    for (var i = 0; i < this.length; i++) {
        //      if( this[i].constructor == this.constructor ) {
        if (this[i].clone) {
            //recursion
            arr[i] = this[i].clone();
            break;
        }
        arr[i] = this[i];
    }
    return arr;
}
const BulkInsert = forwardRef(({ buttonName = "", as ="form", BulkformData = [[]] }, ref) => {

    const [bulkData, setBulkData] = useState(BulkformData);
    const [elRefs, setElRefs] = React.useState([]);

    const Add = () => {
        setBulkData([bulkData[0], ...bulkData]);
    }

    useEffect(() => {
        if (Array.isArray(BulkformData))
            setBulkData(BulkformData);
    }, [BulkformData.length])

    const deleteData = (index) => {
        bulkData.splice(index, 1);
        elRefs.splice(index, 1);
        setElRefs([...elRefs]);
        setBulkData([...bulkData]);
    }

    const hanldeArrayValue = () => {
        const setData = [];
        let isValid = false;
        for (const current of elRefs) {
            const { getValue, validateFields } = current.current;
            if (validateFields())
                setData.push(getValue());
            else {
                isValid = false;
                break;
            }
        }

        return { isValid, setData };
    }


    useImperativeHandle(ref, () => ({
        getFiledArray: hanldeArrayValue
    }));


    React.useEffect(() => {
        // add or remove refs
        setElRefs((elRefs) =>
            Array(bulkData.length)
                .fill()
                .map((_, i) => elRefs[i] || createRef()),
        );
    }, [bulkData.length]);

    return (<>
        <Controls.Button
            variant="text"
            text={buttonName}
            onClick={Add}
            startIcon={<AddIcon />}
        />
        {bulkData.map((data, i) => <Box key={i} width="100%" display="flex">
            <AutoForm as={as} style={{ flex: 1 }} formData={data.map(d => ({ ...d }))} ref={elRefs[i]} />
            <IconButton onClick={() => deleteData(i)} sx={{
                ml: 2
            }} color="warning" aria-label="delete">
                <RemoveCircleOutline />
            </IconButton>
        </Box>)}
    </>
    )
})



BulkInsert.propTypes = {
    BulkformData: PropTypes.arrayOf(PropTypes.array),
    dataRef: PropTypes.array,
}

export default BulkInsert