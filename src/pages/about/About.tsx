import React from 'react';
import { Typography, Paper } from '@material-ui/core';

export const About: React.FunctionComponent = () => {
  return (
    <Paper style={{ padding: 16 }}>
      <Typography variant="body1">This application demoes the Restux Endpoint pattern -- an oppinionated way of declaratively integrating with REST API endpoints.</Typography>
    </Paper>
  );
}

export default About;
