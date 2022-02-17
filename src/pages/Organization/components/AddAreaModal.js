import React, { useEffect, useState } from "react";
import { Grid } from "../../../deps/ui";
import Controls from "../../../components/controls/Controls";
import { Form } from "../../../components/useForm";
import PropTypes from 'prop-types'
import { API } from '../_Service';
import { AutoForm } from '../../../components/useForm';
import { handlePostActions } from '../../../store/actions/httpactions';
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux';
import { Box } from '../../../deps/ui';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    root: {
        '&.root': {
            height: 100,
        },
    }
});
export default function AddCountryModal(props) {
    const formRef = React.useRef(null);
    const [Cities, setCity] = useState([]);
    const dispatch = useDispatch();
    const DropDownData = useSelector(e => e.app.DropDownData);

    useEffect(() => {
        debugger;
        if (DropDownData)
            setCity(DropDownData.Cities);
    }, [DropDownData]);

    const handleSubmit = (e) => {
        const { getValue, validateFields } = formRef.current
        const values = getValue();
        if (validateFields()) {
            dispatch(handlePostActions(API.INSERT_COUNTRY, values)).then(res => {
                console.log(res);
            });
        }
    }
    const formData = [
        {
            elementType: "ad_dropdown",
            name: "fkCityId",
            label: "City",
            required: true,
            validate: {
                errorMessage: "City is required",
            },
            dataName: 'name',
            options: Cities,
            defaultValue: Cities?.length ? Cities[0] : null
        }, {
            elementType: "inputfield",
            name: "area",
            label: "Area Name",
            required: true,
            type: 'text',
            validate: {
                errorMessage: "Area name is required",
            },
            defaultValue: ""
        },
    ];
    const classes = useStyles();
    return (
        <>
            <Box sx={classes.root}>
                <Form onSubmit={handleSubmit}>
                    <Grid container>
                        <Grid item xs={6}>
                            <AutoForm formData={formData} ref={formRef} isValidate={true} />
                            <Controls.Button type="submit" text="Submit" />
                        </Grid>
                    </Grid>
                </Form>
            </Box>
        </>
    );
}

AddCountryModal.propTypes = {
    addOrEdit: PropTypes.func,
    recordForEdit: PropTypes.object
}