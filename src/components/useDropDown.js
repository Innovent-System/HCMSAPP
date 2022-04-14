import { useLayoutEffect, useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

export const filterTypes = Object.freeze({
    DEFAULT: 'default',
    COMPANY: 'company',
    COUNTRY: 'country',
    STATE: 'state',
    CITY: 'city',
    AREA: 'area',
    DEPARTMENT: 'department',
    GROUP: 'group',
    DESIGNATION: 'designation'
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


export const useDropDown = () => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const callbackRef = useRef(null);
    const DropDownData = useSelector(e => e.common.DropDownData);

    const [filter, setFilter] = useState({
        type: filterTypes.DEFAULT,
        data: null,
        matchWith: null
    })

    const handleFilter = (data, type, matchWith, callback) => {
        if (!Array.isArray(data)) {
            data = [data];
        }

        if (typeof callback === "function") {
            callbackRef.current = callback;
            setFilter({ type, data, matchWith });
        }
        else {
            callbackRef.current = null;
            setFilter({ type, data, matchWith });
        }

    }



    const getDefaultState = () => {
        setCountries(DropDownData.Countries);
        setStates(DropDownData.States);
        setCities(DropDownData.Cities);
    }

    useLayoutEffect(() => {
        if (!DropDownData) return;
        if (filter.type === filterTypes.DEFAULT) {
            getDefaultState();
            return;
        }

        const ids = filter.data[0] ? filter.data.map(d => d[filter.matchWith]) : [];
        const states = [], cities = [];
        switch (filter.type) {
            case filterTypes.COUNTRY: {
                if (ids.length) {
                    for (let index = 0; index < DropDownData.States.length; index++) {
                        const element = DropDownData.States[index];
                        if (ids.indexOf(element.country_id) !== -1) {
                            states.push(element);
                        }
                    }

                    for (let index = 0; index < DropDownData.Cities.length; index++) {
                        const element = DropDownData.Cities[index];
                        if (ids.indexOf(element.country_id) !== -1) {
                            cities.push(element);
                        }
                    }
                }

                setStates(states);
                setCities(cities);
            }
                break;
            case filterTypes.STATE:
                if (ids.length) {
                    for (let index = 0; index < DropDownData.Cities.length; index++) {
                        const element = DropDownData.Cities[index];
                        if (ids.indexOf(element.state_id) !== -1) {
                            cities.push(element);
                        }
                    }
                }
                setCities(cities);
                break;
            default:
                break;
        }

        if (callbackRef.current) {
            callbackRef.current({ states, cities })
        }

    }, [DropDownData, filter])

    return {
        countries,
        states,
        cities,
        setFilter: handleFilter,
        filterType: filterTypes
    }
}

export const useDropDownIds = () => {
    const dropdownIds = useSelector(e => e.commonDropDownIds);

    return dropdownIds;
}

export const useFilterBarEvent = (onApply, onReset) => {
    const handleApply = () => onApply()
    const handleReset = () => onReset()
    useEffect(() => {
        if (typeof onApply === "function")
            document.addEventListener("apply", handleApply)

        if (typeof onReset === "function")
            document.addEventListener("reset", handleReset)

        return () => {
            document.removeEventListener("apply", handleApply)
            document.removeEventListener("reset", handleReset)
        }
    }, [onApply, onReset])

}

const { DEFAULT, COMPANY, COUNTRY, STATE, CITY, AREA, DEPARTMENT, GROUP, DESIGNATION } = filterTypes;

export const showFilterProps = {
    [COMPANY]: false,
    [COUNTRY]: true,
    [STATE]: false,
    [CITY]: false,
    [AREA]: false,
    [DEPARTMENT]: false,
    [GROUP]: false,
    [DESIGNATION]: false
}

useDropDown.propTypes = {
    filter: PropTypes.objectOf({
        type: PropTypes.oneOf([DEFAULT, COMPANY, COUNTRY, STATE, CITY, AREA, DEPARTMENT, GROUP, DESIGNATION]).isRequired,
        data: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object
        ]).isRequired
    })
}

export const Name_MAP = {
    [COMPANY]: "company",
    [COUNTRY]: "countries",
    [STATE]: "states",
    [CITY]: "cities",
    [AREA]: "areas",
    [DEPARTMENT]: "departments",
    [GROUP]: "groups",
    [DESIGNATION]: "designations"
}

export const DROPDOWN_PROPS = {
    [COUNTRY]: {
        elementType: "ad_dropdown",
        name: "country",
        label: "Country",
        required: true,
        breakpoints: {
            md: 12
        },
        validate: {
            errorMessage: "Company is required",
        },
        dataName: 'name',
        defaultValue: null
    },
    [STATE]: {
        elementType: "ad_dropdown",
        name: "state",
        label: "State",
        required: true,
        breakpoints: {
            md: 12
        },
        dataName: "name",
        validate: {
            errorMessage: "State is required",
        },
        defaultValue: null
    },
    [CITY]: {
        elementType: "ad_dropdown",
        name: "city",
        label: "City",
        breakpoints: {
            md: 12
        },
        required: true,
        dataName: "name",
        validate: {
            errorMessage: "City is required",
        },
        defaultValue: null
    }
}