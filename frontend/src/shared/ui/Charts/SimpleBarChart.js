import { BarChart } from "@mui/x-charts";
import * as React from "react";

function SimpleMyBarChart({ xData, seriesData, width = 500, height = 300 }) {
  const colors = [
    "#a3ccfe", "#ffb347", "#90ee90", "#f08080", "#dda0dd", "#ffd700", "#87ceeb"
  ];

  const series = seriesData.map((value, index) => ({
    data: Array(seriesData.length).fill(null).map((_, i) => (i === index ? value : null)),
    color: colors[index % colors.length],
    stack: 'same',
  }));

  return (
   <BarChart
  xAxis={[
    {
      data: xData,
      scaleType: 'band',
      tickLabelStyle: {
        fill: 'var(--text-color)',
        fontSize: 14,
      },
      lineStyle: {
        stroke: 'var(--text-color)', // ← يغيّر لون خط X axis
      },
    },
  ]}
  yAxis={[
    {
      tickLabelStyle: {
        fill: 'var(--text-color)',
        fontSize: 14,
        //marginRight: 10,
      },
      lineStyle: {
        stroke: 'var(--text-color)', // ← يغيّر لون خط Y axis
      },
    },
  ]}
  series={series}
  width={width}
  height={height}
   className="cusbar-chart"
/>
  );
}

export default SimpleMyBarChart;
