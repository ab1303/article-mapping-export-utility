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
import React, { useEffect, useState } from 'react';
import {
  NavLink,
  useRouteMatch,
  Route,
  Switch,
  useParams,
} from 'react-router-dom';
import { useAppDispatch } from 'src/providers/AppStateProvider';

import { useSubscriptionInfoQuery } from './useStateInfoQuery';
import StoreList from '../StoreList';
import { SubscriptionEvent } from './types';
import { Card } from 'src/components';
import { CSVReaderClickAndDragUpload } from 'src/components/CSVReader';
import StoreArticles from '../Articles';
import { StoreArticleRecord } from '../Articles/types';

const StateHome: React.FC = () => {
  const appDispatch = useAppDispatch();
  const match = useRouteMatch();
  const { topic, subscription } = useParams<{
    topic: string;
    subscription: string;
  }>();

  const [fileData, setFileData] = useState<Array<string[]>>([]);
  const [isFileUploaded, setIsFileUploaded] = useState<boolean>(false);

  const storeArticles = React.useMemo<StoreArticleRecord[]>(
    () =>
      fileData
        ? fileData.slice(1).map(record => ({
            menu: record[0],
            category: record[1],
            externalId: +record[2],
            externalData: +record[3],
            title: record[4],
            description: record[5],
            imageUrl: record[6],
            price: +record[7],
            vat: +record[8],
          }))
        : [],
    [fileData],
  );

  const { data, isFetching } = useSubscriptionInfoQuery(topic, subscription);

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
        <Card>
          <Card.Header>
            <Card.Header.Title>Article Content File</Card.Header.Title>
            <Card.Body>
              <CSVReaderClickAndDragUpload
                onUploadAccepted={fileData => {
                  setFileData(fileData);
                  setIsFileUploaded(true);
                }}
              />
            </Card.Body>
          </Card.Header>
        </Card>
      </Heading>
      <Tabs index={tabIndex} isManual>
        <TabList>
          <Tab>
            <NavLink to={`${match.url}/upload`}>Articles</NavLink>
          </Tab>
          <Tab>
            <NavLink to={`${match.url}/stores`}>Stores</NavLink>
          </Tab>
        </TabList>
        <TabPanels>
          <Switch>
            <Route path={`${match.path}/upload`}>
              {isFileUploaded && (
                <StoreArticles storeArticles={storeArticles} />
              )}
            </Route>
            <Route path={`${match.path}/stores`}>
              <StoreList storeArticles={storeArticles} />
            </Route>
          </Switch>
        </TabPanels>
      </Tabs>
    </Stack>
  );
};

StateHome.displayName = 'StateHome';

export default StateHome;
