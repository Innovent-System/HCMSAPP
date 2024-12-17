import Input from "./Input";
import RadioGroup from "./RadioGroup";
import Select from "./Select";
import Checkbox from "./Checkbox";
import DatePicker from "./DatePicker";
import DateRangePicker from './DateRangPicker'
import Button from "./Button";
import ActionButton from "./ActionButton";
import Avatar from "./AvatarUpload";
import MultiSelect from "./MultiSelect";
import PropTypes from 'prop-types'
import { ArrayForm } from '../useArrayForm'
import FileInput from "./FileInput";
import TagInput from "./TagInput";

const Controls = {
    Input,
    RadioGroup,
    Select,
    Checkbox,
    DatePicker,
    DateRangePicker,
    Button,
    ActionButton,
    MultiSelect,
    Avatar,
    FileInput,
    TagInput
};

export default Controls;


export const ElementType = Object.freeze(["inputfield", "taginput", "radiogroup", "checkbox", "dropdown", "clearfix", "ad_dropdown", "datetimepicker", "daterangepicker", "uploadavatar", "arrayForm", "custom"]);

export function Element(props) {

    const { elementType, NodeElement, arrayFormRef, ...others } = props;
    switch (elementType) {
        case "inputfield": return <Input {...others} />
        case "taginput": return <TagInput {...others} />
        case "checkbox": return <Checkbox {...others} />
        case "radiogroup": return <RadioGroup {...others} />
        case "datetimepicker": return <DatePicker {...others} />
        case "daterangepicker": return <DateRangePicker {...others} />
        case "dropdown": return <Select  {...others} />
        case "ad_dropdown": return <MultiSelect {...others} />
        case "uploadavatar": return <Avatar {...others} />
        case "clearfix": return <div className="clearfix"></div>
        case "arrayForm": return <ArrayForm ref={arrayFormRef} {...others} />
        default: return <NodeElement {...others} />
    }
}

Element.propTypes = {
    elementType: PropTypes.oneOf(ElementType).isRequired,
    name: PropTypes.string,
    label: PropTypes.string,
    // defaultValue: PropTypes.any.isRequired,
    onChange: PropTypes.func,
    [PropTypes.string]: PropTypes.any
}