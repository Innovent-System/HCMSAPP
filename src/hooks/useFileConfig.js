import React, { useEffect } from 'react'
import { useAppDispatch } from '../store/storehook'
import { setFileConfig } from '../store/actions/httpactions';

/**
 * 
 * @param {Function} uploadFunc 
 * @param {Function} templateFunc 
 * @param {Array} helpFiles 
 */
export const useFileConfig = (uploadFunc, templateFunc, helpFiles) => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(setFileConfig({ upload: (e) => uploadFunc(e.target.files[0]), template: templateFunc, helpFiles: helpFiles }));
        return () => {
            dispatch(setFileConfig({ upload: null, template: null, helpFiles: null }))
        }
    }, [uploadFunc, templateFunc, helpFiles]);

}

