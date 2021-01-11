import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";


function AreaChart(props) {
    const [chartdata, setChartdata] = useState({ options: {}, series: [] });

    useEffect(() => {
     //   console.log(props);
        var options = {
            colors: [props.color],
            chart: {
                type: 'area',
                zoom: {
                    enabled: false
                },
                toolbar: {
                    show: false,
                }
            },
            sparkline: {
                enabled: true
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'straight'
            },
            labels: props.labels,
            xaxis: {
                type: 'datetime',
                labels: {
                    show: false
                },
                crosshairs: {
                    show: false,
                    dropShadow: {
                        enabled: false,
                    }
                }   
            },
            yaxis: {
                labels: {
                    show: false
                },
            },
            grid: {
                show: false
            },
            legend: {
                horizontalAlign: 'left'
            },
            tooltip: {
                y: {
                    formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
                        return new Intl.NumberFormat('en-IN').format(value)
                    }
                },

            }
        };


        var series = [
            {
                name: "count",
                data: props.data
            }]
        setChartdata({ options: options, series: series })
    }, [props]);

    return (
        <div>
            <Chart
                options={chartdata.options}
                series={chartdata.series}
                type="area"
                width="100%"
                height="200px"

            />
        </div>
    )
}

export default AreaChart;