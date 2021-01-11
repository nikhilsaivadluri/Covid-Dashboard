import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import './radialBar.css'

function RadialBar(props) {
    const [chartdata, setChartdata] = useState({ options: {}, series: [] });
  
    useEffect(() => {
        var options = {
            plotOptions: {
                radialBar: {
                  hollow: {
                    margin: 15,
                    size: "70%",
                  },                
                  dataLabels: {
                    showOn: "always",
                    name: {
                      offsetY: -10,
                      show: true,
                      color: props.color,
                      fontSize: "13px"
                    },
                    value: {
                      color: props.color,
                      fontSize: "30px",
                      show: true
                    }
                  }
                }
              },
              fill:{
                  colors:props.color
              },
              stroke: {
                lineCap: "round",
              },
              labels: [props.name]
      
          };
      
          var series = [props.value]
          setChartdata({ options: options, series: series })


    },[props])

    return(
        <div className="row radialchart">
        <Chart
          options={chartdata.options}
          series={chartdata.series}
          type="radialBar"
          width="100%"
          height="250px"
        />
        </div>
    )

}
export default RadialBar;
