import Chart from '../../../components/Chart';
import { Grid } from '../../../deps/ui';
import Amchart from '../../../components/Amchart';
import { useEntitiesQuery } from '../../../store/actions/httpactions';

const API = 'employee/dashboard/get'
const DashBoard = () => {

    const { data, isLoading, refetch } = useEntitiesQuery({
        url: API,
        data: {

        }
    });

    return (
        <Grid container spacing={1}>

            <Grid size={{ xs: 12, md: 6 }} item>
                <Amchart chartId="flag-1" type='XY' data={data?.departmentCount}
                    dataId={'_id'} dataName={'count'}
                    yHeading="Departments"
                />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} item>
                <Amchart chartId="flag-2" type='XY' data={data?.areaCount}
                    dataId={'_id'} dataName={'count'}
                    yHeading="Areas"
                />
            </Grid>
            <Grid size={{ xs: 12, md: 12 }} item>
                <Amchart chartId="flag-3" type='XY' data={data?.designationCount}
                    dataId={'_id'} dataName={'count'}
                    yHeading="Designations"
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} item>
                <Amchart chartId="flag-4" type='PIE' data={data?.genderCount}
                    dataId={'_id'} dataName={'count'}
                />
            </Grid>


        </Grid>
    )
}

export default DashBoard;
