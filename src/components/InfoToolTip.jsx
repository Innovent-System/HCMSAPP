import React from 'react'
import { Box, Tooltip } from '../deps/ui'
import { InfoSharp } from '../deps/ui/icons'



/**
 * Assign the Data for Modify.
 * @typedef {import(@mui/material).BoxProps} others
 * @prop {import('@mui/material').TooltipProps} placement
 * @prop {string} title
 * @prop {"disabled" | "action" | "inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning"} color
 */
const InfoToolTip = ({ title, placement = "top", color = 'action', ...others }) => {
    return (
        <Box {...others}><Tooltip title={title} placement={placement}><InfoSharp color={color} fontSize="small" /></Tooltip></Box>
    )
}

export default InfoToolTip