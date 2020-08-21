import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

function LineChart(props) {

    const [chartdata, setChartdata] = useState({ options: {}, series: [] });


    useEffect(() => {
        console.log(props);

        var options = {
            colors: [props.color],
            chart: {
                id: "basic-bar",
                foreColor: 'blue'
            },
            tooltip: {
                y: {
                  formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
                    return new Intl.NumberFormat('en-IN').format(value)
                  }
                }
            },
            annotations: {
                xaxis: [
                  {
                    x:"31 May ",
                    borderColor: '#c2c2c2',
                    label: {
                      style: {
                        color: 'black',
                        background:'#0080ff'
                      },
                      text: 'Lock Down Ended'
                    }
                  }
                ]
              },
            xaxis: {
                categories: props.categories,
                labeles: {
                    hideOverlappingLabels: true,
                }
            },
            dataLabels: {
                enabled: false,
                
            },

        }

        var series = [
            {
                name: "count",
                data: props.data
            }]
      //  console.log({ options: options, series: series })
        setChartdata({ options: options, series: series })
    }, [props])

    return (
        <div>
            <Chart
                options={chartdata.options}
                series={chartdata.series}
                type="line"
                width="100%"
                height="500px"
            />
        </div>
    )
}

export default LineChart;