import React, { useState, useEffect } from "react";
//import ReactDOM from 'react-dom';
//import './dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import Chart from "react-apexcharts";
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
    const [stateMetric, setStateMetric] = useState({});
    const [state, setState] = useState({
        checkedPostive: false,
        checkedRecover: false,
        checkedDeath: false,
    });
    const [statewisetrend, setstatewisetrend] = useState({});
    const [isStateDataAvailable, setStateDataAvailable] = useState(false);
    const UTs = ["DN", "CH", "LA", "AN", "PY", "TT", "UN", "LD"];
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
                summarydata.deathRate = (((parseInt(summarydata.totaldeceased) / parseInt(summarydata.totalconfirmed)) * 100).toFixed(2));
                summarydata.recoveryRate = (((parseInt(summarydata.totalrecovered) / parseInt(summarydata.totalconfirmed)) * 100).toFixed(2));
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

                let StateMetrics = {
                    highestConfirmed: { state: "", value: "" },
                    lowestConfirmed: { state: "", value: "" },
                    highestDeaths: { state: "", value: "" },
                    lowestDeaths: { state: "", value: "" },
                    highestRecoverRate: { state: "", value: "" },
                    lowestRecoverRate: { state: "", value: "" },
                    highestDeathRate: { state: "", value: "" },
                    lowestDeathRate: { state: "", value: "" },
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
                var stateWiseData = [];
                var stateWiseDataOnly = [];
                data.statewise.forEach((element) => {
                    stateWiseData.push({
                        state: element.state,
                        confirmed: parseInt(element.confirmed),
                        recovered: parseInt(element.recovered),
                        deaths: parseInt(element.deaths),
                        recoveryRate: parseInt(element.confirmed) === 0.00 ? 0 : (((parseInt(element.recovered) / parseInt(element.confirmed)) * 100).toFixed(2)),
                        deathRate: parseInt(element.confirmed) === 0 ? 0.00 : (((parseInt(element.deaths) / parseInt(element.confirmed)) * 100).toFixed(2))

                    })

                    if (!UTs.includes(element.statecode)) {
                        stateWiseDataOnly.push({
                            state: element.state,
                            confirmed: parseInt(element.confirmed),
                            recovered: parseInt(element.recovered),
                            deaths: parseInt(element.deaths),
                            recoveryRate: parseInt(element.confirmed) === 0.00 ? 0 : (((parseInt(element.recovered) / parseInt(element.confirmed)) * 100).toFixed(2)),
                            deathRate: parseInt(element.confirmed) === 0 ? 0.00 : (((parseInt(element.deaths) / parseInt(element.confirmed)) * 100).toFixed(2))
                        })
                    }
                });

                stateWiseDataOnly.sort((a, b) => {
                    return b.confirmed - a.confirmed;
                });

                StateMetrics.highestConfirmed.state = stateWiseDataOnly[0].state;
                StateMetrics.highestConfirmed.value = stateWiseDataOnly[0].confirmed;
                StateMetrics.lowestConfirmed.state = stateWiseDataOnly[stateWiseDataOnly.length - 1].state;
                StateMetrics.lowestConfirmed.value = stateWiseDataOnly[stateWiseDataOnly.length - 1].confirmed;

                stateWiseDataOnly.sort((a, b) => {
                    return b.deaths - a.deaths;
                });

                StateMetrics.highestDeaths.state = stateWiseDataOnly[0].state;
                StateMetrics.highestDeaths.value = stateWiseDataOnly[0].deaths;
                StateMetrics.lowestDeaths.state = stateWiseDataOnly[stateWiseDataOnly.length - 1].state;
                StateMetrics.lowestDeaths.value = stateWiseDataOnly[stateWiseDataOnly.length - 1].deaths;

                stateWiseDataOnly.sort((a, b) => {
                    return b.recoveryRate - a.recoveryRate;
                });

                StateMetrics.highestRecoverRate.state = stateWiseDataOnly[0].state;
                StateMetrics.highestRecoverRate.value = stateWiseDataOnly[0].recoveryRate;
                StateMetrics.lowestRecoverRate.state = stateWiseDataOnly[stateWiseDataOnly.length - 1].state;
                StateMetrics.lowestRecoverRate.value = stateWiseDataOnly[stateWiseDataOnly.length - 1].recoveryRate;

                stateWiseDataOnly.sort((a, b) => {
                    return b.deathRate - a.deathRate;
                });

                StateMetrics.highestDeathRate.state = stateWiseDataOnly[0].state;
                StateMetrics.highestDeathRate.value = stateWiseDataOnly[0].deathRate;
                StateMetrics.lowestDeathRate.state = stateWiseDataOnly[stateWiseDataOnly.length - 1].state;
                StateMetrics.lowestDeathRate.value = stateWiseDataOnly[stateWiseDataOnly.length - 1].deathRate;

                console.log(StateMetrics);

                // console.log(postivetrend);
                setStateMetric(StateMetrics);
                setPostivetrend(postivetrend);
                setRecoveredtrend(recoveredtrend);
                setDeathtrend(deathtrend);
                setstatewisetrend(stateWiseData);
                setStateDataAvailable(true);
                setDataavailable(true);

            })
    }, []);

    function numberFormatter(number) {
        return new Intl.NumberFormat('en-IN').format(number)
    }


    return (<div>
        <div className="summary row mr-lf-25">
            <div className="col-sm-2 summary-card">
                <Paper className="card-content">
                    <div className="card-heading">
                        <span>Confirmed Cases</span>
                    </div>
                    <div className="card-body">
                        <span className="red">{numberFormatter(summarydata.totalconfirmed)}</span>
                    </div>
                    <div className={["card-variance", "red"].join(" ")}>
                        <span >{numberFormatter(summarydata.dailyconfirmed)}</span>
                        <FontAwesomeIcon icon="arrow-up" />
                    </div>
                </Paper>

            </div>
            <div className="col-sm-2 summary-card">
                <Paper className="card-content">
                    <div className="card-heading">
                        <span>Active Cases</span>
                    </div>
                    <div className="card-body">
                        <span className="red">{numberFormatter(summarydata.totalactive)}</span>
                    </div>
                    {summarydata.dailyactive > 0 && <div className={["card-variance", "red"].join(" ")}>
                        <span>{numberFormatter(summarydata.dailyactive)}</span>
                        <FontAwesomeIcon icon="arrow-up" />
                    </div>}
                    {summarydata.dailyactive <= 0 && <div className={["card-variance", "green"].join(" ")}>
                        <span>{numberFormatter(summarydata.dailyactive)}</span>
                        <FontAwesomeIcon icon="arrow-down" />
                    </div>}
                </Paper>
            </div>
            <div className="col-sm-2 summary-card">
                <Paper className="card-content">
                    <div className="card-heading">
                        <span>Recovered</span>
                    </div>
                    <div className="card-body">
                        <span className="green">{numberFormatter(summarydata.totalrecovered)}</span>
                    </div>
                    <div className={["card-variance", "green"].join(" ")}>
                        <span>{numberFormatter(summarydata.dailyrecovered)}</span>
                        <FontAwesomeIcon icon="arrow-up" />
                    </div>
                </Paper>
            </div>
            <div className="col-sm-2 summary-card">
                <Paper className="card-content">
                    <div className="card-heading">
                        <span  >Deaths</span>
                    </div>
                    <div className="card-body">
                        <span className="grey">{numberFormatter(summarydata.totaldeceased)}</span>
                    </div>
                    <div className={["card-variance", "grey"].join(" ")}>
                        <span>{numberFormatter(summarydata.dailydeceased)}</span>
                        <FontAwesomeIcon icon="arrow-up" />
                    </div>
                </Paper>
            </div>
            <div className="col-sm-2 summary-card">
                <Paper className="card-content">
                    <div className="card-heading">
                        <span>Recovery Rate</span>
                    </div>
                    <div className="card-body percentCardbody">
                        <span className={["green", "percentCard"].join(" ")}>{numberFormatter(summarydata.recoveryRate)}%</span>
                    </div>
                    {/* <div className="card-variance">
                        <span>{numberFormatter(summarydata.recoveryRate)}</span>
                        <FontAwesomeIcon icon="arrow-up" />
                    </div> */}
                </Paper>
            </div>
            <div className="col-sm-2 summary-card">
                <Paper className="card-content">
                    <div className="card-heading">
                        <span>Death Rate</span>
                    </div>
                    <div className="card-body percentCardbody">
                        <span className={["grey", "percentCard"].join(" ")}>{numberFormatter(summarydata.deathRate)}%</span>
                    </div>
                    {/* <div className="card-variance">
                        <span>{numberFormatter(summarydata.deathRate)}</span>
                        <FontAwesomeIcon icon="arrow-up" />
                    </div> */}
                </Paper>
            </div>

        </div>
        <div className="row mr-lr-0">
            <div className="col-sm-9">
                <Paper className="summary barchart">
                    <div className="row bar-heading">
                        <div className="col-sm-4">
                            <span className="chart-title">Confirmed Cases Trend</span>
                        </div>
                        <div className="col-sm-4">
                            <span className="switch-button">Daily</span>
                            <Switch
                                checked={state.checkedPostive}
                                onChange={handleChange}
                                name="checkedPostive"
                                color="default"
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />
                            <span className="switch-button">Cumulative</span>
                        </div>
                    </div>
                    <div className="bar-body">
                        {isdatavailable && !state.checkedPostive && <Barchart data={postivetrend.daily.data} categories={postivetrend.daily.categories} color={postivetrend.daily.color}></Barchart>}
                        {isdatavailable && state.checkedPostive && <LineChart data={postivetrend.cummulative.data} categories={postivetrend.cummulative.categories} color={postivetrend.cummulative.color}></LineChart>}
                    </div>
                </Paper>
                <Paper className="summary barchart">
                <div className="row bar-heading">
                        <div className="col-sm-4">
                            <span className="chart-title">Recovered Cases Trend</span>
                        </div>
                        <div className="col-sm-4">
                            <span className="switch-button">Daily</span>
                            <Switch
                                checked={state.checkedRecover}
                                onChange={handleChange}
                                name="checkedRecover"
                                color="default"
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />
                            <span className="switch-button">Cumulative</span>
                        </div>
                    </div>
                    <div className="bar-body">
                        {isdatavailable && !state.checkedRecover && <Barchart data={recoveredtrend.daily.data} categories={recoveredtrend.daily.categories} color={recoveredtrend.daily.color}></Barchart>}
                        {isdatavailable && state.checkedRecover && <LineChart data={recoveredtrend.cummulative.data} categories={recoveredtrend.cummulative.categories} color={recoveredtrend.cummulative.color}></LineChart>}

                    </div>
                </Paper>
                <Paper className="summary barchart">
                <div className="row bar-heading">
                        <div className="col-sm-4">
                            <span className="chart-title">Death Cases Trend</span>
                        </div>
                        <div className="col-sm-4">
                            <span className="switch-button">Daily</span>
                            <Switch
                                checked={state.checkedDeath}
                                onChange={handleChange}
                                name="checkedDeath"
                                color="default"
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />
                            <span className="switch-button">Cumulative</span>
                        </div>
                    </div>
                    <div className="bar-body">
                        {isdatavailable && !state.checkedDeath && <Barchart data={deathtrend.daily.data} categories={deathtrend.daily.categories} color={deathtrend.daily.color}></Barchart>}
                        {isdatavailable && state.checkedDeath && <LineChart data={deathtrend.cummulative.data} categories={deathtrend.cummulative.categories} color={deathtrend.cummulative.color}></LineChart>}

                    </div>
                </Paper>
                <Paper className="summary barchart">
                    <div className="bar-heading">
                        <span className="chart-title">State Wise Case</span>
                    </div>
                    <div className="bar-body">
                        {isStateDataAvailable && <EnhancedTable data={statewisetrend}></EnhancedTable>}
                    </div>
                </Paper>
                <div className="heightSeparator">
                </div>
            </div>
            {isStateDataAvailable && <div className="col-sm-3">
                <Paper className="stateCardContent">
                    <div className="stateCardHeading">
                        <span>State with Highest Confirmed Cases</span>
                    </div>
                    <div className="stateCardBody">
                        <span className="red">{stateMetric.highestConfirmed.state}</span>
                    </div>
                    <div className={["card-variance", "red"].join(" ")}>
                        <span >{numberFormatter(stateMetric.highestConfirmed.value)}</span>
                    </div>
                </Paper>
                <Paper className="stateCardContent">
                    <div className="stateCardHeading">
                        <span>State with Lowest Confirmed Cases</span>
                    </div>
                    <div className="stateCardBody">
                        <span className="green">{stateMetric.lowestConfirmed.state}</span>
                    </div>
                    <div className={["card-variance", "green"].join(" ")}>
                        <span >{numberFormatter(stateMetric.lowestConfirmed.value)}</span>
                    </div>
                </Paper>
                <Paper className="stateCardContent">
                    <div className="stateCardHeading">
                        <span>State with Highest Recovery Rate</span>
                    </div>
                    <div className="stateCardBody">
                        <span className="green">{stateMetric.highestRecoverRate.state}</span>
                    </div>
                    <div className={["card-variance", "green"].join(" ")}>
                        <span >{numberFormatter(stateMetric.highestRecoverRate.value)}%</span>
                    </div>
                </Paper>
                <Paper className="stateCardContent">
                    <div className="stateCardHeading">
                        <span>State with  Lowest Recovery Rate</span>
                    </div>
                    <div className="stateCardBody">
                        <span className="red">{stateMetric.lowestRecoverRate.state}</span>
                    </div>
                    <div className={["card-variance", "red"].join(" ")}>
                        <span >{numberFormatter(stateMetric.lowestRecoverRate.value)}%</span>
                    </div>
                </Paper>
                <Paper className="stateCardContent">
                    <div className="stateCardHeading">
                        <span>State with Highest Deaths</span>
                    </div>
                    <div className="stateCardBody">
                        <span className="red">{stateMetric.highestDeaths.state}</span>
                    </div>
                    <div className={["card-variance", "red"].join(" ")}>
                        <span >{numberFormatter(stateMetric.highestDeaths.value)}</span>
                    </div>
                </Paper>
                <Paper className="stateCardContent">
                    <div className="stateCardHeading">
                        <span>State with Lowest Deaths</span>
                    </div>
                    <div className="stateCardBody">
                        <span className="green">{stateMetric.lowestDeaths.state}</span>
                    </div>
                    <div className={["card-variance", "green"].join(" ")}>
                        <span >{numberFormatter(stateMetric.lowestDeaths.value)}</span>
                    </div>
                </Paper>
                <Paper className="stateCardContent">
                    <div className="stateCardHeading">
                        <span>State with Highest Death Rate</span>
                    </div>
                    <div className="stateCardBody">
                        <span className="red">{stateMetric.highestDeathRate.state}</span>
                    </div>
                    <div className={["card-variance", "red"].join(" ")}>
                        <span >{numberFormatter(stateMetric.highestDeathRate.value)}%</span>
                    </div>
                </Paper>
                <Paper className="stateCardContent">
                    <div className="stateCardHeading">
                        <span>State with Lowest Death Rate</span>
                    </div>
                    <div className="stateCardBody">
                        <span className="green">{stateMetric.lowestDeathRate.state}</span>
                    </div>
                    <div className={["card-variance", "green"].join(" ")}>
                        <span >{numberFormatter(stateMetric.lowestDeathRate.value)}%</span>
                    </div>
                </Paper>


            </div>
            }
        </div>
    </div>);

}

export default NationalDashboard;