import { useContext } from 'react';
import { useMutation } from 'react-query';
import axios, { AxiosError } from 'axios';
import { AppConfigurations } from 'src/types';
import { ConfigContext } from 'src/providers/ConfigProvider';
import {
  StoreArticlesUploadResponsePayload,
  UploadSelectedStoreData,
} from './types';

export const useUploadArticlesMutation = () => {
  const config = useContext<AppConfigurations>(ConfigContext);

  const mutation = useMutation<
    StoreArticlesUploadResponsePayload,
    AxiosError,
    UploadSelectedStoreData
  >(formData => {
    const { storeArticles, storeId } = formData;
    return axios.post(`${config.apiEndpoint}/etlmapping/storeArticles/upload`, {
      storeId: storeId,
      storeArticles: storeArticles,
    });
  });

  return mutation;
};
