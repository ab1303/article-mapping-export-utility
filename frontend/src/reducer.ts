// import { subscriptionReducer } from './routes/State/Home/reducer';
// import { SubscriptionEvent } from './routes/State/Home/types';
// import { SubscriptionDeadLettersEvent } from './routes/State/SubscriptionDeadLetters/types';
// import { subscriptionListReducer } from './routes/State/StoreList/reducer';
import { Actions, AppState } from './types';

export const appReducer = (
  { isLoading, entity, selectedSubscription }: AppState,
  action: Actions,
): AppState => {
  switch (action.type) {
    // case SubscriptionDeadLettersEvent.RESUBMIT_ALL_PROCESSED:
    //   return {
    //     isLoading: false,
    //     entity: entity,
    //     selectedSubscription: subscriptionReducer(selectedSubscription, action),
    //   };
    // case SubscriptionEvent.INFO_REFRESH:
    //   return {
    //     isLoading: false,
    //     entity: entity,
    //     selectedSubscription: subscriptionReducer(selectedSubscription, action),
    //   };
    default:
      return {
        isLoading: isLoading,
        entity: {
          states: [],
        },
        selectedSubscription: null,
      };
  }
};
