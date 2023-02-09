import React from 'react'
import { Snackbar,Alert } from '../deps/ui';

const Styles = {
    root: {
        top: 9
    }
}

export default function Notification(props) {

    const { notify, setNotify } = props;

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotify({
            ...notify,
            isOpen: false
        })
    }

    return (
        <Snackbar
            sx={Styles.root}
            open={notify.isOpen}
            autoHideDuration={2000}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            onClose={handleClose}>
            <Alert
                severity={notify.type}
                onClose={handleClose}>
                {notify.message}
            </Alert>
        </Snackbar>
    )
}
