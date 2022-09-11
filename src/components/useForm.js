import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { makeStyles, Grid, Box } from "../deps/ui";
import clsx from 'clsx';
import { Element, ElementType } from '../components/controls/Controls';
import Loader from '../components/Circularloading';
import PropTypes from 'prop-types';
import { debounce } from '../util/common'

export function useForm(initialFValues, validateOnChange = false, validate) {

    const [values, setValues] = useState(initialFValues);
    const changeErrors = useRef({});
    const [errors, setErrors] = useState({});

    const handleInputChange = (e, exec) => {
        const { name, value } = e.target
        let _value = value;

        if (typeof _value === "string") {
            _value = _value.trimStart()
        }

        if (name.includes(".")) {
            const childe = name.split(".");
            setValues({
                ...values,
                [childe[0]]: { [childe[1]]: _value }
            })
            if (validateOnChange)
                changeErrors.current = { ...changeErrors.current, ...validate({ [childe[0]]: { [childe[1]]: _value } }) }
        }
        else {
            setValues({
                ...values,
                [name]: _value
            })
            typeof exec === "function" && exec(_value);
            if (validateOnChange)
                changeErrors.current = { ...changeErrors.current, ...validate({ [name]: _value }) }
        }

    }

    const resetError = () => {
        changeErrors.current = {};
        setErrors({});
    }
    const resetForm = () => {
        resetError();
        setValues(initialFValues);
    }

    return {
        values,
        setValues,
        changeErrors: changeErrors.current,
        errors,
        setErrors,
        resetError,
        handleInputChange,
        resetForm
    }
}

const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiFormControl-root': {
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
const validateAllFields = (fieldValues, values) => {
    let temp = {};
    if (!Array.isArray(fieldValues)) return temp;
    for (const errorItem of fieldValues) {

        const key = Object.keys(errorItem)[0], itemValue = values[key];
        if (errorItem.required) {
            if (typeof errorItem?.validate === "function") {
                temp[key] = !errorItem.validate(values) ? errorItem.message : itemValue ? "" : errorItem.message
            }
            else if (!isNaN(itemValue) && itemValue < 0)
                temp[key] = errorItem.message;
            else if (itemValue)
                temp[key] = "";
            else
                temp[key] = typeof errorItem?.validate === "function" ? (!errorItem.validate(values) && errorItem.message) : errorItem.message;

        }
        else {
            temp[key] = ""
        }

    }

    return temp;
}
const DEFAULT_BREAK_POINTS = { xs: 12, sm: 6, md: 6 };
export const AutoForm = forwardRef(function (props, ref) {

    const { formData, breakpoints, children, isValidate = false, isEdit = false, flexDirection = "row", as = "form", ...other } = props;
    const formStates = useRef({
        initialValues: {},
        errorProps: [],
    });
    const { errorProps, initialValues } = formStates.current;

    const validateField = (fieldValues = errorProps) => {

        let temp = {}, singleField = null;

        if (!typeof fieldValues === "object") return temp;

        const key = Object.keys(fieldValues)[0];
        singleField = { ...fieldValues };
        fieldValues = errorProps.find(f => key in f);

        if (!fieldValues?.required) { temp[key] = ""; return temp };
        if (typeof fieldValues?.validate === "function") {
            temp[key] = !fieldValues.validate(singleField) ? fieldValues.message : singleField[key] ? "" : fieldValues.message
        }
        else if (!isNaN(singleField[key]) && singleField[key] < 0)
            temp[key] = fieldValues.message;
        else if (singleField[key])
            temp[key] = "";
        else
            temp[key] = typeof fieldValues?.validate === "function" ? (!fieldValues.validate(singleField) && fieldValues.message) : fieldValues.message;


        return temp;
    };

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        changeErrors,
        resetError,
        resetForm
    } = useForm(initialValues, isValidate, validateField);


    useEffect(() => {
        // if(!isEdit && Object.keys(initialValues).length === Object.keys(values).length) return 
        for (const item of formData) {
            if ("Component" in item) {
                for (const childItem of item._children) {
                    if ("validate" in childItem) {
                        const exists = errorProps.findIndex(c => c[childItem.name] === "");
                        if (exists === -1)
                            errorProps.push({
                                [childItem.name]: "",
                                validate: childItem.validate?.validate,
                                message: childItem.validate.errorMessage,
                                required: typeof childItem["required"] === "function" ? childItem["required"] : true
                            })

                        delete childItem.validate;
                    }
                    const value = childItem.defaultValue;
                    delete childItem.defaultValue;
                    childItem.name && Object.assign(initialValues, { [childItem.name]: value })
                }
                continue;
            }

            if ("validate" in item) {
                const exists = errorProps.findIndex(c => c[item.name] === "");
                if (exists === -1)
                    errorProps.push({
                        [item.name]: "",
                        validate: item.validate?.validate,
                        message: item.validate.errorMessage,
                        required: typeof item["required"] === "function" ? item["required"] : true
                    })
                delete item.validate;
            }

            const value = item.defaultValue;
            delete item.defaultValue;
            item.name && Object.assign(initialValues, { [item.name]: value })
        }
        setValues(currentValues => {
            return Object.assign({}, initialValues, currentValues)
        });
    }, [formData])

    const setFormValue = (properties = {}) => {
        // if(!isEdit) return console.warn("set Values only in Edit mode");
        if (typeof properties !== 'object') return console.error("properties type must be object");
        resetError();
        setValues(currentValues => {
            return Object.assign({}, currentValues, properties)
        });
    }

    const validateFields = () => {
        const isValidate = validateAllFields(errorProps, values);
        setErrors(isValidate);
        return Object.values(isValidate).every((x) => x == "") || Object.keys(isValidate).length === 0;
    }
    const resetFormProps = () => {
        resetForm();
    }

    useImperativeHandle(ref, () => ({
        resetForm: resetFormProps,
        validateFields,
        setFormValue,
        initialValues,
        getValue() {
            return values
        }
    }));

    const handleConditionalField = (name, required) => {
        //Required Field ka kam krna yhn pe logic
        let isRequired = required;
        if (typeof required === "function") {
            isRequired = required(values);
            errorProps.find(f => name in f).required = isRequired;
        }
        return isRequired;
    }

    return (
        <Grid  {...breakpoints} {...other} flexDirection={flexDirection} gap={1} container>
            {Object.keys(initialValues).length ? formData.map(({ name, label, required, elementType, Component = null, disabled, classes, _children, breakpoints = DEFAULT_BREAK_POINTS, onChange, modal, defaultValue, ...others }, index) => (
                Component ? <Component {...others} key={index + name}>
                    <Grid spacing={3} container>
                        {Array.isArray(_children) ? _children.map(({ name, label, required, elementType, breakpoints = DEFAULT_BREAK_POINTS, classes, disabled, onChange, modal, _defaultValue, ..._others }, innerIndex) => (
                            <Grid {...(modal && { style: { position: "relative" } })}  {...(breakpoints && { ...breakpoints })} key={innerIndex} item>
                                {modal && <Box position="absolute" top={0} right={0}>{modal.Component}</Box>}
                                <Element key={innerIndex + name} elementType={elementType}
                                    name={name}
                                    label={label}
                                    {...(required && { required: handleConditionalField(name, required) })}
                                    value={values[name]}
                                    {...(disabled && { disabled: (typeof disabled === "function" ? disabled(values) : required) })}
                                    onChange={(e) => handleInputChange(e, onChange)}
                                    {...((changeErrors[name] || errors[name]) && { error: (changeErrors[name] || errors[name]) })}
                                    {...(classes && { className: clsx(classes) })}
                                    {..._others}
                                />
                            </Grid>

                        )) : null}
                    </Grid>
                </Component> :
                    <Grid {...(modal && { style: { position: "relative" } })} {...(breakpoints && { ...breakpoints })} key={index + name} item>
                        {modal && <>{modal.Component}</>}
                        <Element elementType={elementType}
                            name={name}
                            label={label}
                            value={values[name]}
                            {...(required && { required: handleConditionalField(name, required) })}
                            {...(disabled && { disabled: (typeof disabled === "function" ? disabled(values) : required) })}
                            onChange={(e) => handleInputChange(e, onChange)}
                            {...((changeErrors[name] || errors[name]) && { error: (changeErrors[name] || errors[name]) })}
                            {...(classes && { className: clsx(classes) })}
                            {...others}
                        />
                    </Grid>
            )) : <Loader />
            }
            {children}
        </Grid>
    )
})

AutoForm.defaultProps = {
    isEdit: false,
    flexDirection: "row"
}

AutoForm.propTypes = {
    formData: PropTypes.oneOfType([
        PropTypes.arrayOf(
            PropTypes.shape({
                elementType: PropTypes.oneOf(ElementType).isRequired,
                name: PropTypes.string,
                label: PropTypes.string,
                defaultValue: PropTypes.any,
                breakpoints: PropTypes.objectOf({
                    xs: PropTypes.number,
                    sm: PropTypes.number,
                    md: PropTypes.number,
                    lg: PropTypes.number,
                    xl: PropTypes.number
                }),
                sx: PropTypes.arrayOf(PropTypes.object),
                [PropTypes.string]: PropTypes.any
            })
        ),
        PropTypes.arrayOf(
            PropTypes.shape({
                Component: PropTypes.node,
                _children: PropTypes.arrayOf(
                    PropTypes.shape({
                        elementType: PropTypes.oneOf(ElementType).isRequired,
                        name: PropTypes.string,
                        label: PropTypes.string,
                        defaultValue: PropTypes.any,
                        breakpoints: PropTypes.shape({
                            xs: PropTypes.number,
                            sm: PropTypes.number,
                            md: PropTypes.number,
                            lg: PropTypes.number,
                            xl: PropTypes.number
                        }),
                        sx: PropTypes.arrayOf(PropTypes.object),
                        [PropTypes.string]: PropTypes.any
                    })
                ),
                [PropTypes.string]: PropTypes.any
            })
        )

    ]).isRequired,
    isValidate: PropTypes.bool,
    isEdit: PropTypes.bool.isRequired,
    sx: PropTypes.arrayOf(PropTypes.object),
    flexDirection: PropTypes.oneOf(["row", "row-reverse", "column", "column-reverse", "revert", "inherit", "initial", "-moz-initial"]),
    breakpoints: PropTypes.shape({
        xs: PropTypes.number, //extra-small: 0px
        sm: PropTypes.number, //small: 600px
        md: PropTypes.number, //medium: 900px
        lg: PropTypes.number, //large: 1200px
        xl: PropTypes.number  //extra-large: 1536px
    })
}
