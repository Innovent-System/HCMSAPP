import React from 'react'
import { Paper, Card, Typography,Grid,Box } from '../deps/ui';
import GridToolBar from './GridToolBar';

const Styles = {
    root: {
        bgcolor: '#fdfdff',
        borderRadius:1
    },
    pageHeader:{
        p:1,
        display:'flex',
        mb:1
    },
    pageIcon:{
        display:'inline-block',
        p:1,
        color:'primary.main'
    },
    pageTitle:{
        display:'flex',
        flexDirection:'column',
        pl:4,
        '& .MuiTypography-subtitle2':{
            opacity:'0.6'
        }
    }
}

export default function PageHeader(props) {

    
    const { title, subTitle, icon } = props;
    return (
        <Paper elevation={1} square sx={Styles.root}>
            <Box sx={Styles.pageHeader}>
                <Card sx={Styles.pageIcon}>
                    {icon}
                </Card>
                <Box sx={Styles.pageTitle}>
                    <Typography
                        variant="h6"
                        >
                        {title}</Typography>
                    <Typography
                        variant="subtitle2"
                        >
                        {subTitle}</Typography>
                </Box>
                <Grid item sm></Grid>
                <GridToolBar/>
            </Box>
            
        </Paper>
    )
}
