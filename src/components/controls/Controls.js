import Input from "./Input";
import RadioGroup from "./RadioGroup";
import Select from "./Select";
import Checkbox from "./Checkbox";
import DatePicker from "./DatePicker";
import Button from "./Button";
import ActionButton from "./ActionButton";
import Avatar from "./Avatar";
import MultiSelect from "./MultiSelect";
import PropTypes from 'prop-types'

const Controls = {
  Input,
  RadioGroup,
  Select,
  Checkbox,
  DatePicker,
  Button,
  ActionButton,
  MultiSelect,
  Avatar,
};

export default Controls;


export const ElementType = Object.freeze(["inputfield","radio_group" ,"checkbox", "s_dropdown", "m_dropdown", "datetimepicker"]);


export function Element(props) {
    let nodeElement = null;
    
    const { elementType,...others } = props;
    switch (elementType) {
        case "inputField":
            nodeElement = <Input {...others}/>
            break;
        case "checkbox":
            nodeElement = <Checkbox {...others}/>
            break;
        case "radio_group":
            nodeElement = <RadioGroup {...others}/>
            break;
        case "datetimepicker":
            nodeElement = <DatePicker {...others}/>
            break;
        case "s_dropdown":
            nodeElement = <Select  {...others}/>
            break;
        case "m_dropdown":
            nodeElement = <MultiSelect {...others}/>
            break;
        default:
            nodeElement = <Input {...others}/>
            break;
    }

    return nodeElement;
}

// Element.propTypes = {
//     elementType: PropTypes.oneOf(ElementType).isRequired,
//     name:  PropTypes.string.isRequired,
//     label: PropTypes.string.isRequired,
//     // defaultValue: PropTypes.any.isRequired,
//     onChange: PropTypes.func.isRequired,
// }