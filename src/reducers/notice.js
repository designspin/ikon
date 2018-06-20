const INITIAL_STATE = {
  noticeOpen: false,
  noticeType: '',
  message: ''
}

const applySetNoticeMessage = (state, action) => ({

})

const applyCloseNoticeMessage = (state, action) => ({

})

function noticeReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'NOTICE_MESSAGE_SET': {
      return applySetNoticeMessage(state, action)
    }
    case 'NOTICE_MESSAGE_CLOSE': {
      return applyCloseNoticeMessage(state, action)
    }
    default: return state;
  }
}

