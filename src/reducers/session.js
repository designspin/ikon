const INITIAL_STATE = {
  authUser: null,
  authRoles: null,
}

const applySetAuthUser = (state, action) => ({
  ...state,
  authUser: action.authUser
});

const applySetAuthRoles = (state, action) => ({
  ...state,
  authRoles: action.authRoles
})

const applyAuthReset = () => INITIAL_STATE;

function sessionReducer(state = INITIAL_STATE, action) {
  switch(action.type) {
    case 'AUTH_USER_SET' : {
      return applySetAuthUser(state, action)
    }
    case 'AUTH_ROLE_SET' : {
      return applySetAuthRoles(state, action)
    }
    case 'AUTH_RESET' : {
      return applyAuthReset()
    }
    default : return state;
  }
}

export default sessionReducer;