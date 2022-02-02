import { useContext } from 'react';
import { useQuery } from 'react-query';
import axios, { AxiosError } from 'axios';
import { AppConfigurations } from 'src/types';
import { ConfigContext } from 'src/providers/ConfigProvider';
import { useToast } from '@chakra-ui/core';
import { StoresByStateQueryResponsePayload } from './types';

export const useStoreListQuery = (state: string) => {
  const config = useContext<AppConfigurations>(ConfigContext);
  const toast = useToast();

  const query = useQuery<StoresByStateQueryResponsePayload, AxiosError>(
    `stores-${state}`,
    async () => {
      const response = await axios.get<StoresByStateQueryResponsePayload>(
        `${config.apiEndpoint}/etlMapping?state=${state}`,
      );
      return response.data;
    },
    {
      onError: (error: AxiosError) => {
        toast({
          title: 'Server Error',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      },
    },
  );

  return query;
};
