import Chart from '../../../components/Chart';
import { Grid } from '../../../deps/ui';
import Amchart from '../../../components/Amchart';


const DashBoard = () => {
    

    const label = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];
    const data = [{ "label": "Amount", "data": [12, 19, 3, 5, 2, 3] }];
    return (
       <Grid sx={{
           m:2,
           p:1
       }} >
      
           <Grid  container spacing={3}>

            <Grid lg={12} sm={12} item>
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
