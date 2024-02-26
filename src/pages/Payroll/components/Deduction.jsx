import React from 'react'
import Allowance from './Allowance'
import { API } from '../_Service'

const Deduction = () => {
    return <Allowance DEFAULT_API={API.Deduction} DEFAULT_NAME='Deduction' />
}

export default Deduction