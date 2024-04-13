import React from 'react'
import CrudUI from '../../../../components/CrudUI'
import { API } from '../../_Service'

const fields = {
    name: {
        label: 'Employee Status',
        type: 'text',
        valueSources: ['value'],
        preferWidgets: ['text'],
    },
    createdAt: {
        label: 'Created Date',
        type: 'date',
        fieldSettings: {
            dateFormat: "D/M/YYYY",
            mongoFormatValue: val => ({ $date: new Date(val).toISOString() }),
        },
        valueSources: ['value'],
        preferWidgets: ['date'],
    },

    isActive: {
        label: 'Status',
        type: 'boolean',
        operators: ['equal'],
        valueSources: ['value'],
    },
}
const EmployeeStatus = () => {
    return (
        <CrudUI DEFAULT_API={API.EmployeeStatus}
            DEFAULT_NAME="Employee Status"
            fields={fields}
            socketName={`changeInEmployeeStatus`} />
    )
}

export default EmployeeStatus