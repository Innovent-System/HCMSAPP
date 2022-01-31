import React, {  useState } from "react";
import PropTypes from 'prop-types'
import Controls from '../../../components/controls/Controls';
import Popup from '../../../components/Popup';
import CountryModal from './AddCountryModal'
import { Style } from "@mui/icons-material";

const Styles = {
    root: {
        width: '100%',
    },
    button: {
        marginRight: 1,
    },
    instructions: {
        marginTop: 1,
        marginBottom: 1,
    },
}

export default function Country() {
    const [openPopup, setOpenPopup] = useState(false);
    return (
        <>
            <Popup sx={Style.root}
                title="Add Country"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}>
                <CountryModal />
            </Popup>
            <Controls.Button onClick={() => { setOpenPopup(true) }} sx={Styles.button} text="Add Country" />
        </>
    );
}

Country.propTypes = {
    addOrEdit: PropTypes.func,
    recordForEdit: PropTypes.object
}