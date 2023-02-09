import React, { useCallback, useEffect, startTransition } from 'react'
import PropTypes from 'prop-types'
import { useDropDown, DROPDOWN_PROPS, Name_MAP, filterTypes } from "./useDropDown";
import { AutoForm } from './useForm';
import { dropDownIdsAction, resetAction, clearDropDownIdsAction } from '../store/actions/httpactions'
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


function CommonDropDown({ isMultiple, showFilters, idset, setIdSet, setProps }) {
    const { filterType, setFilter, ...dropDown } = useDropDown();
    const dispatch = useDispatch();
    const formApi = React.useRef(null);

    const showFilter = useSelector(e => showFilters ?? e.appdata.showFilterProps);

    const handleDropDownIds = (data, type, matchWith) => {
        startTransition(() => {
            const setOfIds = setDropDownIds(data, type, "_id");
            dispatch(dropDownIdsAction(setOfIds));
            if (typeof setIdSet === "function") setIdSet(setOfIds);
            if (["company", "area"].includes(type)) matchWith = "_id";
            setFilter(data, type, matchWith);
        })

    }

    const isReset = useSelector(e => e.appdata.isReset);

    useEffect(() => {
        if (isReset) {
            const { resetForm } = formApi.current;
            resetForm();
            dispatch(clearDropDownIdsAction);
            setFilter(null, filterType.DEFAULT);
            dispatch(resetAction(false));
        }
    }, [isReset])

    const formData = useCallback(
        () => {
            return Object.keys(showFilter).filter(e => showFilter[e]).map(filter => (
                {
                    ...DROPDOWN_PROPS[filter],
                    ...(setProps && setProps[filter]),
                    options: dropDown[Name_MAP[filter]],
                    onChange: (data) => handleDropDownIds(data, filter, "id")
                }
            ))
        },
        [showFilter, dropDown],
    )

    return <AutoForm formData={formData()} ref={formApi} />
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
        [filterTypes.EMPLOYEE]: PropTypes.bool,
    }),
    setProps: PropTypes.shape({
        [filterTypes.COMPANY]: PropTypes.object,
        [filterTypes.COUNTRY]: PropTypes.object,
        [filterTypes.STATE]: PropTypes.object,
        [filterTypes.CITY]: PropTypes.object,
        [filterTypes.AREA]: PropTypes.object,
        [filterTypes.GROUP]: PropTypes.object,
        [filterTypes.DEPARTMENT]: PropTypes.object,
        [filterTypes.DESIGNATION]: PropTypes.object,
        [filterTypes.EMPLOYEE]: PropTypes.object,
    }),
    idSet: PropTypes.shape({
        countryIds: PropTypes.string,
        stateIds: PropTypes.string,
        cityIds: PropTypes.string,
        areaIds: PropTypes.string,
        groupIds: PropTypes.string,
        departmentIds: PropTypes.string,
        designationIds: PropTypes.string,
        employeeIds: PropTypes.string,
    }),
    setIdSet: PropTypes.func
}

export default CommonDropDown