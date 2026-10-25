import * as React from 'react';
import { LineChart as MuiLineChart } from '@mui/x-charts/LineChart';

function MyLineChart({ xData, yData, width = 500, height = 300 }) {
  return (
    <MuiLineChart
      xAxis={[
        {
          data: xData,
          scaleType: 'band',
          axisLine: { stroke: 'var(--text-color)' },
          tickLabelStyle: {
            fill: 'var(--text-color)',
            fontSize: 'var(--axis-font-size)',
          },
          labelStyle: {
            fill: 'var(--axis-label-color)',
            fontWeight: 'bold',
          },
        },
      ]}
      yAxis={[
        {
          valueFormatter: (value) => `${value}K`,
          axisLine: { stroke: 'var(--text-color)' },
          tickLabelStyle: {
            fill: 'var(--text-color)',
            fontSize: 'var(--axis-font-size)',
          },
          labelStyle: {
            fill: 'var(--axis-label-color)',
            fontWeight: 'bold',
          },
        },
      ]}
      series={[
        {
          data: yData,
          area: true,
          showMark: true,
          color: '#8aaafe',
          curve: 'monotoneX'
        },
      ]}
      grid={{ horizontal: true, vertical: true }}
      margin={{ top: 20, bottom: 50, left: 60, right: 20 }}
      width={width}
      height={height}
      sx={{
        '.MuiChartsAxis-line': {
          stroke: 'var(--text-color)',
        },
        '.MuiChartsAxis-tickLabel': {
          fill: 'var(--axis-tick-color)',
          fontSize: 'var(--axis-font-size)',
        },
        '.MuiChartsAxis-label': {
          fill: 'var(--axis-label-color)',
        },
      }}
    />
  );
}

export default MyLineChart;
