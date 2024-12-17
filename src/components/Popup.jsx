import React from 'react'
import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, IconButton } from '../deps/ui';
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
        p: 0
    },

    buttonIcon: {
        "& .MuiButton-startIcon": {
            mr: 0
        }
    }

}

export default function Popup(props) {

    const { title, children,
        openPopup, setOpenPopup, buttonName = "", fullScreen = false, maxWidth = "md", isEdit = false, addOrEditFunc = () => { }, footer, keepMounted = false } = props;


    return (
        <Dialog open={openPopup} keepMounted={keepMounted} fullScreen={fullScreen} fullWidth maxWidth={maxWidth} sx={{ paper: Styles.dialogWrapper }}>
            <DialogTitle sx={Styles.dialogTitle} textAlign="center">
                <div style={{ display: 'flex' }}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, lineHeight: 2 }}>
                        {title}
                    </Typography>
                    <IconButton size='small' color='secondary' sx={Styles.buttonIcon} onClick={() => { setOpenPopup(false) }}>
                        <CloseIcon fontSize='small' />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent dividers >
                {children}
            </DialogContent>
            <DialogActions>
                {footer ? footer : <Controls.Button text={buttonName ? buttonName : isEdit ? "Update" : "Submit"} onClick={addOrEditFunc} />}
            </DialogActions>
        </Dialog>
    )
}

Popup.propTypes = {
    title: PropTypes.string.isRequired,
    buttonName: PropTypes.string,
    openPopup: PropTypes.bool.isRequired,
    setOpenPopup: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    addOrEditFunc: PropTypes.func,
    isEdit: PropTypes.bool,
    maxWidth: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl",]),
    footer: PropTypes.node,
    keepMounted: PropTypes.bool,
    fullScreen: PropTypes.bool
}

