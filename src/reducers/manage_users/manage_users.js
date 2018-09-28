import { functions } from '../../firebase/firebase';

const INITIAL_STATE = {
  order: 'asc',
  orderBy: 'email',
  selected: [],
  data: [],
  page: 0,
  nextPage: null,
  rowsPerPage: 5,
  processing: false,
  loading: false,
  deleting: false,
  toolbar: {
    admin: false,
    staff: false,
    client: false
  }
}

export function getUserData() {
  return (dispatch, state) => {
    const allUsers = functions.httpsCallable('allUsers');
    dispatch({ type: 'TOGGLE_USERS_LOADING' });
    return allUsers({ qty: 1000 }).then((result) => {
      const users = result.data.users.map((user) => {
        const roles = ( user.customClaims && user.customClaims.roles ) ? user.customClaims.roles : { staff: false, client: false, admin: false};

        return { 
          id: user.uid, 
          name: (user.displayName) ? user.displayName : 'not set',
          email: user.email,
          ...roles
        }
      });

      const data = {
        pageToken: result.data.pageToken,
        users
      }

      dispatch({ type: 'TOGGLE_USERS_LOADING' });
      dispatch({ type: 'FETCHED_USERS_SET', payload: data })
      
    });
  }
}

/*export function addBulkClaims() {
  return (dispatch, state) => {
    const bulkClaims = functions.httpsCallable('bulkClaims');
    dispatch({ type: 'TOGGLE_USERS_PROCESSING' });

    const { selected, toolbar } = state().manageUsersState;

    return bulkClaims({ ids: selected, claims: toolbar }).then((result) => {
      dispatch({ type: 'NOTICE_MESSAGE_SET', payload: { variant: 'info', message: `Updated ${selected.length} users`}})
      dispatch({ type: 'UPDATE_USERS_ACCESS_STATE', payload: { selected, toolbar }});
      dispatch({ type: 'TOGGLE_USERS_PROCESSING'});
    })
  }
}*/

/*export function deleteUsers() {
  return (dispatch, state) => {
    const bulkDeleteUsers = functions.httpsCallable('bulkDeleteUsers');

    dispatch({ type: 'TOGGLE_USERS_PROCESSING' });

    const { selected } = state().manageUsersState;

    return bulkDeleteUsers({ ids: selected }).then((result) => {
      dispatch({ type: 'NOTICE_MESSAGE_SET', payload: { variant: 'info', message: `Deleted ${selected.length} users`}});
      dispatch({ type: 'REMOVE_USERS', payload: { selected }});
      dispatch({ type: 'TOGGLE_USERS_PROCESSING'});
    })
  }
}*/

export function addClaims(selectedIds, claims) {
  return(dispatch, state) => {
    const bulkClaims = functions.httpsCallable('bulkClaims');
    dispatch({ type: 'TOGGLE_USERS_PROCESSING' });

    return bulkClaims({ ids: selectedIds, claims: claims }).then((result) => {
      dispatch({ type: 'NOTICE_MESSAGE_SET', payload: { variant: 'info', message: `Updated ${selectedIds.length} users`}})
      dispatch({ type: 'UPDATE_USERS_ACCESS_STATE', payload: { selectedIds, claims }});
      dispatch({ type: 'TOGGLE_USERS_PROCESSING'});
    })
  }
}

export function deleteUsers(selectedIds) {
  return (dispatch, state) => {
    const bulkDeleteUsers = functions.httpsCallable('bulkDeleteUsers');

    dispatch({ type: 'TOGGLE_USERS_DELETING' });

    return bulkDeleteUsers({ ids: selectedIds }).then((result) => {
      dispatch({ type: 'REMOVE_USERS', payload: { selectedIds }});
      dispatch({ type: 'NOTICE_MESSAGE_SET', payload: { variant: 'info', message: `Deleted ${selectedIds.length} users`}});
      dispatch({ type: 'TOGGLE_USERS_DELETING' });
    });
  }
}

const applyUsersAccessState = (state, action) => {
  const { selectedIds, claims } = action.payload;
  const { data } = state;

  const newData = data.map((item) => {
    const index = selectedIds.indexOf(item.id);

    if(index > -1) {
      return {
        ...item,
        admin: claims.admin,
        staff: claims.staff,
        client: claims.client
      }
    } else {
      return item;
    }
  })

  return {
    ...state,
    selected: [],
    data: newData
  }
}

const applyRemoveUsers = (state, action) => {
  const { selectedIds } = action.payload;
  const { data } = state;
  return {
    ...state,
    selected: [],
    data: data.filter((item) => selectedIds.indexOf(item.id) === -1)
  }
}

const applyFetchedUserData = (state, action) => ({
  ...state,
  data: [...state.data, ...action.payload.users]
});

const applySelectedUsers = (state, action) => ({
  ...state,
  selected: action.payload
});

const applyOrderOrderBy = (state, action) => ({
  ...state,
  order: action.payload.order,
  orderBy: action.payload.orderBy
});

const applyRowsPerPage = (state, action) => ({
  ...state,
  rowsPerPage: action.payload.rowsPerPage
})

const applyUsersToolbarState = (state, action) => ({
  ...state,
  toolbar: {
    admin: action.payload.admin,
    staff: (action.payload.staff && !action.payload.client) ? true : false,
    client: (action.payload.client && !action.payload.staff) ? true : false
  }
})

const applyToggleUserDataRemoving = (state, action) => ({
  ...state,
  deleting: !state.deleting
});

const applyToggleUserDataProcessing = (state, action) => ({
  ...state,
  processing: !state.processing
});

const applyToggleUsersLoading = (state, action) => ({
  ...state,
  loading: !state.loading
});

const applyResetUsers = (state, action) => ({ ...INITIAL_STATE });

function manage_users_reducer(state = INITIAL_STATE, action) {
  switch(action.type) {
    case 'RESET_USERS':
      return applyResetUsers(state, action)
    case 'FETCHED_USERS_SET':
      return applyFetchedUserData(state, action)
    case 'SELECTED_USERS_SET':
      return applySelectedUsers(state, action)
    case 'ORDER_USERS_SET':
      return applyOrderOrderBy(state, action)
    case 'TOGGLE_USERS_PROCESSING':
      return applyToggleUserDataProcessing(state, action)
    case 'TOGGLE_USERS_LOADING':
      return applyToggleUsersLoading(state, action)
    case 'TOGGLE_USERS_DELETING':
      return applyToggleUserDataRemoving(state, action)
    case 'USERS_ROWS_PER_PAGE':
      return applyRowsPerPage(state, action)
    case 'USERS_TOOLBAR_STATE_SET':
      return applyUsersToolbarState(state, action)
    case 'UPDATE_USERS_ACCESS_STATE':
      return applyUsersAccessState(state, action)
    case 'REMOVE_USERS':
      return applyRemoveUsers(state, action)
    default: return state;
  }
}

export default manage_users_reducer;
