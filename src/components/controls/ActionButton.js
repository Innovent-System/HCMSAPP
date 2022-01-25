import React from 'react'
import { Button } from '../../deps/ui';


const styles = {
    root: {
        minWidth: 0,
        margin: 0.5
    },
    secondary: {
        backgroundColor: 'secondary.light',
        '& .MuiButton-label': {
            color: 'secondary.main',
        }
    },
    primary: {
        backgroundColor: 'primary.light',
        '& .MuiButton-label': {
            color: 'primary.main',
        }
    },
}

export default function ActionButton(props) {

    const { color, children, onClick } = props;

    return (
        <Button
            sx={[styles.root,styles[color]]}
            onClick={onClick}>
            {children}
        </Button>
    )
}
