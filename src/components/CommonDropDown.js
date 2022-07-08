import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDropDown, DROPDOWN_PROPS, Name_MAP, filterTypes } from "./useDropDown";
import { AutoForm } from './useForm';
import { dropDownIdsAction } from '../store/actions/httpactions'
import { useSelector, useDispatch } from 'react-redux';

const bindDataIds = (data, matchWith) => {
    if (!data) return '';
    if (!Array.isArray(data)) {
        data = [data];
    }
    return data.map(e => e[matchWith]).join(",");
}

//ENable filters or or Ids Mapping COmponent base krni hai abhi

const setDropDownIds = (data, type, matchWith) => ({ [type + "Ids"]: bindDataIds(data, matchWith) })


function CommonDropDown({ isMultiple, showFilters, idset, setIdSet }) {
    const { filterType, setFilter, ...dropDown } = useDropDown();
    const dispatch = useDispatch();
    const formApi = React.useRef(null);

    const showFilter = useSelector(e => showFilters ?? e.appdata.showFilterProps);

    const handleDropDownIds = (data, type, matchWith) => {
        const setOfIds = setDropDownIds(data, type, "_id");
        // dispatch({ type: SET_COMMON_DD_IDS, payload: setOfIds })
        dispatch(dropDownIdsAction(setOfIds));
        if (typeof setIdSet === "function") setIdSet(setOfIds);
        setFilter(data, type, matchWith);
    }

    const handleResetFilter = () => {

        const { resetForm } = formApi.current;
        resetForm();
        setFilter(null, filterType.DEFAULT);
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
    showFilters: null
}
CommonDropDown.propTypes = {
    isMultiple: PropTypes.bool,
    showFilters: PropTypes.shape({
        [filterTypes.COMPANY]: PropTypes.bool,
        [filterTypes.COUNTRY]: PropTypes.bool,
        [filterTypes.STATE]: PropTypes.bool,
        [filterTypes.CITY]: PropTypes.bool,
        [filterTypes.AREA]: PropTypes.bool,
        [filterTypes.GROUP]: PropTypes.bool,
        [filterTypes.DEPARTMENT]: PropTypes.bool,
        [filterTypes.DESIGNATION]: PropTypes.bool,
    }),
    idSet: PropTypes.shape({
        countryIds: PropTypes.string,
        stateIds: PropTypes.string,
        cityIds: PropTypes.string,
        areaIds: PropTypes.string,
        groupIds: PropTypes.string,
        departmentIds: PropTypes.string,
        designationIds: PropTypes.string,
    }),
    setIdSet: PropTypes.func
}

export default CommonDropDown