import React, { useEffect } from 'react'
import { useAppDispatch } from '../store/storehook'
import { setFileConfig } from '../store/actions/httpactions';

/**
 * 
 * @param {Function} uploadFunc 
 * @param {Function} templateFunc 
 */
export const useFileConfig = (uploadFunc, templateFunc) => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(setFileConfig({ upload: (e) => uploadFunc(e.target.files[0]), template: templateFunc }));
        return () => {
            dispatch(setFileConfig({ upload: null, tempate: null }))
        }
    }, [uploadFunc, templateFunc])

}

