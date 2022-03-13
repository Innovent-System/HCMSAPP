import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDropDown, DROPDOWN_PROPS, Name_MAP } from "./useDropDown";
import { AutoForm } from './useForm';
import { useSelector, useDispatch } from 'react-redux';
import { SET_COMMON_DD_IDS } from '../store/actions/types'

const bindDataIds = (data, matchWith) => {
    if (!data) return emptyString;
    if (!Array.isArray(data)) {
        data = [data];
    }
    return data.map(e => e[matchWith]).join(",");
}

//ENable filters or or Ids Mapping COmponent base krni hai abhi

const setDropDownIds = (data, type, matchWith) => ({ [type + "Ids"]: bindDataIds(data, matchWith) })


function CommonDropDown({ isMultiple, reset }) {
    const { filterType, setFilter, ...dropDown } = useDropDown();
    const dispatch = useDispatch();
    const formApi = React.useRef(null);

    const showFilter = useSelector(e => e.enableFilterReducer);
    useEffect(() => {
        if (reset) {
            const { resetForm } = formApi.current;
            resetForm();
            setFilter(null, filterType.DEFAULT)
        }

    }, [reset])

    const handleDropDownIds = (data, type, matchWith) => {
        dispatch({ type: SET_COMMON_DD_IDS, payload: setDropDownIds(data, type, "_id") })
        setFilter(data, type, matchWith);
    }

    const formData = useCallback(
        () => {
            return Object.keys(showFilter).filter(e => showFilter[e]).map(filter => (
                {
                    ...DROPDOWN_PROPS[filter],
                    options: dropDown[Name_MAP[filter]],
                    onChange: (data) => handleDropDownIds(data, filter, "id")
                }
            ))
        },
        [showFilter, dropDown],
    )

    return (
        <AutoForm formData={formData()} flexDirection="column" ref={formApi} isValidate={true} />
    )
}

CommonDropDown.defaultProps = {
    isMultiple: false,
    reset: false
}
CommonDropDown.propTypes = {
    isMultiple: PropTypes.bool,
    reset: PropTypes.bool
}

export default CommonDropDown