import React, { useEffect, useRef, useState,forwardRef,useImperativeHandle,useCallback } from 'react'
import { makeStyles, Grid } from "../deps/ui";
import clsx from 'clsx';
import { Element, ElementType } from '../components/controls/Controls';
import PropTypes from 'prop-types'
import {debounce} from '../util/common';

const INTERVAL = 250;
export function useForm(initialFValues, validateOnChange = false, validate) {

    const [values, setValues] = useState(initialFValues);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e,exec) => {
        const { name, value } = e.target
        let _value = value;

        if(typeof _value === "string"){
            _value =  _value.trimStart()
        }

        if (name.includes(".")) {
            const childe = name.split(".");
            setValues({
                ...values,
                [childe[0]]: { [childe[1]]: _value }
            })
            if (validateOnChange)
                validate({ [childe[0]]: { [childe[1]]: _value } })
        }
        else {
            setValues({
                ...values,
                [name]: _value
            })
            typeof exec === "function" && exec(_value); 
            if (validateOnChange)
                validate({ [name]: _value })
        }

         
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
            width: '90%',
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

const DEFAULT_BREAK_POINTS = { md: 2, xs: 6,xl:4 };
export const AutoForm = forwardRef(function (props,ref) {

    const classes = useStyles();
    const { formData, breakpoints, children, isValidate = false,isEdit = false, ...other } = props;
    const formStates = useRef({
        formValue: {},
        errorProps: []
    });
    const { errorProps,formValue } = formStates.current;

    const validateFields = useCallback(debounce((fieldValues = errorProps) => {
        let temp = { ...errors }, singleField = null;

        if (!Array.isArray(fieldValues)) {
            const key = Object.keys(fieldValues)[0];
            singleField = fieldValues[key];
            fieldValues = errorProps.filter(f => key in f);
        }
        for (const errorItem of fieldValues) {
            if(errorItem.required){
                const key = Object.keys(errorItem)[0], itemValue = singleField ?? values[key];

                if(typeof errorItem?.validate === "function"){
                    temp[key] = !errorItem.validate(itemValue) ? errorItem.message  : itemValue ? "" : errorItem.message 
                }
                else if (itemValue)
                    temp[key] = "";
                else
                    temp[key] = typeof errorItem?.validate === "function" ? (!errorItem.validate(itemValue) && errorItem.message) : errorItem.message;
            }
        }

        setErrors({
            ...temp,
        });

        return Object.values(temp).every((x) => x == "");
    },INTERVAL),[])

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(formValue, isValidate, validateFields);

    useEffect(() => {
        // if(!isEdit && Object.keys(formValue).length === Object.keys(values).length) return 
         formData.reduce((obj, item) => {
            if ("Component" in item) {
                 return item._children.reduce((o, childItem) => {
                    if ("validate" in childItem) {
                        errorProps.push({
                            [childItem.name]: "",
                            validate: childItem.validate?.validate,
                            message: childItem.validate.errorMessage,
                            required: true,
                            isOptional:(typeof childItem["required"] === "function" ? childItem["required"] : undefined)
                        })
                        delete childItem.validate;
                    }
                    const value = childItem.defaultValue;
                    delete childItem.defaultValue;
                    return Object.assign(formValue, { [childItem.name]: value })
                }, formValue)

            }
            
                if ("validate" in item) {
                    errorProps.push({
                        [item.name]: "",
                        validate: item.validate?.validate,
                        message: item.validate.errorMessage,
                        required: true,
                        isOptional:(typeof item["required"] === "function" ? item["required"] : undefined)
                    })
                
                  delete item.validate;
                }
                const value = item.defaultValue;
                delete item.defaultValue;
                return Object.assign(formValue, { [item.name]: value })
            

            
        }, formValue);
        Object.keys(formValue).forEach(key => formValue[key] === undefined && delete formValue[key])
        setValues(formValue);
    }, [])

    
    useImperativeHandle(ref, () => ({
        resetForm,
        getValue() {
            return values
        }
      }));

    useEffect(() => {
        if(typeof values === "object" && errorProps.filter(f => typeof f.isOptional === "function").length){   
            let errorTobeRemove = {};
            formStates.current.errorProps =  errorProps.map(m =>{
                if(typeof m.isOptional === "function"){
                    const isTrue = m.isOptional(values);
                    if(!isTrue){
                        Object.assign(errorTobeRemove,{[Object.keys(m)[0]]:""});
                    }
                    return {...m,required:isTrue}
                }
                else
                return {...m}
            });
            setErrors({...errors,...errorTobeRemove});
        }
    }, [values])

    return (
        <>
            <form className={classes.root} autoComplete="off" {...other}>
                <Grid {...breakpoints} container>
                    {Object.keys(formValue).length  && formData.map(({ name, label,required, elementType, Component = null, disabled , classes, _children, breakpoints = DEFAULT_BREAK_POINTS,onChange, ...others }, index) => (
                        Component ? <Component {...others} key={index}>
                            <Grid spacing={3} container>
                                {Array.isArray(_children) ? _children.map(({ name,label,required, elementType, breakpoints = DEFAULT_BREAK_POINTS, classes, disabled , onChange, ..._others }, innerIndex) => (
                                    <Grid  {...(breakpoints && { ...breakpoints })} key={innerIndex} item>
                                        <Element elementType={elementType}
                                            name={name}
                                            label={label}
                                            {...(required && {required:(typeof required === "function" ? required(values) : required)})}
                                            value={values[name]}
                                            {...(disabled && { disabled:(typeof disabled === "function" ? disabled(values) : required) })}
                                            onChange={(e) => handleInputChange(e,onChange)}
                                            {...(errors[name] && { error: errors[name] })}
                                            {...(classes && { className: clsx(classes) })}
                                            {..._others}
                                        />
                                    </Grid>

                                )) : null}
                            </Grid>
                        </Component> :
                            <Grid {...(breakpoints && { ...breakpoints })} key={index} item>
                                <Element elementType={elementType}
                                    name={name}
                                    label={label}
                                    value={values[name]}
                                    {...(required && {required:(typeof required === "function" ? required(values) : required)})}
                                    {...(disabled && { disabled:(typeof disabled === "function" ? disabled(values) : required) })}
                                    onChange={(e) => handleInputChange(e,onChange)}
                                    {...(errors[name] && { error: errors[name] })}
                                    {...(classes && { className: clsx(classes) })}
                                    {...others}
                                />
                            </Grid>
                    ))
                    }
                    {children}
                </Grid>
            </form>
        </>
    )
})

AutoForm.defaultProps = {
    isEdit:false
}

AutoForm.propTypes = {
    formData: PropTypes.oneOfType([
        PropTypes.arrayOf(
            PropTypes.shape({
                elementType: PropTypes.oneOf(ElementType),
                name: PropTypes.string,
                label: PropTypes.string,
                defaultValue: PropTypes.any,
                [PropTypes.string]: PropTypes.any
            }).isRequired
        ),
        PropTypes.arrayOf(
            PropTypes.shape({
                Component: PropTypes.node,
                _children: PropTypes.arrayOf(
                    PropTypes.shape({
                        elementType: PropTypes.oneOf(ElementType),
                        name: PropTypes.string,
                        label: PropTypes.string,
                        defaultValue: PropTypes.any,
                        [PropTypes.string]: PropTypes.any
                    })
                ),
                [PropTypes.string]: PropTypes.any
            }).isRequired
        )

    ]).isRequired,
    isValidate: PropTypes.bool,
    isEdit:PropTypes.bool.isRequired,
    breakpoints: PropTypes.objectOf({
        [PropTypes.string]: PropTypes.number.isRequired
    })
}
