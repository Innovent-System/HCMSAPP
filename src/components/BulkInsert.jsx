import React, { useState, createRef, useEffect, forwardRef, useImperativeHandle, useMemo, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import { Grid, IconButton, Stack } from '../deps/ui'
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
const BulkInsert = forwardRef(({ buttonName = "", as = "form", BulkformData = [[]] }, ref) => {

    const [bulkData, setBulkData] = useState(BulkformData);
    const [elRefs, setElRefs] = React.useState([]);
    const emptyData = useRef([]);
    const Add = () => {
        setBulkData([(bulkData[0] || emptyData.current), ...bulkData]);
    }

    useEffect(() => {
        if (BulkformData?.length)
            emptyData.current = [...BulkformData[0]]
    }, [])

    const deleteData = (index) => {
        bulkData.splice(index, 1);
        elRefs.splice(index, 1);
        setElRefs([...elRefs]);
        setBulkData([...bulkData]);
    }

    const hanldeArrayValue = () => {
        const dataSet = [];
        let isValid = true;
        for (const current of elRefs) {
            const { getValue, validateFields } = current.current;
            if (validateFields())
                dataSet.push(getValue());
            else {
                isValid = false;
                break;
            }
        }
        return { isValid, dataSet };
    }

    const resetForms = () => {
        for (const current of elRefs) {
            const { resetForm } = current.current;
            resetForm();
        }
    }

    useImperativeHandle(ref, () => ({
        getFieldArray: hanldeArrayValue,
        resetForms
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
        {bulkData.map((data, i) => <Stack key={i + "bulk"} flexDirection="row" pb={2}>
            <AutoForm as={as} key={i + "form-bulk"} formData={data?.map(d => ({ ...d }))} ref={elRefs[i]} />
            <IconButton onClick={() => deleteData(i)} sx={{
                ml: 2
            }} color="warning" aria-label="delete">
                <RemoveCircleOutline />
            </IconButton>
        </Stack>)}
    </>
    )
})


BulkInsert.propTypes = {
    BulkformData: PropTypes.arrayOf(PropTypes.array),
    dataRef: PropTypes.array,
}

export default BulkInsert