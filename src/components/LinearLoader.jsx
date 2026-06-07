import React from 'react'
import { LinearProgress, Backdrop } from '../deps/ui'
import CircularLoading from './Circularloading'
import { useAppSelector } from '../store/storehook'

const sx = { position: "absolute", height: 8, top: 0, width: "100%" }
/**
 * 
 * @prop {import('@mui/material').LinearProgressProps} Props  
 * @returns {JSX}
 */
function LinearLoader({ open = false }) {

    const isLoading = useAppSelector(e => e.appdata.isLoading);

    return <Backdrop sx={{ background: "transparent", zIndex: (theme) => theme.zIndex.drawer + 110 }} open={isLoading}><LinearProgress color='info' sx={sx} /></Backdrop>
}

export default LinearLoader