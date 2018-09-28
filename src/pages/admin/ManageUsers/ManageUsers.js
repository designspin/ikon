import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import { 
  DataTypeProvider, 
  EditingState,
  PagingState,
  SearchState,
  SortingState,
  IntegratedSorting,
  IntegratedFiltering, 
  IntegratedPaging,
  RowDetailState } from '@devexpress/dx-react-grid';

import { 
  Grid, 
  Table, 
  Toolbar,
  SearchPanel,
  TableHeaderRow,
  TableRowDetail,
  TableEditRow,
  TableEditColumn, 
  PagingPanel } from '@devexpress/dx-react-grid-material-ui';

import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/CheckCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import LinearProgress from '@material-ui/core/LinearProgress';

import { getUserData, deleteUsers, addClaims } from '../../../reducers/manage_users/manage_users';

import { Checkbox, Button } from '@material-ui/core';

const EditorTrueFalse = ({value, onValueChange}) => {
  const change = (event) => {
    onValueChange(event.target.checked)
  }
  return (
    <Checkbox 
      onChange={change}
      checked={value}
    />
  )
}

const TrueFalseFormat = ({ value }) => {
  return (value) ? <CheckIcon style={{ fill: "green" }} /> : <CancelIcon style={{ fill: "red" }} />;
};

const TrueFalseProvider = props => ( 
  <DataTypeProvider
    formatterComponent={TrueFalseFormat}
    editorComponent={EditorTrueFalse}
    {...props}
  />
);

const RowDetail = ({ row }) => (
  <div>
    Details for
    {' '}
    {row.id}
  </div>
);

const EditButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Edit row">
    <EditIcon />
  </IconButton>
);

const DeleteButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Delete row">
    <DeleteIcon />
  </IconButton>
);

const CommitButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Save changes">
    <SaveIcon />
  </IconButton>
);

const CancelButton = ({ onExecute }) => (
  <IconButton color="secondary" onClick={onExecute} title="Cancel changes">
    <CancelIcon />
  </IconButton>
);

const commandComponents = {
  edit: EditButton,
  delete: DeleteButton,
  commit: CommitButton,
  cancel: CancelButton,
};

const Command = ({ id, onExecute }) => {
  const CommandButton = commandComponents[id];
  return (
    <CommandButton
      onExecute={onExecute}
    />
  );
};

const getRowId = row => row.id;

const cellLoading = () => 
  <td colSpan="7">
    <LinearProgress color="primary" variant="query" />
  </td>

class ManageUsersTable extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'name', title: 'Fullname'},
        { name: 'email', title: 'Email'},
        { name: 'admin', title: 'Admin'},
        { name: 'staff', title: 'Staff'},
        { name: 'client', title: 'Client'}
      ],
      editingStateColumnExtensions: [
        { columnName: 'name', editingEnabled: false},
        { columnName: 'email', editingEnabled: false}
      ],
      tableColumnExtensions: [
        { columnName: 'admin', width: 80 },
        { columnName: 'staff', width: 80 },
        { columnName: 'client', width: 88 }
      ],
      searchValue: '',
      trueFalseColumns: ['admin', 'staff', 'client'],
      sorting: [{ columnName: 'name', direction: 'asc'}],
      currentPage: 0,
      deletingRows: [],
      pageSize: 10,
      pageSizes: [5, 10, 20],
      expandedRowIds: [],
      editingRowIds: [],
      rowChanges: {}
    }

    const getStateDeletingRows = () => {
      const { deletingRows } = this.state;
      return deletingRows;
    };

    const getStateRows = () => {
      /*const { rows } = this.state;
      return rows;*/
      return this.props.data;
    };

    this.changeEditingRowIds = editingRowIds => this.setState({ editingRowIds });
    this.changeRowChanges = rowChanges => this.setState({ rowChanges });
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.changeSearchValue = value => this.setState({ searchValue: value });
    this.changeSorting = sorting => this.setState({ sorting });
    this.changeExpandedDetails = expandedRowIds => this.setState({ expandedRowIds });
    this.commitChanges = ({ changed, deleted}) => {
      let { rows } = this.state;
      
      if(changed) {
        
        const user = changed[Object.keys(changed)[0]];
        const { id, admin, staff, client } = user;
        const claims = {
          admin,
          staff,
          client
        }
        this.props.processData([id], claims).then(() => console.log("Alright Bruv!"));
      }

      this.setState({ deletingRows: deleted || getStateDeletingRows() });
    }
    this.cancelDelete = () => this.setState({ deletingRows: [] });
    this.deleteRows = () => {
      const rows = getStateRows().slice();
      let toDelete = [];
      getStateDeletingRows().forEach((rowId) => {
        const index = rows.findIndex(row => row.id === rowId);
        if (index > -1) {
          toDelete.push(rowId)
        }
        this.props.deleteUsers(toDelete);
      });
      this.setState({ deletingRows: [] });
    };
  }

  componentDidMount() {
    if(this.props.data && !this.props.data.length) {
      this.props.fetchData();
    }
  }

  render() {
    const { 
      columns, 
      pageSize, 
      pageSizes, 
      currentPage,
      searchValue, 
      sorting,
      trueFalseColumns, 
      tableColumnExtensions,
      expandedRowIds,
      editingRowIds, 
      editingStateColumnExtensions,
      deletingRows,
    } = this.state;

    return (
      <Paper>
      <Grid
        rows={this.props.data}
        columns={columns}
        getRowId={getRowId}
      >
        <EditingState
          createRowChange={(row, value, columnName) => {
            if(columnName === 'admin') {
              row.admin = value;
            }

            if(columnName === 'staff') {
              if(value) {
                row.staff = value;
                row.client = false;
              } else {
                row.staff = value;
              }
            } 

            if(columnName === 'client') {
              if(value) {
                row.client = value;
                row.staff = false;
              } else {
                row.client = value;
              }
            } 
            return row;
          }}
          editingRowIds={editingRowIds}
          onEditingRowIdsChange={this.changeEditingRowIds}
          onRowChangesChange={this.changeRowChanges}
          onCommitChanges={this.commitChanges}
          columnExtensions={editingStateColumnExtensions}
        />
        <RowDetailState
          expandedRowIds={expandedRowIds}
          onExpandedRowIdsChange={this.changeExpandedDetails}
        />
        <PagingState
          currentPage={currentPage}
          onCurrentPageChange={this.changeCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={this.changePageSize}
        />
        <SearchState
          value={searchValue}
          onValueChange={this.changeSearchValue}
        />
        <SortingState
          sorting={sorting}
          onSortingChange={this.changeSorting}
        />
        <IntegratedFiltering />
        <IntegratedSorting />
        <IntegratedPaging />
        <TrueFalseProvider for={trueFalseColumns} />
        <Table 
          columnExtensions={tableColumnExtensions}
          noDataCellComponent={cellLoading} 
        />
        <TableHeaderRow showSortingControls/>
        <TableEditRow />
        <TableEditColumn
          showEditCommand
          showDeleteCommand
          commandComponent={Command}
        />
        <TableRowDetail
          contentComponent={RowDetail}
        />
        <Toolbar />
        <SearchPanel />
        <PagingPanel 
          pageSizes={pageSizes}
        />
      </Grid>
      <Dialog
        open={!!deletingRows.length || this.props.deleting}
        onClose={this.cancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete User?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to permanently delete this user?
          </DialogContentText>
          { this.props.data.length && !this.props.deleting &&
          <Paper>
            <Grid
              rows={this.props.data.filter(row => deletingRows.indexOf(row.id) > -1)}
              columns={columns}
            >
              <TrueFalseProvider for={trueFalseColumns} />
              <Table 
                columnExtensions={tableColumnExtensions}
              />
              <TableHeaderRow />
            </Grid>
          </Paper>
          }
          { this.props.deleting &&
            <LinearProgress color="primary" />
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={this.cancelDelete} color="primary">Cancel</Button>
          <Button onClick={this.deleteRows} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
      </Paper>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    //selected: state.manageUsersState.selected,
    data: state.manageUsersState.data ,
    //orderBy: state.manageUsersState.orderBy,
    //order: state.manageUsersState.order,
    //page: state.manageUsersState.page,
    //rowsPerPage: state.manageUsersState.rowsPerPage,
    processing: state.manageUsersState.processing,
    loading: state.manageUsersState.loading,
    deleting: state.manageUsersState.deleting,
    //toolbarState: state.manageUsersState.toolbar
  }
};

const mapDispatchToProps = (dispatch) => ({
  fetchData: () => dispatch(getUserData()),
  processData: (id, claims) => dispatch(addClaims(id, claims)),
  deleteUsers: (ids) => dispatch(deleteUsers(ids)),
  //updateSelectedUsers: (users) => dispatch({ type: 'SELECTED_USERS_SET', payload: users }),
  //reOrderUsers: (order, orderBy) => dispatch({ type: 'ORDER_USERS_SET', payload: { order, orderBy }}),
  //reset: () => dispatch({ type: 'RESET_USERS' }),
  //updateRowsPerPage: (rows) => dispatch({ type: 'USERS_ROWS_PER_PAGE', payload: { rowsPerPage: rows }}),
  //updateToolBarState: (state) => dispatch({ type: 'USERS_TOOLBAR_STATE_SET', payload: state })
 });

export default connect(mapStateToProps, mapDispatchToProps)(ManageUsersTable);


