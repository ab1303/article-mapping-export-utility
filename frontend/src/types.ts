import {
  SubscriptionInfo,
  SubscriptionMessages,
} from './routes/State/Home/types';
import { SubscriptionDeadLettersMessages } from './routes/State/SubscriptionDeadLetters/types';
// import { SubscriptionListMessages } from './routes/State/StoreList/types';
import ActionMap from './utils/actionMap';

export type AppConfigurations = {
  apiEndpoint: string;
};

export type AppState = {
  isLoading: boolean;
  entity: {
    states: string[];
  };
  selectedSubscription: SubscriptionInfo | null;
};

type ApplicationMessages = SubscriptionMessages &
  // SubscriptionListMessages &
  SubscriptionDeadLettersMessages;

export type Actions = ActionMap<ApplicationMessages>[keyof ActionMap<
  ApplicationMessages
>];
