import { useContext } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { AppConfigurations } from 'src/types';
import { ConfigContext } from 'src/providers/ConfigProvider';
import { SubscriptionMessagesQueryResponsePayload } from './types';

export const useSubscriptionMessagesQuery = (
  topicName: string,
  subscriptionName: string,
) => {
  const config = useContext<AppConfigurations>(ConfigContext);

  const query = useQuery<SubscriptionMessagesQueryResponsePayload>(
    'subscriptionMessages',
    async () => {
      const response = await axios.get<
        SubscriptionMessagesQueryResponsePayload
      >(
        `${config.apiEndpoint}/channel/states/${topicName}/subscriptions/${subscriptionName}/messages`,
      );
      return response.data;
    },
  );

  return query;
};
