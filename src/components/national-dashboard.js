import React, { useState, useEffect } from "react";
//import ReactDOM from 'react-dom';
//import './dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Chart from "react-apexcharts";
import Barchart from './barchart';
import LineChart from './lineChart';
import Switch from '@material-ui/core/Switch';
import EnhancedTable from './custom-table';
import Paper from '@material-ui/core/Paper';

function NationalDashboard() {
    const [summarydata, setSummarydata] = useState({});
    const [postivetrend, setPostivetrend] = useState({ daily: { data: [], categories: [] }, cummulative: { data: [], categories: [] } });
    const [recoveredtrend, setRecoveredtrend] = useState({ daily: { data: [], categories: [] }, cummulative: { data: [], categories: [] } });
    const [deathtrend, setDeathtrend] = useState({ daily: { data: [], categories: [] }, cummulative: { data: [], categories: [] } });
    const [isdatavailable, setDataavailable] = useState(false);
    const [state, setState] = useState({
        checkedPostive: false,
        checkedRecover:  false,
        checkedDeath: false,
    });
    const [statewisetrend,setstatewisetrend]= useState({});
    const [isStateDataAvailable,setStateDataAvailable]= useState(false);

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    useEffect(() => {
        fetch("https://api.covid19india.org/data.json")
            .then(response => response.json())
            .then(data => {
                // console.log(data); 
                //console.log(data.cases_time_series.length-1);
                let summarydata = {};
                summarydata.dailyconfirmed = data.cases_time_series[data.cases_time_series.length - 1].dailyconfirmed;
                summarydata.dailydeceased = data.cases_time_series[data.cases_time_series.length - 1].dailydeceased;
                summarydata.dailyrecovered = data.cases_time_series[data.cases_time_series.length - 1].dailyrecovered;
                summarydata.dailyactive = summarydata.dailyconfirmed - summarydata.dailydeceased - summarydata.dailyrecovered;
                summarydata.totalconfirmed = data.cases_time_series[data.cases_time_series.length - 1].totalconfirmed;
                summarydata.totaldeceased = data.cases_time_series[data.cases_time_series.length - 1].totaldeceased;
                summarydata.totalrecovered = data.cases_time_series[data.cases_time_series.length - 1].totalrecovered;
                summarydata.totalactive = summarydata.totalconfirmed - summarydata.totalrecovered - summarydata.totaldeceased;
                setSummarydata(summarydata);

                let postivetrend = {
                    daily: { data: [], categories: [], color: "#ff0000" },
                    cummulative: { data: [], categories: [], color: "#ff0000" }
                };
                let recoveredtrend = {
                    daily: { data: [], categories: [], color: "#33cc33" },
                    cummulative: { data: [], categories: [], color: "#33cc33" }
                };
                let deathtrend = {
                    daily: { data: [], categories: [], color: "#ff0000" },
                    cummulative: { data: [], categories: [], color: "#ff0000" }
                };



                data.cases_time_series.forEach(element => {
                    postivetrend.daily.data.push(parseInt(element.dailyconfirmed));
                    postivetrend.daily.categories.push((element.date).toString());
                    postivetrend.cummulative.data.push(parseInt(element.totalconfirmed));
                    postivetrend.cummulative.categories.push((element.date).toString());

                    recoveredtrend.daily.data.push(parseInt(element.dailyrecovered));
                    recoveredtrend.daily.categories.push((element.date).toString());
                    recoveredtrend.cummulative.data.push(parseInt(element.totalrecovered));
                    recoveredtrend.cummulative.categories.push((element.date).toString());


                    deathtrend.daily.data.push(parseInt(element.dailydeceased));
                    deathtrend.daily.categories.push((element.date).toString());
                    deathtrend.cummulative.data.push(parseInt(element.totaldeceased));
                    deathtrend.cummulative.categories.push((element.date).toString());

                });
                var stateWiseData=[];
                data.statewise.forEach((element)=>{
                    stateWiseData.push({
                        state:element.state,
                        confirmed:parseInt(element.confirmed),
                        recovered:parseInt(element.recovered),
                        deaths:parseInt(element.deaths),
                        recoveryRate:parseInt(element.confirmed)==0.00?0:(((parseInt(element.recovered)/parseInt(element.confirmed))*100).toFixed(2)),
                        deathRate:parseInt(element.confirmed)==0?0.00:(((parseInt(element.deaths)/parseInt(element.confirmed))*100).toFixed(2))

                    })
                });

               // console.log(postivetrend);
                setPostivetrend(postivetrend);
                setRecoveredtrend(recoveredtrend);
                setDeathtrend(deathtrend);
                setstatewisetrend(stateWiseData);
                setStateDataAvailable(true);

            })
    }, []);

    function numberFormatter(number) {
        return new Intl.NumberFormat('en-IN').format(number)
    }

    function showChart() {
        setDataavailable(!isdatavailable);
    }

    // console.log(postivetrend)
    return (<div>
        <div className="summary row ">
            <div className="col-sm-3 summary-card">
              <div className="card-content">  
                    <div className="card-heading">
                        <span>Postive Cases</span>
                    </div>
                    <div className="card-body">
                        <span>{numberFormatter(summarydata.totalconfirmed)}</span>
                    </div>
                    <div className="card-variance">
                        <span>{numberFormatter(summarydata.dailyconfirmed)}</span>
                        <FontAwesomeIcon icon="arrow-up" />
                    </div>
                </div>
                
            </div>
            <div className="col-sm-3 summary-card">
                <div className="card-content">
                    <div className="card-heading">
                        <span>Active Cases</span>
                    </div>
                    <div className="card-body">
                        <span>{numberFormatter(summarydata.totalactive)}</span>
                    </div>
                    <div className="card-variance">
                        <span>{numberFormatter(summarydata.dailyactive)}</span>
                        <FontAwesomeIcon icon="arrow-up" />
                    </div>
                </div>
            </div>
            <div className="col-sm-3 summary-card">
                <div className="card-content">
                    <div className="card-heading">
                        <span>Recovered Cases</span>
                    </div>
                    <div className="card-body">
                        <span>{numberFormatter(summarydata.totalrecovered)}</span>
                    </div>
                    <div className="card-variance">
                        <span>{numberFormatter(summarydata.dailyrecovered)}</span>
                        <FontAwesomeIcon icon="arrow-up" />
                    </div>
                </div>
            </div>
            <div className="col-sm-3 summary-card">
                <div className="card-content">
                    <div className="card-heading">
                        <span>Death Cases</span>
                    </div>
                    <div className="card-body">
                        <span>{numberFormatter(summarydata.totaldeceased)}</span>
                    </div>
                    <div className="card-variance">
                        <span>{numberFormatter(summarydata.dailydeceased)}</span>
                        <FontAwesomeIcon icon="arrow-up" />
                    </div>
                </div>
            </div>

        </div>
        <div className="summary barchart">
            <div className="bar-heading">
                <span className="chart-title">Postive Cases Trend</span>
                <span className="switch-button">Daily</span> <Switch
                    checked={state.checkedPostive}
                    onChange={handleChange}
                    name="checkedPostive"
                    color="default"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                <span className="switch-button">Cumulative</span>
            </div>
            <div className="bar-body">
                {!state.checkedPostive && <Barchart data={postivetrend.daily.data} categories={postivetrend.daily.categories} color={postivetrend.daily.color}></Barchart>}
                {state.checkedPostive && <LineChart data={postivetrend.cummulative.data} categories={postivetrend.cummulative.categories} color={postivetrend.cummulative.color}></LineChart>}
            </div>
        </div>
        <div className="summary barchart">
            <div className="bar-heading">
                <span className="chart-title">Recovered Cases Trend</span>
                <span className="switch-button">Daily</span> <Switch
                    checked={state.checkedRecover}
                    onChange={handleChange}
                    name="checkedRecover"
                    color="default"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                <span className="switch-button">Cumulative</span>
            </div>
            <div className="bar-body">
                {!state.checkedRecover && <Barchart data={recoveredtrend.daily.data} categories={recoveredtrend.daily.categories} color={recoveredtrend.daily.color}></Barchart>}
                {state.checkedRecover && <LineChart data={recoveredtrend.cummulative.data} categories={recoveredtrend.cummulative.categories} color={recoveredtrend.cummulative.color}></LineChart>}

            </div>
        </div>
        <div className="summary barchart">
            <div className="bar-heading">
                <span className="chart-title">Death Cases Trend</span>
                <span className="switch-button">Daily</span> <Switch
                    checked={state.checkedDeath}
                    onChange={handleChange}
                    name="checkedDeath"
                    color="default"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                <span className="switch-button">Cumulative</span>
            </div>
            <div className="bar-body">
                {!state.checkedDeath && <Barchart data={deathtrend.daily.data} categories={deathtrend.daily.categories} color={deathtrend.daily.color}></Barchart>}
                {state.checkedDeath && <LineChart data={deathtrend.cummulative.data} categories={deathtrend.cummulative.categories} color={deathtrend.cummulative.color}></LineChart>}

            </div>
        </div>
        <div className="summary barchart">
            <div className="bar-heading">
                <span className="chart-title">State Wise Case</span>
            </div>
            <div className="bar-body">
              {isStateDataAvailable && <EnhancedTable data={statewisetrend}></EnhancedTable>}
            </div>
        </div>         
        
    </div>);

}

export default NationalDashboard;