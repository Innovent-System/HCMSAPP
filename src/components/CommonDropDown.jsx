import React, { useCallback, useEffect, startTransition } from 'react'
import PropTypes from 'prop-types'
import { useDropDown, DROPDOWN_PROPS, Name_MAP, filterTypes } from "./useDropDown";
import { AutoForm } from './useForm';
import { dropDownIdsAction, resetAction, clearDropDownIdsAction } from '../store/actions/httpactions'
import { useAppDispatch, useAppSelector } from '../store/storehook';

const bindDataIds = (data, matchWith) => {
    if (!data) return '';
    if (!Array.isArray(data)) {
        data = [data];
    }
    return data.map(e => e[matchWith]).join(",");
}

//ENable filters or or Ids Mapping COmponent base krni hai abhi

const setDropDownIds = (data, type, matchWith) => ({ [type + "Ids"]: bindDataIds(data, matchWith) })

const DEFAULT_BREAK_POINTS = { xs: 12, sm: 6, md: 6 };

function CommonDropDown({ isMultiple = false, flexDirection = "row", breakpoints = DEFAULT_BREAK_POINTS, showFilters = null, idset, setIdSet, setProps }) {
    const { filterType, setFilter, ...dropDown } = useDropDown();
    const dispatch = useAppDispatch();
    const formApi = React.useRef(null);

    const showFilter = useAppSelector(e => showFilters ?? e.appdata.showFilterProps);

    const handleDropDownIds = (data, type, matchWith) => {
        startTransition(() => {
            const isMonthYear = ['year', 'month'].includes(type);
            const setOfIds = setDropDownIds(data, type, isMonthYear ? 'id' : "_id");
            dispatch(dropDownIdsAction(setOfIds));
            if (typeof setIdSet === "function") setIdSet({ ...idset, ...setOfIds });
            if (!isMonthYear) {
                if (["company", "area", 'department', 'group', 'designation'].includes(type)) matchWith = "_id";
                setFilter(data, type, matchWith);
            }

        })

    }

    const isReset = useAppSelector(e => e.appdata.isReset);

    useEffect(() => {
        if (isReset) {
            resetForm();
            const { resetForm } = formApi.current;
            dispatch(clearDropDownIdsAction());
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
                    breakpoints,
                    options: dropDown[Name_MAP[filter]],
                    onChange: (data) => handleDropDownIds(data, filter, "id")
                }
            ))
        },
        [showFilter, dropDown],
    )

    return <AutoForm flexDirection={flexDirection} formData={formData()} ref={formApi} />
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
        [filterTypes.YEAR]: PropTypes.bool,
        [filterTypes.MONTH]: PropTypes.bool,
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
        [filterTypes.YEAR]: PropTypes.object,
        [filterTypes.MONTH]: PropTypes.object,
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
        yearIds: PropTypes.string,
        monthIds: PropTypes.string
    }),
    setIdSet: PropTypes.func
}

export default CommonDropDown