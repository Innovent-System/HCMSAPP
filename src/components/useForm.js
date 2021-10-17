import React, {  useEffect, useRef, useState } from 'react'
import { makeStyles, Grid } from "@material-ui/core";
import clsx from 'clsx';
import { Element,ElementType } from '../components/controls/Controls';
import PropTypes from 'prop-types'

export function useForm(initialFValues, validateOnChange = false, validate) {

    const [values, setValues] = useState(initialFValues);
    const [errors, setErrors] = useState({});

    const handleInputChange = e => {
        const { name, value } = e.target

        setValues({
            ...values,
            [name]: value
        })
        if (validateOnChange)
            validate({ [name]: value })
    }
     
    const resetForm = () => {
        setValues(initialFValues);
        setErrors({})
    }


    return {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    }
}


const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiFormControl-root': {
            width: '80%',
            margin: theme.spacing(1)
        }
    }
}))

export function Form(props) {

    const classes = useStyles();
    const { children, ...other } = props;

    return (
        <form className={classes.root} autoComplete="off" {...other}>
            {children}
        </form>
    )
}

export function AutoForm(props) {

    const classes = useStyles();
    const { formData, children,isValidate = false, ...other } = props;
    const formStates = useRef({
        formValue: null,
        errorProps: []
    });
    const { errorProps } = formStates.current;

    useEffect(() => {

        formStates.current.formValue = formData.reduce((obj, item) => {
            if ("register" in item) {
                errorProps.push({
                    [item.name]: "",
                    validate: item.register?.validate,
                    message: item.register.errorMessage,
                    type:item.register.type
                })
            }
            const value = item.defaultValue;
            delete item.defaultValue;
            return Object.assign(obj, { [item.name]: value })
        }, {});
        setValues(formStates.current.formValue)
    }, [formData])

    const validateFields = (fieldValues = errorProps) => {
        let temp = { ...errors }, singleField = null;  

        if (!Array.isArray(fieldValues)) {
            const key = Object.keys(fieldValues)[0];
            singleField = fieldValues[key];
            fieldValues = errorProps.filter(f => key in f);
        }
        for (const errorItem of fieldValues) {
            const key = Object.keys(errorItem)[0], itemValue = singleField ?? values[key];
            switch (errorItem.type) {
                case "string":
                    if (itemValue)
                        temp[key] = "";
                    else
                        temp[key] = typeof errorItem?.validate === "function" ? (!errorItem.validate(itemValue) && errorItem.message) : errorItem.message;
                    break;

                //    default:
                //     temp[key] = typeof errorItem.validate === "function" ? (!errorItem.validate(itemValue) && errorItem.message):  errorItem.message;
                //        break;
            }
        }





        setErrors({
            ...temp,
        });

        return Object.values(temp).every((x) => x == "");
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(formStates.current.formValue, isValidate, validateFields);

    return (
        <form className={classes.root} autoComplete="off" {...other}>
            <Grid container>
                {formStates.current.formValue && formData.map(({ name, label, elementType, classes, ...others }, index) => (
                    <Grid key={index} xs={6} item>
                        <Element elementType={elementType}
                            name={name}
                            label={label}
                            value={values[name]}
                            onChange={handleInputChange}
                            {...(errors[name] && { error: errors[name] })}
                            {...(classes && { className: clsx(classes) })}
                            {...others}
                        />
                    </Grid>))
                }
                {children}
            </Grid>
        </form>
    )
}


AutoForm.propTypes = {
    formData:PropTypes.arrayOf(
        PropTypes.shape({
            elementType: PropTypes.oneOf(ElementType).isRequired,
            name:  PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            defaultValue :PropTypes.any,
            [PropTypes.string]:PropTypes.any
        })
    ).isRequired,
    isValidate:PropTypes.bool,
}
