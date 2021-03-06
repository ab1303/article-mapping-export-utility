import React, { useMemo } from 'react';
import { Box, Flex, Text } from '@chakra-ui/core';
import styled from '@emotion/styled';

import { SideNavMode } from './modules/constants';

type CaretProps = {
  isOpen: boolean;
};

const Caret = styled(Box)<CaretProps>`
  transition: transform 150ms ease-in;
  transform: ${({ isOpen }) => `rotate(${isOpen ? 180 : 0}deg)`};
  border-top-width: 4px;
  border-top-style: dashed;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
`;

type Props = {
  mode?: SideNavMode;
};

const SideNavProfile: React.FC<Props> = ({ mode }) => {
  const textColor = useMemo(
    () => (mode === SideNavMode.DARK ? 'whiteAlpha.900' : 'gray.800'),
    [mode],
  );

  const borderColor = useMemo(
    () => (mode === SideNavMode.DARK ? 'whiteAlpha.300' : 'gray.200'),
    [mode],
  );

  return (
    <Box py="5" borderBottomWidth="1px" borderColor={borderColor}>
      <Flex size="100%" align="center">
        <Text flex={1} fontSize="md" color={textColor}>
          Store Mapping ETL
        </Text>
      </Flex>
    </Box>
  );
};

export default SideNavProfile;
