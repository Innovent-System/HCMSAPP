import React from 'react'
import { Dialog, DialogTitle, DialogContent, Typography } from '../deps/ui';
import Controls from "./controls/Controls";
import {Close as CloseIcon} from '../deps/ui/icons';
import PropTypes from 'prop-types'

const Styles = {
    dialogWrapper: {
        p: 1,
        position: 'absolute',
        top: 5
    },
    dialogTitle: {
        p: 1
    }
}

export default function Popup(props) {

    const { title, children, openPopup, setOpenPopup,maxWidth = "md" } = props;
    

    return (
        <Dialog open={openPopup} maxWidth={maxWidth} sx={{ paper: Styles.dialogWrapper }}>
            <DialogTitle sx={Styles.dialogTitle}>
                <div style={{ display: 'flex' }}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1,p:0.6 }}>
                        {title}
                    </Typography>
                    <Controls.ActionButton
                        color="secondary"
                        onClick={()=>{setOpenPopup(false)}}>
                        <CloseIcon />
                    </Controls.ActionButton>
                </div>
            </DialogTitle>
            <DialogContent dividers>
                {children}
            </DialogContent>
        </Dialog>
    )
}

Popup.propTypes = {
    title:PropTypes.string.isRequired,
    openPopup:PropTypes.bool.isRequired,
    setOpenPopup:PropTypes.func.isRequired,
    children:PropTypes.node.isRequired,
    maxWidth:PropTypes.oneOf(["xm","sm","md","lg","xl",])
}