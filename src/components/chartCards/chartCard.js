import React from 'react';
import Paper from '@material-ui/core/Paper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './chartCard.css';
import AreaChart from '../areachart/areachart';

function ChartCard(props) {

    let variance = parseInt(props.dailyValue)>=0?"arrow-circle-up":"arrow-circle-down";

    return (
        <Paper className="card-content">
            <div className="card-heading row">
                <div className="col-sm-6">
                <h1 className="value text-left" style={{color:props.chartColor}}>{props.totalValue}</h1>
                <h1 className = "chartTitle text-left" style={{color:props.chartColor}}>{props.title}</h1>
                </div>
                <div className="col-sm-6 text-right value" style={{color:props.chartColor}}>
                <span className="text-right" >{props.dailyValue}</span>
                <FontAwesomeIcon icon={variance} />
                </div>
            </div>
            <div className="card-body">
                <AreaChart data={props.data} labels={props.labels} color={props.chartColor}></AreaChart>
            </div>
        </Paper>
    );
}

export default ChartCard;