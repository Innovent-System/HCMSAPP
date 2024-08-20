import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4core from "@amcharts/amcharts4/core";
export const ChartType = {
    XY: "XY",
    PIE: "PIE"
}

const XYChart = (option = { chartId: "", data: [], dataId: "", dataName: "", yHeading: "" }) => {
    const { chartId, data, dataId, dataName, yHeading } = option;

    const chart = am4core.create(chartId, am4charts.XYChart);
    // Add data
    chart.data = data;

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = dataId;
    categoryAxis.renderer.labels.template.rotation = 320;
    categoryAxis.renderer.labels.template.hideOversized = false;
    categoryAxis.renderer.labels.template.fontSize = 12
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.tooltip.__disabled = true; // disable tooltip
    // categoryAxis.tooltip.label.rotation = 270;
    // categoryAxis.tooltip.label.horizontalCenter = "right";
    // categoryAxis.tooltip.label.verticalCenter = "middle";

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = yHeading;
    valueAxis.title.fontWeight = "bold";
    valueAxis.title.fontSize = 14;
    valueAxis.title.align = "center";

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = dataName;
    series.dataFields.categoryX = dataId;
    series.name = "Count";
    series.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = .8;

    var columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.stroke = am4core.color("#FFFFFF");

    columnTemplate.adapter.add("fill", function (fill, target) {
        return chart.colors.getIndex(target.dataItem.index);
    })

    columnTemplate.adapter.add("stroke", function (stroke, target) {
        return chart.colors.getIndex(target.dataItem.index);
    })

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.strokeOpacity = 0;
    chart.cursor.lineY.strokeOpacity = 0;

    return chart;
}

const PieChart = (option = { chartId: "", data: [], dataId: "", dataName: "" }) => {
    const { chartId, data, dataId, dataName } = option;
    const chart = am4core.create(chartId, am4charts.PieChart);

    // Add data
    chart.data = data;

    // Add and configure Series
    const pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = dataName;
    pieSeries.dataFields.category = dataId;

    // Let's cut a hole in our Pie chart the size of 40% the radius
    // chart.innerRadius = am4core.percent(40);

    // // Disable ticks and labels
    // pieSeries.labels.template.disabled = true;
    // pieSeries.ticks.template.disabled = true;

    // // Disable tooltips
    // pieSeries.slices.template.tooltipText = "";

    // Add a legend
    chart.legend = new am4charts.Legend();
}

export const getChart = (option = { type: ChartType.XY, chartId: "", data: [], dataId: "", dataName: "" }) => {
    const { type, ...restOpt } = option;
    switch (type) {
        case ChartType.XY:
            return XYChart(restOpt);
        case ChartType.PIE:
            return PieChart(restOpt)
        default:
            return XYChart(restOpt);
    }
}