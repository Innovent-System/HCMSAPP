import React, { useEffect, useLayoutEffect, useRef } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import Amchart from '../../components/Amchart'

am4core.useTheme(am4themes_animated);

const AttendanceDashboard = () => {
  const trendChartRef = useRef(null);
  const lateChartRef = useRef(null);
  const pieChartRef = useRef(null);

  // Dummy Data (Replace with API)
  const summary = {
    total: 120,
    present: 95,
    absent: 10,
    late: 8,
    leave: 7,
  };

  const trendData = [
    { date: "2026-02-10", attendance: 85 },
    { date: "2026-02-11", attendance: 88 },
    { date: "2026-02-12", attendance: 90 },
    { date: "2026-02-13", attendance: 87 },
    { date: "2026-02-14", attendance: 92 },
  ];

  const lateData = [
    { date: "Mon", late: 5 },
    { date: "Tue", late: 8 },
    { date: "Wed", late: 4 },
    { date: "Thu", late: 7 },
    { date: "Fri", late: 3 },
  ];

  const departmentData = [
    { department: "HR", value: 95 },
    { department: "IT", value: 88 },
    { department: "Sales", value: 75 },
    { department: "Accounts", value: 90 },
  ];

  // Attendance Trend Chart
  useLayoutEffect(() => {
    let chart = am4core.create("trendChart", am4charts.XYChart);
    chart.data = trendData;

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "attendance";
    series.name = "Attendance %";
    series.strokeWidth = 3;
    series.tooltipText = "{valueY}%";

    chart.cursor = new am4charts.XYCursor();

    trendChartRef.current = chart;

    return () => {
      chart.dispose();
    };
  }, []);

  // Late Bar Chart
  useLayoutEffect(() => {
    let chart = am4core.create("lateChart", am4charts.XYChart);
    chart.data = lateData;

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "date";

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = "date";
    series.dataFields.valueY = "late";
    series.tooltipText = "{valueY} Late";

    chart.cursor = new am4charts.XYCursor();

    lateChartRef.current = chart;

    return () => {
      chart.dispose();
    };
  }, []);

  // Department Pie Chart
  useLayoutEffect(() => {
    let chart = am4core.create("pieChart", am4charts.PieChart);
    chart.data = departmentData;

    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "value";
    pieSeries.dataFields.category = "department";

    pieChartRef.current = chart;

    return () => {
      chart.dispose();
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Attendance Dashboard</h2>

      {/* KPI Cards */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        <Card title="Total" value={summary.total} />
        <Card title="Present" value={summary.present} />
        <Card title="Absent" value={summary.absent} />
        <Card title="Late" value={summary.late} />
        <Card title="On Leave" value={summary.leave} />
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div>
          <h4>Attendance Trend</h4>
          <div id="trendChart" style={{ width: "100%", height: "400px" }} />
        </div>

        <div>
          <h4>Late Trend</h4>
          <Amchart chartId="lateChart2" type='XY' data={lateData}
            dataId={'date'} dataName={'late'}
            // yHeading="Areas"
          />
          <div id="lateChart" style={{ width: "100%", height: "400px" }} />
        </div>

        <div style={{ gridColumn: "span 2" }}>
          <h4>Department Attendance</h4>
          <div id="pieChart" style={{ width: "100%", height: "400px" }} />
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div
    style={{
      flex: 1,
      padding: "15px",
      background: "#f4f6f8",
      borderRadius: "8px",
      textAlign: "center",
    }}
  >
    <h4>{title}</h4>
    <h2>{value}</h2>
  </div>
);

export default AttendanceDashboard;