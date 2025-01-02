import React from 'react'
import Allowance from './Allowance'
import { API } from '../_Service'

const deductionTypes = [
    { id: "Other", title: "Other" },
    { id: "EOBI", title: "EOBI" },
    { id: "PF", title: "Provident Fund" },
    { id: "PESI", title: "PESI" },
    { id: "SESSI", title: "SESSI" }
]

const Deduction = () => {
    const form = [
        {
            elementType: "dropdown",
            name: "type",
            label: "Type",
            // breakpoints,
            dataId: "id",
            isNone: false,
            dataName: "title",
            defaultValue: "Other",
            options: deductionTypes
        },
    ]


    return <Allowance DEFAULT_API={API.Deduction} DEFAULT_NAME='Deduction' formProps={form} />
}

export default Deduction