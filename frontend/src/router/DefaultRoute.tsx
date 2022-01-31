import React from 'react';
import { Route, RouteProps } from 'react-router-dom';

const DefaultRoute: React.FC<RouteProps> = ({ component, ...rest }) => {
  return <Route {...rest} component={component} />;
};

export default DefaultRoute;
