import React from 'react'
import { LinearProgress, Backdrop } from '../deps/ui'
import CircularLoading from './Circularloading'
import { useAppSelector } from '../store/storehook'

/**
 * 
 * @prop {import('@mui/material').LinearProgressProps} Props  
 * @returns {JSX}
 */
function LinearLoader({ open = false }) {

    const isLoading = useAppSelector(e => e.appdata.isLoading);

    return <Backdrop sx={{ background: "transparent", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}><LinearProgress color='warning' sx={{ position: "absolute", top: 0, width: "100%" }} /></Backdrop>
}

export default LinearLoader