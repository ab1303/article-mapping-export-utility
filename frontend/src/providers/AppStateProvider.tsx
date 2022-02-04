import React, { Dispatch, useContext, useReducer } from 'react';
import { appReducer } from 'src/reducer';
import { Actions, AppState } from 'src/types';

// TODO Reset State
const initialAppState: AppState = {
  isLoading: false,
  entity: {
    states: [
      'NSW_SUPER',
      'NSW_METRO',
      'VIC_SUPER',
      'VIC_METRO',
      'QLD_SUPER',
      'QLD_METRO',
    ],
  },
  selectedSubscription: null,
};

const AppStateContext = React.createContext<AppState>(initialAppState);

const AppDispatchContext = React.createContext<Dispatch<Actions>>(() => null);

export const AppStateProvider: React.FC<{
  children: React.ReactChild | React.ReactChildren;
}> = ({ children }) => {
  const [appState, dispatch] = useReducer(appReducer, initialAppState);

  return (
    <AppStateContext.Provider value={appState}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);
export const useAppDispatch = () => useContext(AppDispatchContext);
