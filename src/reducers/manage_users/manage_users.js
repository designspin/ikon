import { functions } from '../../firebase/firebase';

const INITIAL_STATE = {
  order: 'asc',
  orderBy: 'email',
  selected: [],
  data: [],
  page: 0,
  nextPage: null,
  rowsPerPage: 5
}

export function getUserData() {
  return (dispatch, state) => {
    const allUsers = functions.httpsCallable('allUsers');
    
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

      dispatch({ type: 'FETCHED_USERS_SET', payload: data })
      
    });
  }
}

const applyFetchedUserData = (state, action) => ({
  ...state,
  data: [...state.data, ...action.payload.users]
})

const applySelectedUsers = (state, action) => ({
  ...state,
  selected: action.payload
})

const applyOrderOrderBy = (state, action) => ({
  ...state,
  order: action.payload.order,
  orderBy: action.payload.orderBy
})

function manage_users_reducer(state = INITIAL_STATE, action) {
  switch(action.type) {
    case 'FETCHED_USERS_SET':
      return applyFetchedUserData(state, action)
    case 'SELECTED_USERS_SET':
      return applySelectedUsers(state, action)
    case 'ORDER_USERS_SET':
      return applyOrderOrderBy(state, action)
    default: return state;
  }
}

export default manage_users_reducer;
