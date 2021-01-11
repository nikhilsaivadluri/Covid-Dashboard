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
import ChartCard from './chartCards/chartCard'
import StateMetricChart from './stateMetricChart/stateMetricChart';
import RadialBar from './radialBar/radialBar';
import { scryRenderedDOMComponentsWithClass } from "react-dom/test-utils";

function NationalDashboard() {
    const [summarydata, setSummarydata] = useState({});
    const [postivetrend, setPostivetrend] = useState({ daily: { data: [], categories: [] }, cummulative: { data: [], categories: [] } });
    const [recoveredtrend, setRecoveredtrend] = useState({ daily: { data: [], categories: [] }, cummulative: { data: [], categories: [] } });
    const [deathtrend, setDeathtrend] = useState({ daily: { data: [], categories: [] }, cummulative: { data: [], categories: [] } });
    const [activetrend, setActivetrend] = useState({ daily: { data: [], categories: [] }, cummulative: { data: [], categories: [] } });
    const [isdatavailable, setDataavailable] = useState(false);
    const [stateMetric, setStateMetric] = useState({});
    const [stateWiseCount, setstateWiseCount] = useState({});
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
                summarydata.deathRate = parseFloat(((parseInt(summarydata.totaldeceased) / parseInt(summarydata.totalconfirmed)) * 100).toFixed(2));
                summarydata.recoveryRate = parseFloat(((parseInt(summarydata.totalrecovered) / parseInt(summarydata.totalconfirmed)) * 100).toFixed(2));
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
                    daily: { data: [], categories: [], color: "#888888" },
                    cummulative: { data: [], categories: [], color: "#888888" }
                };
                let activetrend = {
                    daily: { data: [], categories: [], color: "#3366ff" },
                    cummulative: { data: [], categories: [], color: "#3366ff" }
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

                    activetrend.daily.data.push(parseInt(element.dailyconfirmed - element.dailyrecovered - element.dailydeceased));
                    activetrend.daily.categories.push((element.date).toString());
                    activetrend.cummulative.data.push(parseInt(element.totalconfirmed - element.totalrecovered - element.totaldeceased));
                    activetrend.cummulative.categories.push((element.date).toString());


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

                // let countbystate={
                //     state:[],
                //     count:[],
                //     total:stateWiseDataOnly
                // };
                // stateWiseDataOnly.forEach(element => {
                //     countbystate.state.push(element.state);
                //     countbystate.count.push(element.confirmed);
                // });
                setstateWiseCount(stateWiseDataOnly);

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
                setActivetrend(activetrend);
                setStateDataAvailable(true);
                setDataavailable(true);
            })
    }, []);

    function numberFormatter(number) {
        return new Intl.NumberFormat('en-IN').format(number)
    }


    return (<div>
        <div className="summary row mr-lf-25">
            <div className="col-sm-3 summary-card">
                {isdatavailable && <ChartCard totalValue={numberFormatter(summarydata.totalconfirmed)}
                    dailyValue={numberFormatter(summarydata.dailyconfirmed)}
                    title="Confirmed Cases"
                    data={postivetrend.daily.data}
                    labels={postivetrend.daily.categories}
                    color="red"
                    chartColor={postivetrend.daily.color}>
                </ChartCard>}
            </div>
            <div className="col-sm-3 summary-card">
                {isdatavailable && <ChartCard totalValue={numberFormatter(summarydata.totalrecovered)}
                    dailyValue={numberFormatter(summarydata.dailyrecovered)}
                    title="Recovered"
                    data={recoveredtrend.daily.data}
                    labels={recoveredtrend.daily.categories}
                    color="green"
                    chartColor={recoveredtrend.daily.color}>

                </ChartCard>}
            </div>

            <div className="col-sm-3 summary-card">
                {isdatavailable && <ChartCard totalValue={numberFormatter(summarydata.totaldeceased)}
                    dailyValue={numberFormatter(summarydata.dailydeceased)}
                    title="Deaths"
                    data={deathtrend.daily.data}
                    labels={deathtrend.daily.categories}
                    color="grey"
                    chartColor={deathtrend.daily.color}>

                </ChartCard>}
            </div>

            <div className="col-sm-3 summary-card">
                {isdatavailable && <ChartCard totalValue={numberFormatter(summarydata.totalactive)}
                    dailyValue={numberFormatter(summarydata.dailyactive)}
                    title="Active Cases"
                    data={activetrend.cummulative.data}
                    labels={activetrend.cummulative.categories}
                    color="grey"
                    chartColor={activetrend.daily.color}>

                </ChartCard>}
            </div>
        </div>

        <div className="row mr-lr-0" style={{ marginBottom: 18 }}>
            <div className="col-sm-9">
                {isdatavailable && <StateMetricChart data={stateWiseCount}></StateMetricChart>}

            </div>
            <div className="col-sm-3">
                <Paper className="radialCard">
                    <div className="row col-sm-12 mr-lr-0 center">
                        {isdatavailable && <RadialBar color={recoveredtrend.daily.color} name="Recovery Rate" value={summarydata.recoveryRate}></RadialBar>}
                    </div>
                    <div className="row col-sm-12 mr-lr-0 center">
                        {isdatavailable && <RadialBar color={deathtrend.daily.color} name="Death Rate" value={summarydata.deathRate}></RadialBar>}
                    </div>
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
                        <span className="chart-title">State wise Cases</span>
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