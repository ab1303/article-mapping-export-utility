import React, { useMemo } from 'react';
import { Box, useColorMode } from '@chakra-ui/core';
import { Switch, Route, Redirect } from 'react-router-dom';

import { Path, routeTo } from 'src/router';
import Home from 'src/routes/Home';

import DefaultRoute from 'src/router/DefaultRoute';
import StateHome from 'src/routes/State/Home';

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
            path={`${Path.CHANNEL_MAPPER_STATES}/:state`}
            component={StateHome}
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
