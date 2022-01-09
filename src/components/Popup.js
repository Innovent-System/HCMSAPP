import React from 'react'
import { Dialog, DialogTitle, DialogContent, Typography } from '../deps/ui';
import Controls from "./controls/Controls";
import {Close as CloseIcon} from '../deps/ui/icons';

const Styles = {
    dialogWrapper: {
        p: 2,
        position: 'absolute',
        top: 5
    },
    dialogTitle: {
        pr: '0px'
    }
}

export default function Popup(props) {

    const { title, children, openPopup, setOpenPopup } = props;
    

    return (
        <Dialog open={openPopup} maxWidth="md" sx={{ paper: Styles.dialogWrapper }}>
            <DialogTitle sx={Styles.dialogTitle}>
                <div style={{ display: 'flex' }}>
                    <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
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
