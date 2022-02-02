import { useContext } from 'react';
import { useMutation } from 'react-query';
import axios, { AxiosError } from 'axios';
import { AppConfigurations } from 'src/types';
import { ConfigContext } from 'src/providers/ConfigProvider';
import {
  StoreArticlesUploadResponsePayload,
  ResubmitSelectedStoreData,
} from './types';

export const useUploadArticlesMutation = () => {
  const config = useContext<AppConfigurations>(ConfigContext);

  const mutation = useMutation<
    StoreArticlesUploadResponsePayload,
    AxiosError,
    ResubmitSelectedStoreData
  >(formData =>
    axios.post(`${config.apiEndpoint}/etlmapping/storeArticles/upload`, {
      storeArticles: formData.storeArticles,
    }),
  );

  return mutation;
};
