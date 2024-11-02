import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { makeStyles, Grid } from "../deps/ui";
import clsx from 'clsx';
import { Element, ElementType } from './controls/Controls';
import Loader from './Circularloading';
import PropTypes from 'prop-types';

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
        setValues(structuredClone(initialFValues));
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
            else if (Array.isArray(itemValue) && !itemValue.length)
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

/**
 * @type {React.FC<import('../types/fromstype').FormProps>}
 */
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
        singleField = structuredClone(fieldValues);
        fieldValues = errorProps.find(f => key in f);

        if (!fieldValues?.required) { temp[key] = ""; return temp };
        if (typeof fieldValues?.validate === "function") {
            temp[key] = !fieldValues.validate(singleField) ? fieldValues.message : singleField[key] ? "" : fieldValues.message
        }
        else if (!isNaN(singleField[key]) && singleField[key] < 0)
            temp[key] = fieldValues.message;
        else if (Array.isArray(singleField[key]) && !singleField[key].length)
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
                                when: childItem.validate?.when,
                                required: typeof childItem["required"] === "function" ? childItem["required"] : true
                            })

                        delete childItem.validate;
                    }
                    if ("defaultValue" in childItem) {
                        const value = childItem.defaultValue;
                        delete childItem.defaultValue;
                        childItem.name && Object.assign(initialValues, { [childItem.name]: value })
                    }

                }
                continue;
            }

            if ("validate" in item) {
                const exists = errorProps.findIndex(c => c[item.name] === "");
                if (exists === -1)
                    errorProps.push({
                        [item.name]: "",
                        validate: item.validate?.validate,
                        when: item.validate?.when,
                        message: item.validate.errorMessage,
                        required: typeof item["required"] === "function" ? item["required"] : true
                    })
                delete item.validate;
            }
            if ("defaultValue" in item) {
                const value = item.defaultValue;
                delete item.defaultValue;
                item.name && Object.assign(initialValues, { [item.name]: value })
            }

        }
        setValues(currentValues => {
            return Object.assign({}, initialValues, currentValues)
        });
    }, [])
   
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
    const validateWhen = (when) => {
        if (!when && when !== 0) return;
        const validateData = validateAllFields(errorProps.filter(e => e.when === when), values);
        setErrors({ ...errors, ...validateData })
        return Object.values(validateData).every((x) => x == "") || Object.keys(validateData).length === 0;
    }

    useImperativeHandle(ref, () => ({
        resetForm: resetFormProps,
        validateFields,
        validateWhen,
        setFormValue,
        initialValues,
        getValue() {
            return values
        }
    }));
    const handleShowHide = (name, func) => {

        const isShow = func(values);

        const error = errorProps.find(f => name in f);
        if (error) error.required = isShow;
        return isShow;
    }
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
        <Grid  {...breakpoints} flexDirection={flexDirection} spacing={2} container {...other}>
            {Object.keys(initialValues).length ? formData.map(({ name, label, required, elementType, Component = null, disabled, classes, _children, breakpoints = DEFAULT_BREAK_POINTS, onChange, modal, defaultValue, isShow, ...others }, index) => (
                Component ? <Component {...others} key={index + "comp"}>
                    <Grid spacing={2} container>
                        {Array.isArray(_children) ? _children.map(({ name, label, required, elementType, breakpoints = DEFAULT_BREAK_POINTS, classes, disabled, onChange, modal, _defaultValue, ..._others }, innerIndex) => (
                            <Grid {...(modal && { style: { position: "relative" } })}  {...(breakpoints && { ...breakpoints })} key={String(innerIndex) + (name ?? 'customFix')} item>
                                {modal && modal.Component}
                                <Element elementType={elementType}
                                    name={name}
                                    label={label}
                                    {...(required && { required: handleConditionalField(name, required) })}
                                    value={values[name]}
                                    {...(disabled && { disabled: (typeof disabled === "function" ? disabled(values) : disabled) })}
                                    onChange={(e) => handleInputChange(e, onChange)}
                                    {...((changeErrors[name] || errors[name]) && { error: (changeErrors[name] || errors[name]) })}
                                    {...(classes && { className: clsx(classes) })}
                                    {..._others}
                                />
                            </Grid>

                        )) : null}
                    </Grid>
                </Component> :
                    typeof isShow === "function" ? handleShowHide(name, isShow) && <Grid {...(modal && { style: { position: "relative" } })} {...(breakpoints && { ...breakpoints })} key={index + (name ?? 'customFix')} item>
                        {modal && modal.Component}
                        <Element key={"isShow" + index + name} elementType={elementType}
                            name={name}
                            label={label}
                            value={values[name]}
                            {...(required && { required: handleConditionalField(name, required) })}
                            {...(disabled && { disabled: (typeof disabled === "function" ? disabled(values) : disabled) })}
                            onChange={(e) => handleInputChange(e, onChange)}
                            {...((changeErrors[name] || errors[name]) && { error: (changeErrors[name] || errors[name]) })}
                            {...(classes && { className: clsx(classes) })}
                            {...others}
                        />
                    </Grid> : <Grid {...(modal && { style: { position: "relative" } })} {...(breakpoints && { ...breakpoints })} key={index + (name ?? 'customFix')} item>
                        {modal && modal.Component}

                        <Element key={index + name} elementType={elementType}
                            name={name}
                            label={label}
                            value={values[name]}
                            {...(required && { required: handleConditionalField(name, required) })}
                            {...(disabled && { disabled: (typeof disabled === "function" ? disabled(values) : disabled) })}
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
                sx: PropTypes.any,
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
                        sx: PropTypes.any,
                        [PropTypes.string]: PropTypes.any
                    })
                ),
                [PropTypes.string]: PropTypes.any
            })
        )

    ]).isRequired,
    isValidate: PropTypes.bool,
    isEdit: PropTypes.bool,
    sx: PropTypes.any,
    flexDirection: PropTypes.oneOf(["row", "row-reverse", "column", "column-reverse", "revert", "inherit", "initial", "-moz-initial"]),
    breakpoints: PropTypes.shape({
        xs: PropTypes.number, //extra-small: 0px
        sm: PropTypes.number, //small: 600px
        md: PropTypes.number, //medium: 900px
        lg: PropTypes.number, //large: 1200px
        xl: PropTypes.number  //extra-large: 1536px
    })
}
