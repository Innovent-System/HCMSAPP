import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { Box, Paper, Stack, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { essColors } from "./theme";
import { useSingleQuery } from "@/store/actions/httpactions";

/**
 * @param {{
 *   thisMonthTotal: string,     // "162h 40m"
 *   averagePerDay: string,      // "8h 12m"
 *   vsLastMonthPct: number,     // 4 -> renders "↑ 4%"
 *   data: Array<{ date: string, hours: number }>,   // for the current view (daily or monthly-by-day)
 *   view: "daily" | "monthly",
 *   onViewChange: (view: "daily" | "monthly") => void,
 * }} props
 */
export default function WorkHoursChart({
  thisMonthTotal,
  averagePerDay,
  vsLastMonthPct,

  view,
  onViewChange,
}) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [isDark, setIsDark] = useState(false); // placeholder if you theme-switch amCharts elsewhere
  const { data } = useSingleQuery(
    { url: `ESSDashboard/workhours`, params: {} },
    { selectFromResult: ({ data }) => ({ data: data?.result }) }
  );
  useLayoutEffect(() => {
    const chart = am4core.create(chartRef.current, am4charts.XYChart);
    chartInstance.current = chart;

    chart.paddingLeft = 0;
    chart.paddingRight = 0;
    chart.paddingTop = 8;

    const dateAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    dateAxis.dataFields.category = "date";
    dateAxis.renderer.grid.template.disabled = true;
    dateAxis.renderer.labels.template.fontSize = 11;
    dateAxis.renderer.labels.template.fill = am4core.color(essColors.textFaint);
    dateAxis.renderer.minGridDistance = 30;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 10;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.grid.template.stroke = am4core.color(essColors.border);
    valueAxis.renderer.labels.template.fontSize = 11;
    valueAxis.renderer.labels.template.fill = am4core.color(essColors.textFaint);
    valueAxis.renderer.labels.template.adapter.add("text", (text) => (text ? `${text}h` : text));

    const series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.categoryX = "date";
    series.dataFields.valueY = "hours";
    series.stroke = am4core.color(essColors.teal);
    series.strokeWidth = 2.5;
    series.tensionX = 0.8;
    series.fillOpacity = 0.08;
    series.fill = am4core.color(essColors.teal);

    const bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.radius = 3;
    bullet.circle.fill = am4core.color(essColors.teal);
    bullet.circle.strokeWidth = 0;
    bullet.visible = false; // matches the reference's clean line; flip to true for hover markers

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineY.disabled = true;

    return () => chart.dispose();
  }, []);

  // Push data updates without recreating the chart
  useEffect(() => {
    if (chartInstance.current && data) {
      chartInstance.current.data = data.data;
    }
  }, [data]);

  return (
    <Paper elevation={0} sx={{ borderRadius: "10px", p: 2.25, boxShadow: "0 1px 2px rgba(16,28,48,0.06)", height: "100%" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.75}>
        <Typography sx={{ fontSize: 15, fontWeight: 500, color: essColors.navy }}>Work hours</Typography>

        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_, v) => v && onViewChange(v)}
          size="small"
          sx={{
            bgcolor: "#F3F4F6",
            borderRadius: "8px",
            p: "3px",
            "& .MuiToggleButton-root": {
              border: "none",
              textTransform: "none",
              fontSize: 12,
              color: essColors.textMuted,
              px: 1.5,
              py: 0.5,
              borderRadius: "6px !important",
              "&.Mui-selected": {
                bgcolor: essColors.navy,
                color: "#fff",
                fontWeight: 500,
                "&:hover": { bgcolor: essColors.navyDark },
              },
            },
          }}
        >
          {/* <ToggleButton value="daily">Daily</ToggleButton> */}
          <ToggleButton value="monthly">Monthly</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Stack direction="row" spacing={3.5} mb={2}>
        <Box>
          <Typography sx={{ fontSize: 11, color: essColors.textFaint, mb: 0.25 }}>This month</Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: essColors.navy }}>{data?.thisMonthTotal}</Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 11, color: essColors.textFaint, mb: 0.25 }}>Average / day</Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: essColors.navy }}>{data?.averagePerDay}</Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 11, color: essColors.textFaint, mb: 0.25 }}>vs last month</Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: essColors.teal }}>
            ↑ {data?.vsLastMonthPct}%
          </Typography>
        </Box>
      </Stack>

      <Box ref={chartRef} sx={{ width: "100%", height: 160 }} />
    </Paper>
  );
}
