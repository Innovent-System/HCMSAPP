import React from 'react'
import { Box, Tooltip } from '../deps/ui'
import { InfoSharp } from '../deps/ui/icons'

const InfoToolTip = ({ title, placement = "top" }) => {
    return (
        <Box position="absolute" top={0} right={0}><Tooltip title={title} placement={placement}><InfoSharp fontSize="small" /></Tooltip></Box>
    )
}

export default InfoToolTip