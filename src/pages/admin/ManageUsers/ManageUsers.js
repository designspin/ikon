import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withAuthorisationRedirect } from '../../../components/withAuthorisation';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Check from '@material-ui/icons/CheckCircle';
import Cancel from '@material-ui/icons/Cancel';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';

import { getUserData } from '../../../reducers/manage_users/manage_users';
import { addBulkClaims } from '../../../reducers/manage_users/manage_users';

function getSorting(order, orderBy) {
  return order === 'desc'
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

const columnData = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Fullname'},
  { id: 'email', numeric: false, disablePadding: true, label: 'Email'},
  { id: 'admin', numeric: false, disablePadding: true, label: 'Admin'},
  { id: 'staff', numeric: false, disablePadding: true, label: 'Staff'},
  { id: 'client', numeric: false, disablePadding: true, label: 'Client'},
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          { columnData.map(column => {
            return (
              <TableCell
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === column.id ? order : false}
              > 
                <Tooltip
                  title="Sort"
                  placement={column.numeric ? 'bottom-end' : 'bottom-start' }
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

/* TOOLBAR */

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    flex: '0 0 auto',
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

let EnhancedTableToolbar = props => {
  const { numSelected, classes, toolbarState, update, processing, processData } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subheading">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="title" id="tableTitle">
            MANAGE USER ACCESS
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={toolbarState.admin}
                    onChange={(event) => {
                      update({
                        admin: event.target.checked,
                        staff: toolbarState.staff,
                        client: toolbarState.client
                      })
                    }}
                    disabled={processing}
                  />
                }
                label="Admin"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={toolbarState.staff}
                    onChange={(event) => {
                      update({
                        admin: toolbarState.admin,
                        staff: event.target.checked,
                        client: toolbarState.client
                      })
                    }}
                    disabled={processing}
                  />
                }
                label="Staff"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={toolbarState.client}
                    onChange={(event) => {
                      update({
                        admin: toolbarState.admin,
                        staff: toolbarState.staff,
                        client: event.target.checked
                      })
                    }}
                    disabled={processing}
                  />
                }
                label="Client"
              />
              <Tooltip title="Update Selection">
                <Button
                  onClick={processData}
                  disabled={processing}
                >Update</Button>
              </Tooltip>
              <Tooltip title="Delete Selection">
                <IconButton aria-label="Delete">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </FormGroup>
          
        ) : (
          <Tooltip title="Filter list">
            <IconButton aria-label="Filter list">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 450,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  iconOn: {
    fill: green[500]
  },
  iconOff: {
    fill: red[500]
  }
});

class EnhancedTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 5,
    };
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.props.orderBy === property && this.props.order === 'desc') {
      order = 'asc';
    }

    this.props.reOrderUsers(order, orderBy);
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      //this.setState({ selected: this.state.data.map(n => n.id) });
      this.props.updateSelectedUsers( this.props.data.map(n => n.id));
      return;
    }
    this.props.updateSelectedUsers([]);
  };

  handleClick = (event, id) => {
    const { selected } = this.props;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.props.updateSelectedUsers(newSelected);
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.props.updateRowsPerPage( event.target.value );
  };

  isSelected = id => this.props.selected.indexOf(id) !== -1;

  componentDidMount() {
    if(this.props.data && !this.props.data.length) {
      this.props.fetchData();
    }
  }

  componentWillUnmount() {
    this.props.reset();
  }

  render() {
    const { classes } = this.props;
    const { page } = this.state;
    const { rowsPerPage, data, selected, processing, processData, order, orderBy, loading, toolbarState, updateToolBarState } = this.props;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      
      <Paper className={classes.root}>
        <EnhancedTableToolbar 
          numSelected={selected.length} 
          toolbarState={toolbarState}
          update={updateToolBarState}
          processing={processing}
          processData={processData}
        />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            { loading 
            ?
            <TableBody>
              <TableRow><TableCell scope="row" padding="none" colSpan="6">LOADING...</TableCell></TableRow>
            </TableBody>
            :
            <TableBody>
              {data
                .sort(getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox disabled={processing} checked={isSelected} />
                      </TableCell>
                      <TableCell component="td" scope="row" padding="none">
                        {n.name}
                      </TableCell>
                      <TableCell component="td" scope="row" padding="none">{n.email}</TableCell>
                      <TableCell component="td" scope="row" padding="none">
                        {n.admin ? <Check className={classes.iconOn}/> : <Cancel className={classes.iconOff}/>}
                      </TableCell>
                      <TableCell component="td" scope="row" padding="none">
                        {n.staff ? <Check className={classes.iconOn}/> : <Cancel className={classes.iconOff}/>}
                      </TableCell>
                      <TableCell component="td" scope="row" padding="none">
                        {n.client ? <Check className={classes.iconOn}/> : <Cancel className={classes.iconOff}/>}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            }
          </Table>
        </div>
        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  processData: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    selected: state.manageUsersState.selected,
    data: state.manageUsersState.data ,
    orderBy: state.manageUsersState.orderBy,
    order: state.manageUsersState.order,
    page: state.manageUsersState.page,
    rowsPerPage: state.manageUsersState.rowsPerPage,
    processing: state.manageUsersState.processing,
    loading: state.manageUsersState.loading,
    toolbarState: state.manageUsersState.toolbar
  }
};

const mapDispatchToProps = (dispatch) => ({
 fetchData: () => dispatch(getUserData()),
 processData: () => dispatch(addBulkClaims()),
 updateSelectedUsers: (users) => dispatch({ type: 'SELECTED_USERS_SET', payload: users }),
 reOrderUsers: (order, orderBy) => dispatch({ type: 'ORDER_USERS_SET', payload: { order, orderBy }}),
 reset: () => dispatch({ type: 'RESET_USERS' }),
 updateRowsPerPage: (rows) => dispatch({ type: 'USERS_ROWS_PER_PAGE', payload: { rowsPerPage: rows }}),
 updateToolBarState: (state) => dispatch({ type: 'USERS_TOOLBAR_STATE_SET', payload: state })
});

const authCondition = (authUser, authRoles) => {
  return !!authUser && !!authRoles && authRoles.admin;
}

export default compose(
  withAuthorisationRedirect(authCondition),
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(EnhancedTable);