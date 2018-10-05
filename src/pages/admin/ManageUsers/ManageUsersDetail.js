import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { PaperWithStyles } from '../../../components/wrappers';
import ManageStaffGroups from './ManageStaffGroups';
import { ClientProfile } from '../../../components/account/ClientProfile';

const ManageUsersDetailRow = ({ row }) => {
  const { staff, client, id, name } = row;
  
  return (
    <PaperWithStyles 
        elevation={0}>
        <Typography
          variant="subheading"
          component="h3"
        >{ name } - ( {Object.keys(row).filter((key) => row[key] === true ).toString() || 'unassigned'} ) </Typography>
        { staff && <ManageStaffGroups id={id} name={name} /> }
        { client && <ClientProfile id={id} readonly />}
      </PaperWithStyles>
  )
}

export default ManageUsersDetailRow;