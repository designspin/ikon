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
    return allUsers({ qty: state().manageUsersState.rowsPerPage }).then((result) => {
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

export function addBulkClaims() {
  return (dispatch, state) => {
    const bulkClaims = functions.httpsCallable('bulkClaims');
    dispatch({ type: 'TOGGLE_USERS_PROCESSING' });

    const { selected, toolbar } = state();

    return bulkClaims({ ids: selected, state: toolbar }).then((result) => {
      console.log(result);

      dispatch({ type: 'TOGGLE_USERS_PROCESSING'});
    })
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
    case 'USERS_ROWS_PER_PAGE':
      return applyRowsPerPage(state, action)
    case 'USERS_TOOLBAR_STATE_SET':
      return applyUsersToolbarState(state, action)
    default: return state;
  }
}

export default manage_users_reducer;
