export type StoreArticlesUploadResponsePayload = {};

export type ChannelStoreArticleData = {
  channel: string;
  storeId: number;
  articleId: number;
};

export type UploadSelectedStoreData = {
  storeArticles: ChannelStoreArticleData[];
};

export type StoresByStateRecord = {
  storeId: number;
  storeName: string;
  street: string;
  suburb: string;
};

export enum StoreArticleStatus {
  UN_PROCESSED = 'UN_PROCESSED',
  PROCESSED = 'PROCESSED',
  FAILED = 'FAILED',
  IN_PROGRESS = 'IN_PROGRESS',
}

export type StoresByStateUploadRecord = {
  storeId: number;
  storeName: string;
  street: string;
  suburb: string;
  status: keyof typeof StoreArticleStatus;
};

export type StoresByStateQueryResponsePayload = Array<StoresByStateRecord>;
