import React from 'react'
import { Dialog, DialogTitle, DialogContent, Typography, DialogActions } from '../deps/ui';
import Controls from "./controls/Controls";
import { Close as CloseIcon } from '../deps/ui/icons';
import PropTypes from 'prop-types'

const Styles = {
    dialogWrapper: {
        p: 1,
        position: 'absolute',
        top: 5
    },
    dialogTitle: {
        p: 1
    },

    buttonIcon: {
        "& .MuiButton-startIcon": {
            mr: 0
        }
    }

}

export default function Popup(props) {

    const { title, children, openPopup, setOpenPopup, fullScreen = false, maxWidth = "md", isEdit, addOrEditFunc, footer, keepMounted } = props;


    return (
        <Dialog open={openPopup} keepMounted={keepMounted} fullScreen={fullScreen} fullWidth maxWidth={maxWidth} sx={{ paper: Styles.dialogWrapper }}>
            <DialogTitle sx={Styles.dialogTitle}>
                <div style={{ display: 'flex' }}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, p: 0.6 }}>
                        {title}
                    </Typography>
                    <Controls.Button sx={Styles.buttonIcon} color="secondary" icon={CloseIcon} onClick={() => { setOpenPopup(false) }} />
                </div>
            </DialogTitle>
            <DialogContent dividers>
                {children}
            </DialogContent>
            <DialogActions>
                {footer ? footer : <Controls.Button text={isEdit ? "Update" : "Submit"} onClick={addOrEditFunc} />}
            </DialogActions>
        </Dialog>
    )
}

Popup.propTypes = {
    title: PropTypes.string.isRequired,
    openPopup: PropTypes.bool.isRequired,
    setOpenPopup: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    addOrEditFunc: PropTypes.func,
    isEdit: PropTypes.bool,
    maxWidth: PropTypes.oneOf(["xm", "sm", "md", "lg", "xl",]),
    footer: PropTypes.node,
    keepMounted: PropTypes.bool,
    fullScreen: PropTypes.bool
}

Popup.defaultProps = {
    isEdit: false,
    keepMounted: false,
    addOrEditFunc: () => { },
}