import Chart from '../../../components/Chart';
import { Grid,makeStyles } from '@material-ui/core';
import Container from '../../../components/ContainerWrapper';
import Amchart from '../../../components/Amchart';

const useStyles = makeStyles((theme) => ({
    pageContent: {
        margin: theme.spacing(2),
        padding: theme.spacing(1),
      },
   
  }));

const DashBoard = () => {
    const classes = useStyles();

    const label = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];
    const data = [{ "label": "Amount", "data": [12, 19, 3, 5, 2, 3] }];
    return (
       <Grid className={classes.pageContent}>

      
           <Grid  container spacing={3}>

            <Grid lg={12} item>
                <Amchart chartId="flag-6" parentLabel={label} data={data} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }} />
            </Grid>

        
           
            
        </Grid>
        </Grid>
        
    )
}

export default DashBoard;
