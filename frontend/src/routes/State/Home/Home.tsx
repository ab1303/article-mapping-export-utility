import {
  Flex,
  Heading,
  Stack,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  Tooltip,
  IconButton,
  Box,
} from '@chakra-ui/core';
import React, { useEffect } from 'react';
import {
  NavLink,
  useRouteMatch,
  Route,
  Switch,
  useParams,
} from 'react-router-dom';
import { useAppDispatch, useAppState } from 'src/providers/AppStateProvider';

import { useSubscriptionInfoQuery } from './useStateInfoQuery';
import StoreList from '../StoreList';
import SubscriptionMessages from '../SubscriptionMessages';
import { SubscriptionEvent } from './types';
import { Card } from 'src/components';

const StateHome: React.FC = () => {
  const appDispatch = useAppDispatch();
  const match = useRouteMatch();
  const { topic, subscription } = useParams<{
    topic: string;
    subscription: string;
  }>();
  const { selectedSubscription } = useAppState();
  const { data, refetch, isFetching } = useSubscriptionInfoQuery(
    topic,
    subscription,
  );

  useEffect(() => {
    if (isFetching || !data) return;

    appDispatch({
      type: SubscriptionEvent.INFO_REFRESH,
      payload: {
        subscription: data,
      },
    });
  }, [isFetching, data]);

  // if (!match || !selectedSubscription) return null;
  if (!match) return null;
  const url = window.location.href;

  const tabIndex = url.indexOf('stores') > 0 ? 1 : 0;

  return (
    // @ts-ignore
    <Stack spacing={3}>
      <Heading as="h2" size="lg" color="main.500">
        <Flex align="center" justify="space-between">
          {/* <Tooltip
            aria-label="refresh-subscription-count-tooltip"
            label="Refresh Subscription Counts"
            placement="top"
          >
            <IconButton
              aria-label="refresh-subscription-count-button"
              icon="repeat"
              onClick={() => refetch()}
            />
          </Tooltip> */}
        </Flex>
        <Box p={4} color="gray.400">
          There are many benefits to a joint design and development system. Not
          only does it bring benefits to the design team, but it also brings
          benefits to engineering teams. It makes sure that our experiences have
          a consistent look and feel, not just in our design specs, but in
          production
        </Box>
      </Heading>
      <Tabs index={tabIndex} isManual>
        <TabList>
          <Tab>
            <NavLink to={`${match.url}/upload`}>Upload File</NavLink>
          </Tab>
          <Tab>
            <NavLink to={`${match.url}/stores`}>Stores</NavLink>
          </Tab>
        </TabList>
        <TabPanels>
          <Switch>
            <Route path={`${match.path}/upload`}>
              <SubscriptionMessages />
            </Route>
            <Route path={`${match.path}/stores`}>
              <StoreList />
            </Route>
          </Switch>
        </TabPanels>
      </Tabs>
    </Stack>
  );
};

StateHome.displayName = 'StateHome';

export default StateHome;
