import React, {  useEffect, useRef, useState,lazy,Suspense } from 'react'
import { makeStyles, Grid } from "@material-ui/core";
import clsx from 'clsx';
import { Element,ElementType } from '../components/controls/Controls';
import PropTypes from 'prop-types'
import CircularLoading from '../components/Circularloading'

export function useForm(initialFValues, validateOnChange = false, validate) {

    const [values, setValues] = useState(initialFValues);
    const [errors, setErrors] = useState({});

    const handleInputChange = e => {
        const { name, value } = e.target
        
        if(name.includes(".")){
            const childe = name.split(".");
            setValues({
                ...values,
                [childe[0]]: {[childe[1]]:value} 
            })
            if (validateOnChange)
                validate({ [childe[0]]: {[childe[1]]:value} })
        }
        else{
            setValues({
                ...values,
                [name]: value
            })
            if (validateOnChange)
                validate({ [name]: value })
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

// function DynamicLoader(Component) {

//     const LazyComponent = lazy(() => import(`@material-ui/core/${Component}`));
//     return (
//       <Suspense fallback={<CircularLoading />}>
//         <LazyComponent />
//       </Suspense>
//     );
//   }
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
            if("Component" in item){
                return item.fields.reduce((o,childItem)=> {
                    if ("validate" in childItem) {
                        errorProps.push({
                            [childItem.name]: "",
                            validate: childItem.validate?.validate,
                            message: childItem.validate.errorMessage,
                            type:childItem.validate.type
                        })

                        delete childItem.validate;
                    }
                    const value = childItem.defaultValue;
                    delete childItem.defaultValue;
                    return Object.assign(o, { [childItem.name]: value })
                },{})
                
            } 
            if ("validate" in item) {
                errorProps.push({
                    [item.name]: "",
                    validate: item.validate?.validate,
                    message: item.validate.errorMessage,
                    type:item.validate.type
                })

                delete item.validate;
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

            if (itemValue)
            temp[key] = "";
            else
            temp[key] = typeof errorItem?.validate === "function" ? (!errorItem.validate(itemValue) && errorItem.message) : errorItem.message;
            // switch (errorItem.type) {
            //     case "string":
            //         if (itemValue)
            //             temp[key] = "";
            //         else
            //             temp[key] = typeof errorItem?.validate === "function" ? (!errorItem.validate(itemValue) && errorItem.message) : errorItem.message;
            //         break;

            //     //    default:
            //     //     temp[key] = typeof errorItem.validate === "function" ? (!errorItem.validate(itemValue) && errorItem.message):  errorItem.message;
            //     //        break;
            // }
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
        <>
         <form className={classes.root} autoComplete="off" {...other}>
             <Grid  container>
                {formStates.current.formValue && formData.map(({ name, label, elementType,Component = null,condition = null, classes,fields = null, ...others }, index) => (
                   Component ? <Component {...(condition && {...condition})} key={index}>
                        <Grid  container>
                       {Array.isArray(fields) ? fields.map(({name,elementType ,label,classes,..._others},innerIndex) => (
                                <Grid xs={6} key={innerIndex}  item>
                                <Element elementType={elementType}
                                    name={name}
                                    label={label}
                                    value={values[name]}
                                    onChange={handleInputChange}
                                    {...(errors[name] && { error: errors[name] })}
                                    {...(classes && { className: clsx(classes) })}
                                    {..._others}
                                />
                            </Grid>

                       )):null}
                     </Grid>
                   </Component> :
                        <Grid xs={6} key={index} item>
                        <Element elementType={elementType}
                            name={name}
                            label={label}
                            value={values[name]}
                            onChange={handleInputChange}
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
}


AutoForm.propTypes = {
    formData:PropTypes.oneOfType([
        PropTypes.arrayOf(
            PropTypes.shape({
                elementType: PropTypes.oneOf(ElementType),
                name:  PropTypes.string,
                label: PropTypes.string,
                defaultValue :PropTypes.any,
                [PropTypes.string]:PropTypes.any
            }).isRequired
        ),
        PropTypes.arrayOf(
            PropTypes.shape({
                Component: PropTypes.node,
                fields:PropTypes.arrayOf(
                    PropTypes.shape({
                        elementType: PropTypes.oneOf(ElementType),
                        name:  PropTypes.string,
                        label: PropTypes.string,
                        defaultValue :PropTypes.any,
                        [PropTypes.string]:PropTypes.any
                    })
                ),
                [PropTypes.string]:PropTypes.any
            }).isRequired
        )

    ]).isRequired,
    isValidate:PropTypes.bool,
}
