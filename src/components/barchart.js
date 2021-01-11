import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";


function Barchar(props) {
    const [chartdata, setChartdata] = useState({options:{},series:[]});

    useEffect(() => {
      //  console.log(props);

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
            setChartdata({options:options,series:series})
    },[props])

    return (
        <div>
            <Chart
                options={chartdata.options}
                series={chartdata.series}
                type="bar"
                width="100%"
                height="400px"
            />
        </div>
    )
}

export default Barchar;