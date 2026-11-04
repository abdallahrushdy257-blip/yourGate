import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const DonutChart = (props) => {
    const options = {
        chart: {
            type: 'pie',
            backgroundColor: null,
        },
        title: {
            text: props.title,
            style: {
                color: 'var(--text-color)',
                fontSize: '20px',
                fontWeight: 'bold',
            },
        },
        plotOptions: {
            pie: {
                innerSize: '80%',
                shadow: false,
                dataLabels: {
                    enabled: true,
                    style: {
                        fontSize: '16px',
                        fontWeight: 'bold',
                        textOutline: 'none',
                        color: 'var(--text-color)',
                    },
                },
            },
        },
        // plotOptions: {
        //     pie: {
        //         innerSize: '80%',
        //         borderWidth: 0,
        //         dataLabels: {
        //             enabled: true,
        //             format: '{point.name}: {point.percentage:.1f} %',
        //             style: {
        //                 fontSize: '16px',
        //                 fontWeight: 'bold',
        //                 textOutline: 'none',
        //                 color: 'var(--text-color)',
        //             },
        //         },
        //     },
        // },

        series: [{
            name: 'Status',
            data: [
                { name: props.name1, y: props.paid, color: '#A3CCFE' },
                { name: props.name2, y: props.remaining, color: '#284160' }
            ],
        }],
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            itemMarginTop: 10,
            labelFormatter: function () {
                return `<span style="color:${this.color}">${this.name}</span>: ${this.y} (${this.percentage.toFixed(1)}%)`;
            }
        },
        subtitle: {
            // text: '<h2 style="font-size: 30px; font-weight: bold;">' + Highcharts.numberFormat(props.total, 0, '.', ',') + '</h2> <br><h4 style="background: #EEEEF0 !important;"> ' + props.subtitle + '</h4>',
            text:
                '<h2 style="font-size: 30px; font-weight: bold;">' +
                Highcharts.numberFormat(props.paid, 1) + '%</h2>' +
                '<br><h4 style="background: #EEEEF0 !important;">' +
                props.subtitle +
                '</h4>',
            style: {
                fontSize: '20px',
                fontWeight: 'normal',
                color: 'var(--text-color)',
                textAlign: 'center',
            },
            verticalAlign: 'middle',
            align: 'center',
            y: 55,
        },
    };

    return (
        <div>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
};

export default DonutChart;
