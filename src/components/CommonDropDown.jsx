import React, { useCallback, useEffect, startTransition } from 'react'
import PropTypes from 'prop-types'
import { useDropDown, DROPDOWN_PROPS, Name_MAP, filterTypes, showFilterProps } from "./useDropDown";
import { AutoForm } from './useForm';
import { dropDownIdsAction, resetAction, clearDropDownIdsAction } from '../store/actions/httpactions'
import { useAppDispatch, useAppSelector } from '../store/storehook';
import { debounce } from '../util/common';

const NULLVALUES = ["", null, undefined]
const bindDataIds = (data, matchWith) => {
    if (NULLVALUES.includes(data) || (Array.isArray(data) && !data.length)) return '';
    if (!isNaN(data)) return data;

    if (!Array.isArray(data)) {
        data = [data];
    }
    return data.map(e => e[matchWith]).join(",");
}

const AUTO_SELECT_FIELDS = {
    area: 'areas',
    //employee: 'employees'
};
//ENable filters or or Ids Mapping COmponent base krni hai abhi

const setDropDownIds = (data, type, matchWith) => ({ [type + "Ids"]: bindDataIds(data, matchWith) })

const DEFAULT_BREAK_POINTS = { size: { xs: 12, sm: 6, md: 6 } };

function CommonDropDown({ isMultiple = false, children, flexDirection = "row", breakpoints = DEFAULT_BREAK_POINTS, showFilters, idset, setIdSet, setProps, ...others }) {
    const { filterType, setFilter, ...dropDown } = useDropDown();
    const dispatch = useAppDispatch();
    const formApi = React.useRef(null);
    const isFirstRender = React.useRef(true);
    const showFilter = useAppSelector(e => showFilters ?? e.appdata.showFilterProps);

    const handleDropDownIds = (data, type, matchWith) => {
        startTransition(() => {
            const isMonthYear = ['year', 'month'].includes(type);
            const setOfIds = setDropDownIds(data, type, 'id');
            dispatch(dropDownIdsAction(setOfIds));
            if (typeof setIdSet === "function") setIdSet({ ...idset, ...setOfIds });
            if (!isMonthYear) {
                // if (["company", "area", 'department', 'group', 'designation'].includes(type)) matchWith = "_id";
                setFilter(data, type, matchWith);
            }

        })

    }
    // useEffect(() => {
    //     if (isFirstRender.current) {
    //         isFirstRender.current = false;
    //         return;   // pehli render pe (default state) auto-select mat karo
    //     }

    //     if (!showFilter.area) return;   // agar Employee dropdown hi dikh nahi raha to kuch mat karo
    //     if (!formApi.current) return;

    //     // formApi.current.setFormValue({ employee: dropDown.employees });

    //     // Redux ids bhi sync karo (backend ko final submit pe yehi jayenge)
    //     const areaIds = dropDown.areas.map(e => e.id).join(",");
    //     dispatch(dropDownIdsAction({ areaIds }));
    //     if (typeof setIdSet === "function") setIdSet(prev => ({ ...prev, areaIds }));

    // }, [dropDown.areas])

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (!formApi.current) return;

        for (const [fieldName, dropDownKey] of Object.entries(AUTO_SELECT_FIELDS)) {
            if (!showFilter[fieldName]) continue;

            const options = dropDown[dropDownKey] || [];

            //formApi.current.setFormValue({ [fieldName]: options });

            const setOfIds = setDropDownIds(options, fieldName, 'id');
            dispatch(dropDownIdsAction(setOfIds));
            if (typeof setIdSet === "function") setIdSet(prev => ({ ...prev, ...setOfIds }));
        }
    }, [dropDown.areas])

    const debouncedClick = React.useRef(debounce(handleDropDownIds, 300)).current;

    const isReset = useAppSelector(e => e.appdata.isReset);

    useEffect(() => {
        if (isReset) {
            const { resetForm } = formApi.current;
            resetForm();
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
                    onChange: (data) => debouncedClick(data, filter, "id")
                }
            ))
        },
        [showFilter, dropDown],
    )

    return <AutoForm flexDirection={flexDirection} formData={formData()} ref={formApi} {...others} >{children}</AutoForm>
}

CommonDropDown.propTypes = {
    isMultiple: PropTypes.bool,
    showFilters: PropTypes.shape({
        company: PropTypes.bool,
        country: PropTypes.bool,
        state: PropTypes.bool,
        city: PropTypes.bool,
        area: PropTypes.bool,
        group: PropTypes.bool,
        department: PropTypes.bool,
        designation: PropTypes.bool,
        employee: PropTypes.bool,
        year: PropTypes.bool,
        month: PropTypes.bool,
    }),
    setProps: PropTypes.shape({
        company: PropTypes.object,
        country: PropTypes.object,
        state: PropTypes.object,
        city: PropTypes.object,
        area: PropTypes.object,
        group: PropTypes.object,
        department: PropTypes.object,
        designation: PropTypes.object,
        employee: PropTypes.object,
        year: PropTypes.object,
        month: PropTypes.object,
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