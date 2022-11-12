import React from 'react'
import { Box, Tooltip } from '../deps/ui'
import { InfoSharp } from '../deps/ui/icons'
import { BoxProps } from '@mui/material'


/**
 * Assign the Data for Modify.
 * @param {BoxProps} data
 * @param {string} data.placement
 * @param {string} data.title
 */
const InfoToolTip = ({ title, placement = "top", ...others }) => {
    return (
        <Box {...others}><Tooltip title={title} placement={placement}><InfoSharp fontSize="small" /></Tooltip></Box>
    )
}

export default InfoToolTip