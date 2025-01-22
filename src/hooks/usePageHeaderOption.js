import React, { useEffect } from 'react'
import { useAppDispatch } from '../store/storehook'
import { setPageHeaderOption } from '../store/actions/httpactions';

/**
 * 
 * @param {Object} option 
 * @param {Function} option.apply
 */
const defaultProp = {
    apply: null
}
export const usePageHeaderOption = (option = defaultProp) => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(setPageHeaderOption({ apply: option.apply }));
        return () => {
            dispatch(setPageHeaderOption({ apply: null }))
        }
    }, [option])

}

