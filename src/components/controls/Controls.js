import Input from "./Input";
import RadioGroup from "./RadioGroup";
import Select from "./Select";
import Checkbox from "./Checkbox";
import DatePicker from "./DatePicker";
import Button from "./Button";
import ActionButton from "./ActionButton";
import Avatar from "./AvatarUpload";
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


export const ElementType = Object.freeze(["inputfield", "radiogroup", "checkbox", "dropdown", "clearfix", "ad_dropdown", "datetimepicker", "uploadavatar", "fieldarray"]);


export function Element(props) {
    let nodeElement = null;

    const { elementType, NodeElement, ...others } = props;
    switch (elementType) {
        case "inputfield":
            nodeElement = <Input {...others} />
            break;
        case "checkbox":
            nodeElement = <Checkbox {...others} />
            break;
        case "radiogroup":
            nodeElement = <RadioGroup {...others} />
            break;
        case "datetimepicker":
            nodeElement = <DatePicker {...others} />
            break;
        case "dropdown":
            nodeElement = <Select  {...others} />
            break;
        case "ad_dropdown":
            nodeElement = <MultiSelect {...others} />
            break;
        case "uploadavatar":
            nodeElement = <Avatar {...others} />
            break;
        case "clearfix":
            nodeElement = <div className="clearfix"></div>
            break;
        default:
            nodeElement = <NodeElement {...others} />
            break;
    }

    return nodeElement;
}

Element.propTypes = {
    elementType: PropTypes.oneOf(ElementType).isRequired,
    name: PropTypes.string,
    label: PropTypes.string,
    // defaultValue: PropTypes.any.isRequired,
    onChange: PropTypes.func,
    [PropTypes.string]: PropTypes.any
}