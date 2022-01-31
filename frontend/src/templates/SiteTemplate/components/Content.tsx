import React, { useMemo } from 'react';
import { Box, useColorMode } from '@chakra-ui/core';
import { Switch, Route, Redirect } from 'react-router-dom';

import { Path, routeTo } from 'src/router';
import Home from 'src/routes/Home';
import SubscriptionList from 'src/routes/State/StoreList';
import DefaultRoute from 'src/router/DefaultRoute';
import Subscription from 'src/routes/State/Subscription';

const Content: React.FC = () => {
  const { colorMode } = useColorMode();

  const bg = useMemo(() => (colorMode === 'dark' ? 'gray.600' : 'gray.50'), [
    colorMode,
  ]);

  return (
    <Box ml={[0, null, '18rem']} mt="4rem" height="full" bg={bg}>
      <Box
        as="main"
        mx="auto"
        py={['2rem', '2.5rem', '3rem']}
        px={['2rem', '2.5rem', '3rem']}
      >
        <Switch>
          <DefaultRoute exact path={routeTo(Path.HOME)} component={Home} />
          <DefaultRoute
            exact
            path={`${Path.CHANNEL_MAPPER_STATES}/:state`}
            component={SubscriptionList}
          />
          <DefaultRoute
            path={`${Path.CHANNEL_MAPPER_STATES}/:state/subscriptions/:subscription`}
            component={Subscription}
          />
          <Route exact path="/">
            <Redirect to={routeTo(Path.HOME)} />
          </Route>
        </Switch>
      </Box>
    </Box>
  );
};

export default Content;
