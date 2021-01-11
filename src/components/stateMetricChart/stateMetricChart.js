import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
//import ApexCharts from 'apexcharts';
import Paper from '@material-ui/core/Paper';
import './stateMetricChart.css'; 

function StateMetricChart(props) {
  const [chartdata, setChartdata] = useState({ options: {}, series: [] });

  useEffect(() => {
    let states = [];
    let count = [];
    props.data.sort((a,b)=>{
      return b.confirmed - a.confirmed;
    });
    props.data.forEach(element => {
      states.push(element.state);
      count.push(element.confirmed);
    });
    var options = {
      colors: "#ff0000",
      chart: {
        id: "basic-bar",
        foreColor: 'blue'
      },
      tooltip: {
        custom: function({series, seriesIndex, dataPointIndex, w}) {

          return '<div>'+
          '<div className = "row red"'+
          '<span style="{{textAlign:center}}">'+props.data[dataPointIndex].state+'</span>'+
          '</div>'+
          '<ul>'+
          '<li>Confirmed Cases: '+new Intl.NumberFormat('en-IN').format(props.data[dataPointIndex].confirmed)+'</li>'+
          '<li>Recovered: '+new Intl.NumberFormat('en-IN').format(props.data[dataPointIndex].recovered)+'</li>'+
          '<li>Deaths: '+new Intl.NumberFormat('en-IN').format(props.data[dataPointIndex].deaths)+'</li></ul></div>'
        }
        
      },
      xaxis: {
        categories: states,
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
        name: "Confirmed Cases",
        data: count
      }]
    setChartdata({ options: options, series: series })
  }, [props])

  return (
    <Paper className="card-content">
      <div className="row">
        <div className="col-sm-4">
          <span className="chart-title">State wise Count</span>
        </div>

      </div>
      <div className="row chart">
        <div className="col-sm-12">
        <Chart
          options={chartdata.options}
          series={chartdata.series}
          type="bar"
          width="100%"
          height="400px"
        />
        </div>
      </div>
    </Paper>
  )

}
export default StateMetricChart; 