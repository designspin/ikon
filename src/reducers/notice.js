const INITIAL_STATE = {
  noticeOpen: false,
  noticeType: 'info',
  noticeMessage: ''
}

const applySetNoticeMessage = (state, action) => ({
  ...state,
  noticeOpen: true,
  noticeType: action.payload.variant,
  noticeMessage: action.payload.message
});

const applyCloseNoticeMessage = (state, action) => ({
  ...state,
  noticeOpen: false,
  noticeType: state.noticeType,
  noticeMessage: state.noticeMessage
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

export default noticeReducer;
