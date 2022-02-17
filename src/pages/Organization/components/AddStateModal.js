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
export default function AddCityModal(props) {
    const formRef = React.useRef(null);
    const [countries, setCountries] = useState([]);
    const dispatch = useDispatch();
    const DropDownData = useSelector(e => e.app.DropDownData);

    useEffect(() => {
        debugger;
        console.log(formRef);
    }, [formRef])

    useEffect(() => {
        if (DropDownData)
            setCountries(DropDownData.Countries);
    }, [DropDownData]);

    const handleSubmit = (e) => {
        debugger;
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
            elementType: "inputfield",
            name: "stateName",
            label: "State Name",
            validate: {
                errorMessage: "State Name is required",
            },
            defaultValue: "",
        },
        {
            elementType: "ad_dropdown",
            name: "fkCountryId",
            label: "Country",
            required: true,
            validate: {
                errorMessage: "Country is required",
            },
            dataName: 'name',
            options: countries,
            defaultValue: countries?.length ? countries[0] : null
        }

    ];
    const classes = useStyles();
    return (
        <>
            <Box sx={classes.root}>
                <Form onSubmit={handleSubmit}>
                    <Grid container>
                        <Grid item xs={6}>
                            <AutoForm formData={formData} ref={formRef.current} isValidate={true} />
                            <Controls.Button type="submit" text="Submit" />
                        </Grid>
                    </Grid>
                </Form>
            </Box>
        </>
    );
}

AddCityModal.propTypes = {
    addOrEdit: PropTypes.func,
    recordForEdit: PropTypes.object
}