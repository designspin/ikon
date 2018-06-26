const INITIAL_STATE = {
  order: 'asc',
  orderBy: 'email',
  selected: [],
  data: [],
  page: 0,
  rowsPerPage: 5
}

function manage_users_reducer(state = INITIAL_STATE, action) {
  switch(action.type) {
    default: return state;
  }
}

export default manage_users_reducer;
