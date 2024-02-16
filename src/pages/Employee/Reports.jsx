import React from 'react'
import { usePdf } from '../../hooks/usePdf'

const Reports = () => {
  const { designer } = usePdf();
  console.log(designer)
  return (
    <div>Reports</div>
  )
}

export default Reports