import React from 'react'
import { LinearProgress } from '../deps/ui'

/**
 * 
 * @prop {import('@mui/material').LinearProgressProps} Props  
 * @returns {JSX}
 */
function LinearLoader({ open = false }) {
    return (
        open && <LinearProgress />
    )
}

export default LinearLoader