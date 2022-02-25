import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux';


const useDropDownData = () => {

    const DropDownData = useSelector(e => e.app.DropDownData);

    const [option, setOption] = useState({
        type: "default",
        data: null,
        matchWith: null
    })

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);


    useEffect(() => {
        if (!DropDownData) return;
        if(option.type === "default"){
            setCountries(DropDownData.Countries);
            return;
        }
        
        const ids = option.data[0] ? option.data?.map(d => d[option.matchWith]) : [];
        const  states = [],cities = [];
        switch (option.type) {
            case "country":{
                if(ids.length){
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
                case "state":
                if(ids.length){
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

    }, [DropDownData, option])

    return {
        countries,
        states,
        cities,
        setOption
    }
}

useDropDownData.propTypes = {
    option: PropTypes.objectOf({
        type: PropTypes.oneOf(["default", "country", "state", "city", "area"]).isRequired,
        data: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object
        ]).isRequired
    })
}

export default useDropDownData