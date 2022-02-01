import React from 'react';
import { Box, BoxProps, Flex } from '@chakra-ui/core';

import { SideNavMode } from './modules/constants';
import SideNavItem from './SideNavItem';
import SideNavProfile from './SideNavProfile';
import SideNavMenu from './SideNavMenu';
import { useAppState } from 'src/providers/AppStateProvider';
import { Path, routeTo } from 'src/router';
import { DefaultSpinner } from 'src/components';

type Props = BoxProps & {
  mode?: SideNavMode;
};

const SideNavContent: React.FC<Props> = ({ mode, ...props }) => {
  const appState = useAppState();
  const {
    entity: { states },
  } = appState;
  return (
    <Box as="nav" aria-label="Main navigation" fontSize="sm" px="6" {...props}>
      <SideNavProfile mode={mode} />
      {appState.isLoading ? (
        <Flex h="7rem" direction="row" alignItems="center">
          <DefaultSpinner />
        </Flex>
      ) : (
        <SideNavMenu mode={mode} label="">
          <SideNavMenu
            key={routeTo(Path.CHANNEL_MAPPER_STATES)}
            mode={mode}
            label="Stores"
          >
            {states.map(item => {
              const statePath = `${Path.CHANNEL_MAPPER_STATES}/${item}/upload`;
              return (
                <SideNavItem key={item} to={routeTo(statePath)} mode={mode}>
                  {item}
                </SideNavItem>
              );
            })}
          </SideNavMenu>
        </SideNavMenu>
      )}
    </Box>
  );
};

export default SideNavContent;
