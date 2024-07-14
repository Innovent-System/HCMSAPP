import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, IconButton } from '../deps/ui'
import Controls from "./controls/Controls";
import { NotListedLocation as NotListedLocationIcon } from '../deps/ui/icons';
import PropTypes from 'prop-types'


const styles = {
    dialog: {
        p: 2,
        position: 'absolute',
        top: 5
    },
    dialogTitle: {
        textAlign: 'center'
    },
    dialogContent: {
        textAlign: 'center'
    },
    dialogAction: {
        justifyContent: 'center'
    },
    titleIcon: {
        backgroundColor: 'secondary.light',
        color: 'secondary.main',
        '&:hover': {
            backgroundColor: 'secondary.light',
            cursor: 'default'
        },
        '& .MuiSvgIcon-root': {
            fontSize: '8rem',
        }
    }
}


export default function ConfirmDialog(props) {

    const { confirmDialog = {
        isOpen: false,
        title: '',
        subTitle: '',
    }, setConfirmDialog } = props;


    return (
        <Dialog open={confirmDialog.isOpen} sx={{ paper: styles.dialog }}>
            <DialogTitle sx={styles.dialogTitle}>
                <IconButton disableRipple sx={styles.titleIcon}>
                    <NotListedLocationIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={styles.dialogContent}>
                <Typography variant="h6">
                    {confirmDialog.title}
                </Typography>
                <Typography variant="subtitle2">
                    {confirmDialog.subTitle}
                </Typography>
            </DialogContent>
            <DialogActions sx={styles.dialogAction}>
                <Controls.Button
                    text="No"
                    color="inherit"
                    onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} />
                <Controls.Button
                    text="Yes"
                    color="secondary"
                    onClick={() => { confirmDialog.onConfirm(); setConfirmDialog({ ...confirmDialog, isOpen: false }) }} />
            </DialogActions>
        </Dialog>
    )
}

ConfirmDialog.propTypes = {
    confirmDialog: PropTypes.shape({
        isOpen: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired,
        subTitle: PropTypes.string,
        onConfirm: PropTypes.func
    }).isRequired,
    setConfirmDialog: PropTypes.func.isRequired
}