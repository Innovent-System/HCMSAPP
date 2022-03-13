import { useEffect, useState } from 'react'
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


export const useDropDown = () => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const DropDownData = useSelector(e => e.common.DropDownData);

    const [filter, setFilter] = useState({
        type: filterTypes.DEFAULT,
        data: null,
        matchWith: null
    })

    const handleFilter = (data, type, matchWith) => {
        if (!Array.isArray(data)) {
            data = [data];
        }
        setFilter({ type, data, matchWith });
    }



    const getDefaultState = () => {
        setCountries(DropDownData.Countries);
        setStates(DropDownData.States);
        setCities(DropDownData.Cities);
        
    }

    useEffect(() => {
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

const { DEFAULT, COMPANY, COUNTRY, STATE, CITY, AREA, DEPARTMENT, GROUP, DESIGNATION } = filterTypes;

export const enableFilterProps = {
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