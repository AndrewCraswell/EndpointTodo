import React from 'react';
import { Route } from 'react-router-dom';

import Layout from "./Layout";
import List from '../pages/list/List';
import About from '../pages/about/About';

export const App: React.FunctionComponent = () => {
  return (
    <Layout>
      <Route path="/" component={List} exact={true} />
      <Route path="/about" component={About} exact={true} />
    </Layout>
  );
}

export default App;

