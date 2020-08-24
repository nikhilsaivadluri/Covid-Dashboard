import React,{ useEffect} from 'react';
import PropTypes from 'prop-types';
import {  makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'state', numeric: false, disablePadding: false, label: 'State' },
  { id: 'confirmed', numeric: true, disablePadding: false, label: 'Confirmed Cases' },
  { id: 'recovered', numeric: true, disablePadding: false, label: 'Recovered' },
  { id: 'deaths', numeric: true, disablePadding: false, label: 'Deaths' },
  { id: 'recoveryRate', numeric: true, disablePadding: false, label: 'Recovery Rate' },
  { id: 'deathRate', numeric: true, disablePadding: false, label: 'Death Rate' },
];

function EnhancedTableHead(props) {
  const { classes,  order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.id==="state" ?"left":"right"}
            padding="none"
            sortDirection={orderBy === headCell.id ? order : false}
            className={[classes.cellheader].join(' ')}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  container: {
    maxHeight: 401,
  },
  whiteText:{
    color:'#f0ffff',
    fontSize: 12,
    
  },
  cellheader:{
    backgroundColor:'#2b72dd',
    fontSize: 12,
    fontWeight: 600,
    padding:6,

  },
  red:{
    color:"#ff0000",
    fontSize: 12,
    fontWeight: 600
  },
  green:{
    color:"#33cc33",
    fontSize: 12,
    fontWeight: 600
  }


}));

export default function EnhancedTable(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('confirmed');
  //const [selected, setSelected] = React.useState([]);
  //const [dense, setDense] = React.useState(false);
  const [rowsData,setRowData]=React.useState([]);
  

  useEffect(() => {
  //  console.log(props);
   setRowData(props.data);
  },[props]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  function numberFormatter(number) {
    return new Intl.NumberFormat('en-IN').format(number)
}

  return (
    <div className={classes.root}>
        <TableContainer className={classes.container}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            stickyHeader aria-label="sticky table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(rowsData, getComparator(order, orderBy))
                .map((row, index) => {
                

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.state}
                      className={classes.whiteText}
                    >
                     
                      <TableCell className={classes.whiteText} component="th"  scope="row" >
                        {row.state}
                      </TableCell>
                      <TableCell className={classes.red}  align="right">{numberFormatter(row.confirmed)}</TableCell>
                      <TableCell className={classes.green}  align="right">{numberFormatter(row.recovered)}</TableCell>
                      <TableCell className={classes.red}  align="right">{numberFormatter(row.deaths)}</TableCell>
                      <TableCell className={classes.green}  align="right">{row.recoveryRate}%</TableCell>
                      <TableCell className={classes.red}  align="right">{row.deathRate}%</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      
      
    </div>
  );
}
