import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle, useMemo } from 'react'
import { makeStyles, Grid } from "../deps/ui";
import clsx from 'clsx';
import { Element } from './controls/Controls';
import Loader from './Circularloading';
import PropTypes from 'prop-types';

function useArrayForm(initialFValues, validateOnChange = false, validate, onChange, fieldName) {

    const [values, setValues] = useState(initialFValues);
    const changeErrors = useRef([]);
    const [errors, setErrors] = useState([]);

    const handleInputChange = (e, _index, exec) => {
        const { name, value } = e.target
        let _value = value;

        if (typeof _value === "string") {
            _value = _value.trimStart()
        }
        values[_index][name] = _value
        setValues([
            ...values,
        ])
        onChange({ target: { name: fieldName, value: values } });
        typeof exec === "function" && exec(_value);
        if (validateOnChange) {
            changeErrors.current[_index] = { ...changeErrors.current[_index], ...validate({ [name]: _value }, _index) }

        }

    }

    const resetError = () => {
        changeErrors.current = [];
        setErrors([]);
    }
    const resetForm = () => {
        resetError();
        setValues([...initialFValues]);
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

/**
 * @type {React.FC<import('../types/fromstype').FormProps>}
 */
export const ArrayForm = forwardRef(function (props, ref) {


    const { formData, initialState, onChange, name, breakpoints, children, isValidate = false, isEdit = false, flexDirection = "row", as = "form", ...other } = props;
    const formStates = useRef({
        initialValues: [],
        errorProps: [],
    });

    const { errorProps, initialValues } = formStates.current;

    const validateField = (fieldValues = errorProps, _index) => {

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
    } = useArrayForm(initialValues, isValidate, validateField, onChange, name);


    useEffect(() => {
        // if(!isEdit && Object.keys(initialValues).length === Object.keys(values).length) return
        const valuesData = [];
        for (const state of initialState) {
            const pushObject = {};
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
                            childItem.name && Object.assign(pushObject, { [childItem.name]: state[childItem.name] })
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

                const value = item.defaultValue;
                delete item.defaultValue;
                item.name && Object.assign(pushObject, { [item.name]: state[item.name] })

            }
            // if (initialValues.length < initialState.length)
            valuesData.push(pushObject)

        }

        formStates.current.initialValues = valuesData;
        setValues([...formStates.current.initialValues]);


    }, [initialState])

    const setFormValue = (properties = []) => {
        // if(!isEdit) return console.warn("set Values only in Edit mode");
        if (!Array.isArray(properties)) return console.error("properties type must be an array");
        resetError();
        setValues(currentValues => {
            return [...currentValues, ...properties]
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
            {initialValues.length ? initialValues.map((_state, _stateIndex) => <>{
                formData.map(({ name, label, required, elementType, Component = null, disabled, classes, _children, breakpoints = DEFAULT_BREAK_POINTS, onChange, modal, defaultValue, isShow, ...others }, index) => (
                    Component ? <Component {...others} key={index + "comp" + _stateIndex}>
                        <Grid spacing={2} container>
                            {Array.isArray(_children) ? _children.map(({ name, label, required, elementType, breakpoints = DEFAULT_BREAK_POINTS, classes, disabled, onChange, modal, _defaultValue, ..._others }, innerIndex) => (
                                <Grid {...(modal && { style: { position: "relative" } })}  {...(breakpoints && { ...breakpoints })} key={String(innerIndex) + (name ?? 'customFix') + _stateIndex} item>
                                    {modal && modal.Component}
                                    <Element elementType={elementType}
                                        name={name}
                                        label={label}
                                        {...(required && { required: handleConditionalField(name, required) })}
                                        value={values[_stateIndex][name]}
                                        {...(disabled && { disabled: (typeof disabled === "function" ? disabled(values) : required) })}
                                        onChange={(e) => handleInputChange(e, _stateIndex, onChange)}
                                        {...((changeErrors[_stateIndex] || errors[_stateIndex]) && { error: (changeErrors[_stateIndex][name] || (errors[_stateIndex] && errors[_stateIndex][name])) })}
                                        {...(classes && { className: clsx(classes) })}
                                        {..._others}
                                    />
                                </Grid>

                            )) : null}
                        </Grid>
                    </Component> :
                        typeof isShow === "function" ? handleShowHide(name, isShow) && <Grid {...(modal && { style: { position: "relative" } })} {...(breakpoints && { ...breakpoints })} key={index + (name ?? 'customFix') + _stateIndex} item>
                            {modal && modal.Component}
                            <Element key={"isShow" + index + name + _stateIndex} elementType={elementType}
                                name={name}
                                label={label}
                                value={values[_stateIndex][name]}
                                {...(required && { required: handleConditionalField(name, required) })}
                                {...(disabled && { disabled: (typeof disabled === "function" ? disabled(values) : required) })}
                                onChange={(e) => handleInputChange(e, _stateIndex, onChange)}
                                {...((changeErrors[_stateIndex] || errors[_stateIndex]) && { error: (changeErrors[_stateIndex][name] || (errors[_stateIndex] && errors[_stateIndex][name])) })}
                                {...(classes && { className: clsx(classes) })}
                                {...others}
                            />
                        </Grid> : <Grid {...(modal && { style: { position: "relative" } })} {...(breakpoints && { ...breakpoints })} key={index + (name ?? 'customFix') + _stateIndex} item>
                            {modal && modal.Component}

                            <Element key={index + name + _stateIndex} elementType={elementType}
                                name={name}
                                label={label}
                                dataindex={_stateIndex}
                                value={values[_stateIndex][name]}
                                {...(required && { required: handleConditionalField(name, required) })}
                                {...(disabled && { disabled: (typeof disabled === "function" ? disabled(values) : required) })}
                                onChange={(e) => handleInputChange(e, _stateIndex, onChange)}
                                {...((changeErrors[_stateIndex] || errors[_stateIndex]) && { error: (changeErrors[_stateIndex][name] || (errors[_stateIndex] && errors[_stateIndex][name])) })}
                                {...(classes && { className: clsx(classes) })}
                                {...others}
                            />
                        </Grid>
                ))
            }</>) : <Loader />
            }
            {children}
        </Grid>
    )
})

ArrayForm.defaultProps = {
    isEdit: false,
    flexDirection: "row"
}

ArrayForm.propTypes = {
    formData: PropTypes.oneOfType([
        PropTypes.arrayOf(
            PropTypes.shape({
                elementType: PropTypes.string.isRequired,
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
                        elementType: PropTypes.string.isRequired,
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

ArrayForm.displayName = 'ArrayForm'
