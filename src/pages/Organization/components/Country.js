import React, {  useState,useEffect } from "react";
import Controls from '../../../components/controls/Controls';
import Popup from '../../../components/Popup';
import {AutoForm} from '../../../components/useForm';
import { API } from '../_Service';
import {useDispatch,useSelector} from 'react-redux';
import { handlePostActions } from '../../../store/actions/httpactions';


export default function Country() {
    const [openPopup, setOpenPopup] = useState(false);
    const formRef = React.useRef(null);
    const [countries, setCountries] = useState([]);
    const dispatch = useDispatch();
    const DropDownData = useSelector(e => e.app.DropDownData);

    useEffect(() => {
        if (DropDownData)
            setCountries(DropDownData.Countries);
    }, [DropDownData]);

    const handleSubmit = (e) => {
        const { getValue, validateFields } = formRef.current
        const values = getValue();
        if (validateFields()) {
            dispatch(handlePostActions(API.INSERT_COUNTRY, values)).then(res => {
                console.log(res);
            });
        }
    }
    const formData = [
        {
            elementType: "ad_dropdown",
            name: "fkCountryId",
            label: "Country",
            required: true,
            validate: {
                errorMessage: "Country is required",
            },
            dataName: 'name',
            options: countries,
            defaultValue: countries?.length ? countries[0] : null
        }

    ];
    return (
        <>
            <Popup
                title="Add Country"
                openPopup={openPopup}
                maxWidth="sm"
                addOrEditFunc={handleSubmit}
                setOpenPopup={setOpenPopup}>
                <AutoForm formData={formData} ref={formRef} isValidate={true} />
            </Popup>
            <Controls.Button onClick={() => { setOpenPopup(true) }} text="Add Country" />
        </>
    );
}
