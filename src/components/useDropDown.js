import { useState, useRef, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useAppSelector } from '../store/storehook';
import { getDefaultMonth, getMonths, getYears } from '../util/common';

export const filterTypes = Object.freeze({
    DEFAULT: 'default',
    COMPANY: 'company',
    COUNTRY: 'country',
    STATE: 'state',
    CITY: 'city',
    AREA: 'area',
    DEPARTMENT: 'department',
    EMPLOYEE: 'employee',
    GROUP: 'group',
    DESIGNATION: 'designation',
    YEAR: 'year',
    MONTH: 'month'
})

const useStateWithCallbackLazy = initialValue => {
    const callbackRef = useRef(null);

    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        if (callbackRef.current) {
            callbackRef.current(value);

            callbackRef.current = null;
        }
    }, [value]);

    const setValueWithCallback = (newValue, callback) => {
        callbackRef.current = callback;

        return setValue(newValue);
    };

    return [value, setValueWithCallback];
};

Array.prototype.max = function () {
    return Math.max.apply(null, this);
};

Array.prototype.min = function () {
    return Math.min.apply(null, this);
};

function range(start = 0, end = 0, step = 1) {
    return {
        [Symbol.iterator]() {
            return this;
        },
        next() {
            if (start < end) {
                start = start + step;
                return { value: start, done: false };
            }
            return { done: true, value: end }
        }
    }
}
const _years = getYears(), _months = getMonths();
export const useDropDown = () => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [areas, setAreas] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [employees, setEmployees] = useState([]);

    const callbackRef = useRef(null);
    const DropDownData = useAppSelector(e => e.appdata.DropDownData);
    const employeeData = useAppSelector(e => e.appdata.employeeData);

    const { companyIds, countryIds, stateIds, cityIds, departmentIds, areaIds, groupIds, designationIds } = useAppSelector(e => e.appdata.dropdownIds);
    const [filter, setFilter] = useState({
        type: filterTypes.DEFAULT,
        data: null,
        matchWith: null
    })

    const handleFilter = (data, type, matchWith, callback) => {

        if (!Array.isArray(data)) data = [data];

        if (typeof callback === "function") {
            callbackRef.current = callback;
            setFilter({ type, data, matchWith });
        }
        else {
            callbackRef.current = null;
            setFilter((pre) => ({ ...pre, type, data, matchWith }));
        }

    }

    const getDefaultState = () => {
        setCompanies(DropDownData.Companies);
        setCountries(DropDownData.Countries);
        setStates(DropDownData.States);
        setCities(DropDownData.Cities);
        setAreas(DropDownData.Areas);
        setEmployees(employeeData.Employees);
    }

    useMemo(() => {
        if (!DropDownData) return;
        if (filter.type === filterTypes.DEFAULT) {
            getDefaultState();
            return;
        }
        let ids = filter.data[0] ? filter.data.map(d => d[filter.matchWith]) : [];
        const _countries = [], _states = [], _cities = [], _areas = [], _employees = [];
        let count = -1;
        let _companyIds = companyIds ? companyIds.split(",").reduce((acc, item) => { acc[item] = item; return acc }, {}) : {},
            _departmentIds = departmentIds ? departmentIds.split(",").reduce((acc, item) => { acc[item] = item; return acc }, {}) : {},
            _groupIds = groupIds ? groupIds.split(",").reduce((acc, item) => { acc[item] = item; return acc }, {}) : {},
            _designationIds = designationIds ? designationIds.split(",").reduce((acc, item) => { acc[item] = item; return acc }, {}) : {},
            _countryIds = countryIds ? countryIds.split(",").reduce((acc, item) => { acc[item] = item; return acc }, {}) : {},
            _stateIds = stateIds ? stateIds.split(",").reduce((acc, item) => { acc[item] = item; return acc }, {}) : {},
            _cityIds = cityIds ? cityIds.split(",").reduce((acc, item) => { acc[item] = item; return acc }, {}) : {},
            _areaIds = areaIds ? areaIds.split(",").reduce((acc, item) => { acc[item] = item; return acc }, {}) : {}
        switch (filter.type) {
            case filterTypes.COMPANY:
                if (ids.length) {
                    ids = DropDownData.Countries.filter(f => ids.indexOf(f.fkCompanyId) !== -1).map(c => c.id);
                    count = DropDownData.Countries.length;
                    while (count--) {
                        const element = DropDownData.Countries[count];
                        if (ids.indexOf(element.id) !== -1) {
                            _countries.push(element);
                        }
                    }
                    count = DropDownData.States.length;
                    while (count--) {
                        const element = DropDownData.States[count];
                        if (ids.indexOf(element.country_id) !== -1) {
                            _states.push(element);
                        }
                    }
                    count = DropDownData.Cities.length;
                    while (count--) {
                        const element = DropDownData.Cities[count];
                        if (ids.indexOf(element.country_id) !== -1) {
                            _cities.push(element);
                        }
                    }
                    count = DropDownData.Areas.length;
                    while (count--) {
                        const element = DropDownData.Areas[count];
                        if (ids.indexOf(element.country.intId) !== -1) {
                            _areas.push(element);
                            _areaIds[element._id] = element._id;
                        }
                    }
                }
                setCountries(_countries);
                setStates(_states);
                setCities(_cities);
                setAreas(_areas);
                break;
            case filterTypes.COUNTRY:
                if (ids.length) {
                    count = DropDownData.States.length;
                    while (count--) {
                        const element = DropDownData.States[count];
                        if (ids.indexOf(element.country_id) !== -1) _states.push(element);
                    }
                    count = DropDownData.Cities.length;
                    while (count--) {
                        const element = DropDownData.Cities[count];
                        if (ids.indexOf(element.country_id) !== -1) _cities.push(element);
                    }
                    count = DropDownData.Areas.length;
                    while (count--) {
                        const element = DropDownData.Areas[count];
                        if (ids.indexOf(element.country.intId) !== -1) { _areas.push(element); _areaIds[element._id] = element._id; }
                    }
                }
                setStates(_states);
                setCities(_cities);
                setAreas(_areas);
                break;
            case filterTypes.STATE:
                if (ids.length) {
                    count = DropDownData.Cities.length;
                    while (count--) {
                        const element = DropDownData.Cities[count];
                        if (ids.indexOf(element.state_id) !== -1) _cities.push(element);
                    }
                    count = DropDownData.Areas.length;
                    while (count--) {
                        const element = DropDownData.Areas[count];
                        if (ids.indexOf(element.state.intId) !== -1) { _areas.push(element); _areaIds[element._id] = element._id };
                    }
                }
                setCities(_cities);
                setAreas(_areas);
                break;
            case filterTypes.CITY:
                if (ids.length) {
                    count = DropDownData.Areas.length;
                    ids = filter.data.map(d => d._id);
                    while (count--) {
                        const element = DropDownData.Areas[count];
                        if (ids.indexOf(element.city.city_id) !== -1) { _areas.push(element); _areaIds[element._id] = element._id; };
                    }
                }
                setAreas(_areas);
                break;
            default:
                break;
        }

        const hasFilters = {
            company: Object.keys(_companyIds).length > 0,
            country: Object.keys(_countryIds).length > 0,
            state: Object.keys(_stateIds).length > 0,
            city: Object.keys(_cityIds).length > 0,
            area: Object.keys(_areaIds).length > 0,
            department: Object.keys(_departmentIds).length > 0,
            group: Object.keys(_groupIds).length > 0,
            designation: Object.keys(_designationIds).length > 0,
        };

        if (!["employee", "year", "month"].includes(filter.type)) {
            count = employeeData.Employees.length;
            while (count--) {
                const element = employeeData.Employees[count];

                if ((!hasFilters.company || _companyIds[element.fkCompanyId]) &&
                    (!hasFilters.country || _countryIds[element.companyInfo.fkCountryId]) &&
                    (!hasFilters.state || _stateIds[element.companyInfo.fkStateId]) &&
                    (!hasFilters.city || _cityIds[element.companyInfo.fkCityId]) &&
                    (!hasFilters.area || _areaIds[element.companyInfo.fkAreaId]) &&
                    (!hasFilters.department || _departmentIds[element.companyInfo.fkDepartmentId]) &&
                    (!hasFilters.group || _groupIds[element.companyInfo.fkEmployeeGroupId]) &&
                    (!hasFilters.designation || _designationIds[element.companyInfo.fkDesignationId])
                ) {
                    _employees.push(element);
                }

            }
            setEmployees(_employees);
        }

        if (callbackRef.current) {
            callbackRef.current({ countries, states, cities, areas })
        }

    }, [filter, DropDownData])

    return {
        companies,
        countries,
        states,
        cities,
        areas,
        departments: DropDownData.Departments,
        groups: employeeData.Groups,
        designations: employeeData.Designations,
        employees,
        roleTemplates: employeeData.RoleTemplates,
        schedules: employeeData.Schedules,
        religion: employeeData.Religion,
        employeeStatus: employeeData.EmployeeStatus,
        leaveAccural: employeeData.LeaveAccural,
        years: _years,
        months: _months,
        setFilter: handleFilter,
        filterType: filterTypes
    }
}

export const useDropDownIds = () => {
    const dropdownIds = useAppSelector(e => e.appdata.dropdownIds);

    return dropdownIds;
}

export const useFilterBarEvent = (onReset) => {
    useEffect(() => {
        if (typeof onReset === "function")
            document.addEventListener("reset", onReset)

        return () => {
            document.removeEventListener("reset", onReset)
        }
    }, [onReset])
}

const { DEFAULT, COMPANY, COUNTRY, STATE, CITY, AREA, DEPARTMENT, GROUP, DESIGNATION, EMPLOYEE, YEAR, MONTH } = filterTypes;

export const showFilterProps = {
    [COMPANY]: true,
    [COUNTRY]: false,
    [STATE]: false,
    [CITY]: false,
    [AREA]: false,
    [DEPARTMENT]: false,
    [GROUP]: false,
    [DESIGNATION]: false,
    [EMPLOYEE]: false,
    [YEAR]: false,
    [MONTH]: false
}

useDropDown.propTypes = {
    filter: PropTypes.objectOf({
        type: PropTypes.oneOf([DEFAULT, COMPANY, COUNTRY, STATE, CITY, AREA, DEPARTMENT, GROUP, EMPLOYEE, DESIGNATION]).isRequired,
        data: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object
        ]).isRequired
    })
}

export const Name_MAP = {
    [COMPANY]: "companies",
    [COUNTRY]: "countries",
    [STATE]: "states",
    [CITY]: "cities",
    [AREA]: "areas",
    [DEPARTMENT]: "departments",
    [GROUP]: "groups",
    [DESIGNATION]: "designations",
    [EMPLOYEE]: 'employees',
    [YEAR]: 'years',
    [MONTH]: 'months'
}



export const DROPDOWN_PROPS = {
    [COMPANY]: {
        elementType: "ad_dropdown",
        name: "company",
        label: "Company",
        isMultiple: true,
        dataId: '_id',
        dataName: 'companyName',
        defaultValue: []
    },
    [COUNTRY]: {
        elementType: "ad_dropdown",
        name: "country",
        label: "Country",
        isMultiple: true,
        dataId: '_id',
        dataName: 'name',
        defaultValue: []
    },
    [STATE]: {
        elementType: "ad_dropdown",
        name: "state",
        label: "State",
        isMultiple: true,
        dataId: '_id',
        dataName: "name",
        defaultValue: []
    },
    [CITY]: {
        elementType: "ad_dropdown",
        name: "city",
        label: "City",
        isMultiple: true,
        dataId: '_id',
        dataName: "name",
        defaultValue: []
    },
    [AREA]: {
        elementType: "ad_dropdown",
        name: "area",
        label: "Area",
        dataId: '_id',
        isMultiple: true,
        dataName: "areaName",
        defaultValue: []
    },
    [DEPARTMENT]: {
        elementType: "ad_dropdown",
        name: "department",
        label: "Department",
        isMultiple: true,
        dataId: '_id',
        dataName: "departmentName",
        defaultValue: []
    },
    [GROUP]: {
        elementType: "ad_dropdown",
        name: "group",
        label: "Group",
        isMultiple: true,
        dataId: '_id',
        dataName: "groupName",
        defaultValue: []
    },
    [DESIGNATION]: {
        elementType: "ad_dropdown",
        name: "designation",
        label: "Designation",
        isMultiple: true,
        dataId: '_id',
        dataName: "name",
        defaultValue: []
    },
    [EMPLOYEE]: {
        elementType: "ad_dropdown",
        name: "employee",
        label: "Employees",
        isMultiple: true,
        dataId: '_id',
        dataName: "fullName",
        defaultValue: []
    },
    [YEAR]: {
        elementType: "dropdown",
        name: "year",
        label: "Year",
        isNone: false,
        dataId: "id",
        dataName: "title",
        defaultValue: _years[_years.length - 1].id,
        // options: _years,
    },
    [MONTH]: {
        elementType: "dropdown",
        name: "month",
        label: "Month",
        isNone: false,
        dataId: "id",
        dataName: "title",
        defaultValue: _months[getDefaultMonth()].id,
        // options: _months,
    }
}