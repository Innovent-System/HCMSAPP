import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { createChart } from '../util/common';
import { Paper } from '../deps/ui';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { ChartType, getChart } from './charts/configuration';

am4core.useTheme(am4themes_animated);


/**
 * Amchart component
 *
 * @param {Object} props - Component props
 * @param {string} props.chartId - Unique identifier for the chart
 * @param {keyof ChartType} [props.type=ChartType.XY] - Type of chart (default: XY)
 * @param {Array} props.data - Data for the chart
 * @param {string} props.dataId - ID of the data
 * @param {string} props.dataName - Name of the data
 * @param {string} props.yHeading - Heading for the Y-axis
 * @param {Object} [props.options] - Additional options for the chart
 */
const Amchart = ({ chartId, type = ChartType.XY, data, dataId, dataName, yHeading, ...options }) => {

  const [amchart, setAmChart] = useState(null);
  useEffect(() => {
    if (!data) return;
    const chart = getChart({
      type, chartId, data,
      dataId, dataName,
      yHeading,
      options
    })

    let count = 0;
    var intervalID = setInterval(() => {
      am4core.ready(() => {
        const logo = document.querySelectorAll(`#${chartId} [id^='id-'][id$='-title']`);
        logo.length && logo[1]?.parentElement.remove();
        if (logo[1]) {
          ++count;
        }

      });

      if (count === 2) {
        clearInterval(intervalID);
      }

    }, 1000);


    setAmChart(chart);
    return () => {

      chart?.dispose();
    }
  }, [data])

  return (
    <Paper elevation={4} style={{ height: 'inherit', width: 'inherit', backgroundColor: 'transparent' }} >
      <div id={chartId} style={{ height: "320px" }}></div>
    </Paper>
  )
}

Amchart.propTypes = {
  chartId: PropTypes.string,
  type: PropTypes.string,
  parentLabel: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.arrayOf(PropTypes.object),
  options: PropTypes.object
};

export default Amchart;
