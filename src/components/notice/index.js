import React from 'react';
import { connect } from 'react-redux';
import SnackBar from '@material-ui/core/Snackbar';
import NoticeBarContent from './content';

const NoticeBar = (props) => {
  return (
    <SnackBar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={props.open}
      autoHideDuration={6000}
      onClose={props.close}
    >
      <NoticeBarContent 
        variant={props.variant}
        message={props.message}
        onClose={props.close}
      />
    </SnackBar>
  )
}

const mapStateToProps = (state) => ({
  open: state.noticeState.noticeOpen,
  message: state.noticeState.noticeMessage,
  variant: state.noticeState.noticeType
});

const mapDispatchToProps = (dispatch) => ({
  close: () => dispatch({ type: 'NOTICE_MESSAGE_CLOSE', action: null })
});

export default connect(mapStateToProps, mapDispatchToProps)(NoticeBar);
