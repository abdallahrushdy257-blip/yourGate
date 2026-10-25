import { BarChart } from "@mui/x-charts";
import * as React from "react";

function MyBarChart({ xData, seriesData, width = 550, height = 350 }) {
    const colors = [
        "#a3ccfe", "#ffb347", "#90ee90", "#f08080", "#dda0dd", "#ffd700", "#87ceeb"
    ];

    const series = seriesData[0].map((value, index) => ({
        data: Array(seriesData[0].length).fill(null).map((_, i) => (i === index ? value : null)),
        color: colors[index % colors.length],
        stack: 'same',  
    }));
    

    return (
        <BarChart
            xAxis={[
                {
                    data: xData,
                    scaleType: 'band',
                    axisLine: { stroke: 'var(--text-color) !important' },
                    tickLabelStyle: {
                        fill: 'var(--text-color) !important',
                        fontSize: '18px',
                    },
                    labelStyle: {
                        fill: 'var(--axis-label-color)',
                        fontWeight: 'bold',
                    },
                },
            ]}
            yAxis={[
                {
                    valueFormatter: (value) => `$${value}K`,
                    axisLine: { stroke: 'var(--text-color) !important' },
                    tickLabelStyle: {
                        fill: 'var(--text-color) !important',
                        fontSize: '18px',
                    },
                    labelStyle: {
                        fill: 'var(--axis-label-color)',
                        fontWeight: 'bold',
                    },
                },
            ]}
            series={series}
            width={width}
            height={height}
            barCategoryGapRatio={0.3}  
            barGapRatio={0.1} 
            className="cusbar-chart"
 
        />
    );
}

export default MyBarChart;
