import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { createChart } from '../util/common';
import { Paper } from '@material-ui/core';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

const Amchart = ({ chartId, type, parentLabel, data, options }) => {
    
    // const [chart,setChart] = useState(null);
    useEffect(() => {
        const chart = am4core.create(chartId, am4charts.XYChart3D);

        // Add data
        chart.data = [
        {
          "country": "USA",
          "visits": 4025
        }, 
        {
          "country": "China",
          "visits": 1882
        }, 
        {
          "country": "Japan",
          "visits": 1809
        }, 
        {
          "country": "Germany",
          "visits": 1322
        }, 
        {
          "country": "UK",
          "visits": 1122
        }, 
        {
          "country": "France",
          "visits": 1114
        }, 
        {
          "country": "India",
          "visits": 984
        }, 
        {
          "country": "Spain",
          "visits": 711
        }, 
        {
          "country": "Netherlands",
          "visits": 665
        }, 
        {
          "country": "Russia",
          "visits": 580
        }, 
        {
          "country": "South Korea",
          "visits": 443
        }, 
        {
          "country": "Canada",
          "visits": 441
        }, 
        {
          "country": "Brazil",
          "visits": 395
        }, 
        {
          "country": "Italy",
          "visits": 386
        },
        {
          "country": "Australia",
          "visits": 384
        }, 
        {
          "country": "Taiwan",
          "visits": 338
        }, 
        {
          "country": "Poland",
          "visits": 328
        }];
        

        // Create axes
        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "country";
        categoryAxis.renderer.labels.template.rotation = 270;
        categoryAxis.renderer.labels.template.hideOversized = false;
        categoryAxis.renderer.minGridDistance = 20;
        categoryAxis.renderer.labels.template.horizontalCenter = "right";
        categoryAxis.renderer.labels.template.verticalCenter = "middle";
        categoryAxis.tooltip.label.rotation = 270;
        categoryAxis.tooltip.label.horizontalCenter = "right";
        categoryAxis.tooltip.label.verticalCenter = "middle";
        
        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.title.text = "Countries";
        valueAxis.title.fontWeight = "bold";
        
        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries3D());
        series.dataFields.valueY = "visits";
        series.dataFields.categoryX = "country";
        series.name = "Visits";
        series.tooltipText = "{categoryX}: [bold]{valueY}[/]";
        series.columns.template.fillOpacity = .8;
        
        var columnTemplate = series.columns.template;
        columnTemplate.strokeWidth = 2;
        columnTemplate.strokeOpacity = 1;
        columnTemplate.stroke = am4core.color("#FFFFFF");
        
        columnTemplate.adapter.add("fill", function(fill, target) {
          return chart.colors.getIndex(target.dataItem.index);
        })
        
        columnTemplate.adapter.add("stroke", function(stroke, target) {
          return chart.colors.getIndex(target.dataItem.index);
        })
        
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.lineX.strokeOpacity = 0;
        chart.cursor.lineY.strokeOpacity = 0;

        return () => {
            chart?.dispose();
        }
    }, [data])
   
    return (
        <Paper elevation={4} style={{height:'inherit',width:'inherit'}} >
           <div id={chartId} style={{ width: "100%", height: "400px" }}></div>
        </Paper>
    )
}

Amchart.propTypes = {
    chartId: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    parentLabel: PropTypes.arrayOf(PropTypes.string).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    options: PropTypes.object.isRequired
};

Amchart.defaultProps = {
    type: "bar"
};

export default Amchart;
