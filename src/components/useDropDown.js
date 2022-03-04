import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux';

const filterType = Object.freeze({
    DEFAULT: 'default',
    COUNTRY: 'country',
    STATE: 'state',
    CITY: 'city'
})
const useDropDown = () => {

    const DropDownData = useSelector(e => e.app.DropDownData);

    const [filter, setFilter] = useState({
        type: filterType.DEFAULT,
        data: null,
        matchWith: null
    })

    const handleFilter = (data, type, matchWith) => {
        if (!Array.isArray(data)) {
            data = [data];
        }
        setFilter({type,data,matchWith});
    }

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const getDefaultState = () => {
        setCountries(DropDownData.Countries);
        setStates(DropDownData.States);
        setCities(DropDownData.Cities);
    }

    useEffect(() => {
        if (!DropDownData) return;
        if (filter.type === filterType.DEFAULT) {
            getDefaultState();
            return;
        }

        const ids = filter.data[0] ? filter.data.map(d => d[filter.matchWith]) : [];
        const states = [], cities = [];
        switch (filter.type) {
            case filterType.COUNTRY: {
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
            case filterType.STATE:
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
        setFilter:handleFilter,
        filterType
    }
}



useDropDown.propTypes = {
    filter: PropTypes.objectOf({
        type: PropTypes.oneOf(["default", "country", "state", "city", "area"]).isRequired,
        data: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object
        ]).isRequired
    })
}

export default useDropDown