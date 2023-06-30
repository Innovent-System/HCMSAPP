import React, { useRef } from 'react'
import { AutoForm } from '../../../components/useForm';
import { useDropDown } from '../../../components/useDropDown';
import Controls from '../../../components/controls/Controls';
import { setGeneralAction, useEntityAction } from '../../../store/actions/httpactions';
import { useSelector, useDispatch } from 'react-redux';
import { API } from '../_Service';

const Maritalstatus = [
    { id: "Single", title: "Single" },
    { id: "Married", title: "Married" },
    { id: "Widowed", title: "Widowed" },
    { id: "Divorced", title: "Divorced" },
]
const breakpoints = { md: 4, sm: 6, xs: 6 }
const genderItems = [
    { id: "Male", title: "Male" },
    { id: "Female", title: "Female" },
    { id: "Other", title: "Other" },
]
const Add_Employee = API.Employee;
const General = ({ isEdit = false, setTab }) => {
    const dispatch = useDispatch();
    const formApi = useRef(null);
    const { employees, religion } = useDropDown();
    const generalData = useSelector(s => s.employee.generalTab);
    const { addEntity } = useEntityAction();

    const formData = [
        {
            elementType: "uploadavatar",
            name: "employeeImage",
            breakpoints: { md: 12, sm: 12, xs: 12 },
            defaultValue: null
        },
        {
            elementType: "inputfield",
            name: "prefix",
            label: "Prefix",
            breakpoints,
            defaultValue: ""
        },
        {
            elementType: "inputfield",
            name: "emplyeeRefNo",
            label: "Employee Code",
            required: true,
            type: 'number',
            breakpoints,
            validate: {
                when: 0,
                errorMessage: "Employee Ref is required",
            },
            defaultValue: ""
        },
        {
            elementType: "inputfield",
            name: "punchCode",
            label: "Punch Code",
            required: true,
            type: 'number',
            breakpoints,
            validate: {
                when: 0,
                errorMessage: "Punch Code is required"
            },
            defaultValue: ""
        },
        {
            elementType: "inputfield",
            name: "firstName",
            label: "First Name",
            required: true,
            breakpoints,
            validate: {
                when: 0,
                errorMessage: "First Name is required",
            },
            defaultValue: ""
        },
        {
            elementType: "inputfield",
            name: "lastName",
            label: "Last Name",
            breakpoints,
            required: true,
            validate: {
                errorMessage: "Last Name is required",
                type: "string"
            },
            defaultValue: ""
        },
        {
            elementType: "inputfield",
            name: "fName",
            label: "Father/Husband Name",
            breakpoints,
            defaultValue: ""
        },
        {
            elementType: "ad_dropdown",
            name: "fkManagerId",
            label: "Reports To",
            breakpoints,
            dataName: 'fullName',
            dataId: '_id',
            options: employees,
            defaultValue: null
        },
        // {
        //   elementType: "clearfix",
        //   breakpoints: { md: 12, sm: 12, xs: 12 }
        // },
        {
            elementType: "dropdown",
            name: "maritalstatus",
            label: "Marital Status",
            breakpoints,
            dataId: "id",
            dataName: "title",
            defaultValue: "Single",
            options: Maritalstatus
        },
        {
            elementType: "dropdown",
            name: "gender",
            label: "Gender",
            breakpoints,
            dataId: "id",
            dataName: "title",
            defaultValue: "Male",
            options: genderItems
        },
        {
            elementType: "dropdown",
            name: "fkReligionId",
            label: "Religion",
            breakpoints,
            dataId: "_id",
            dataName: "name",
            defaultValue: "",
            options: religion
        },
        {
            elementType: "datetimepicker",
            name: "dateofBirth",
            breakpoints,
            label: "D.O.B",
            defaultValue: null
        },
        {
            elementType: "checkbox",
            name: "isAllowLogin",
            breakpoints: { md: 12, sm: 12, xs: 12 },
            label: "Allow Login",
            defaultValue: false,
        },
        {
            elementType: "inputfield",
            name: "email",
            label: "Email",
            breakpoints,
            required: (value) => value["isAllowLogin"],
            type: "email",
            validate: {
                when: 0,
                errorMessage: "Email is required",
                validate: (val) => /$^|.+@.+..+/.test(val.email)
            },
            defaultValue: ""
        },
        // {
        //     elementType: "dropdown",
        //     name: "fkRoleTemplateId",
        //     label: "User Template",
        //     breakpoints,
        //     dataId: "_id",
        //     dataName: "templateName",4
        //     disabled: (value) => value["isAllowLogin"] === false,
        //     defaultValue: "",
        //     options: roleTemplates?.length ? roleTemplates : []
        // },
    ];

    const handleNext = (e) => {

        const { getValue, validateFields } = formApi.current
        if (validateFields()) {
            setTab('1');
            const values = getValue();
            dispatch(setGeneralAction(
                {
                    emplyeeRefNo: values.emplyeeRefNo,
                    punchCode: values.punchCode,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    isAllowLogin: values.isAllowLogin,
                    //timezone: values.fkCountryId.timezones[0].zoneName,
                    //fkCompanyId: values.fkCompanyId._id,
                    generalInfo: {
                        maritalstatus: values.maritalstatus,
                        email: values.email,
                        gender: values.gender,
                        dateofBirth: values.dateofBirth,
                        fkReligionId: values.fkReligionId,
                    },
                }
            )).then(c => {
                console.log(c);
                addEntity({ url: Add_Employee, data: [generalData] });
            });

            // const setEmployee = mapEmployee(values);
            // if (isEdit)
            //     setEmployee._id = editId


        }
    }

    return <>
        <AutoForm formData={formData} ref={formApi} isValidate={true} />
        {/* <Divider sx={{ margin: 2 }} /> */}
        <Controls.Button onClick={handleNext} text="Next" />
    </>

}

export default General