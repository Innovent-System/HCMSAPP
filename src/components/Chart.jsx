import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { createChart } from '../util/common';
import { Paper } from '@material-ui/core';


const Chart = ({ chartId, type, parentLabel, data, options }) => {
   
    const [chart,setChart] = useState(null);
    useEffect(() => {
        chart?.destroy();
        setChart(createChart(chartId, type, parentLabel, data, options));
    }, [data])
   
    return (
        <Paper elevation={4} style={{height:'inherit',width:'inherit'}} >
            <canvas id={chartId} chart-data="data" chart-labels="labels">
                chart-series="series"
            </canvas>
        </Paper>
    )
}

Chart.propTypes = {
    chartId: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    parentLabel: PropTypes.arrayOf(PropTypes.string).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    options: PropTypes.object.isRequired
};

Chart.defaultProps = {
    type: "bar"
};

export default Chart;
