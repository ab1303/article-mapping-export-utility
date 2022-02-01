/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import {
  Card,
  Table,
  TableDataLoadingSpinner,
  IndeterminateCheckbox,
  StoreArticlesModal,
} from 'src/components';
import { StoresByStateRecord, useStoreListQuery } from './useStoreListQuery';
import { useAppDispatch } from 'src/providers/AppStateProvider';

import {
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
  useToast,
} from '@chakra-ui/core';
import {
  CellProps,
  Column,
  HeaderProps,
  Hooks,
  useRowSelect,
  useTable,
} from 'react-table';
import { MdMoreVert } from 'react-icons/md';
import { AxiosError } from 'axios';
import { useResubmitAllMutation } from '../SubscriptionDeadLetters/useResubmitAllMutation';
import { StoreArticleRecord } from '../Articles/types';

const selectionHook = (hooks: Hooks<any>) => {
  hooks.visibleColumns.push(columns => [
    // Let's make a column for selection
    {
      id: '_selector',
      disableResizing: true,
      disableGroupBy: true,
      minWidth: 45,
      width: 45,
      maxWidth: 45,
      // The header can use the table's getToggleAllRowsSelectedProps method
      // to render a checkbox
      Header: ({ getToggleAllRowsSelectedProps }: HeaderProps<any>) => (
        // @ts-ignore
        <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
      ),
      // The cell can use the individual row's getToggleRowSelectedProps method
      // to the render a checkbox
      Cell: ({ row }: CellProps<any>) => (
        // @ts-ignore
        <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
      ),
    },
    ...columns,
  ]);
  hooks.useInstanceBeforeDimensions.push(({ headerGroups }) => {
    // fix the parent group of the selection button to not be resizable
    const selectionGroupHeader = headerGroups[0].headers[0];
    selectionGroupHeader.canResize = false;
  });
};

const StoreList: React.FC<{
  storeArticles: StoreArticleRecord[];
}> = ({ storeArticles }) => {
  const appDispatch = useAppDispatch();
  const toast = useToast();
  const { state } = useParams<{ state: string }>();
  const { data, isFetched, isFetching } = useStoreListQuery(state);

  const [rowIndex, setRowIndex] = useState<number | null>(null);
  const [resubmitAllState, setResubmitAllState] = useState<boolean>(false);
  const [openMessageModal, setOpenMessageModal] = useState<boolean>(false);
  const [showTableLoading, setShowTableLoading] = useState<boolean>(false);
  const [resubmitAllAlertDialog, setResubmitAllAlertDialog] = useState<boolean>(
    false,
  );

  const [
    messageSelectionLockedUntilUtc,
    setMessageSelectionLockedUntilUtc,
  ] = useState<number | null>(null);

  const [
    resubmitSelectedAlertDialog,
    setResubmitSelectedAlertDialog,
  ] = useState<{
    showDialog: boolean;
    storeIds: number[];
  }>({
    showDialog: false,
    storeIds: [],
  });

  useEffect(() => {
    if (!messageSelectionLockedUntilUtc) return;

    const interval = window.setInterval(() => {
      if (Date.now() > messageSelectionLockedUntilUtc) {
        setMessageSelectionLockedUntilUtc(null);
      }
    }, 1000);
    return () => {
      console.log('Timer cleared');
      window.clearInterval(interval);
    };
  }, [messageSelectionLockedUntilUtc]);

  useEffect(() => {
    if (isFetching || resubmitAllState) {
      setShowTableLoading(true);
      return;
    }

    setShowTableLoading(false);
  }, [isFetching, resubmitAllState]);

  const columns = React.useMemo<Column<StoresByStateRecord>[]>(
    () => [
      {
        Header: 'Store Id',
        accessor: 'storeId',
      },
      {
        Header: 'Store Name',
        accessor: 'storeName',
      },
      {
        Header: 'Street',
        accessor: 'street',
      },
      {
        Header: 'Suburb',
        accessor: 'suburb',
      },
      {
        Header: 'Payload',
        Cell: ({ row }: CellProps<any>) => {
          const { index } = row;

          return (
            // @ts-ignore
            <Icon
              style={{ cursor: 'hand' }}
              onClick={() => {
                setRowIndex(index);
                setOpenMessageModal(true);
              }}
              name="email"
            />
          );
        },
      },
    ],
    [],
  );

  const tableData = React.useMemo<StoresByStateRecord[]>(
    () => (data ? data : []),
    [data],
  );

  const hooks = [useRowSelect, selectionHook];
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    selectedFlatRows,
    prepareRow,
  } = useTable<StoresByStateRecord>(
    {
      columns,
      data: tableData,
    },
    ...hooks,
  );

  const resubmitSelectedHandler = () => {
    const storeIds = selectedFlatRows.map(sfr => sfr.original.storeId);
    setResubmitSelectedAlertDialog({
      showDialog: true,
      storeIds,
    });
  };

  function prepareStoreArticles(storeId: number) {
    const storeArticlesPayload = storeArticles.map(sa => {
      return {
        channel: 'UE',
        storeId: storeId,
        articleId: sa.externalId,
      };
    });
    return JSON.stringify(storeArticlesPayload);
  }

  const disableSelectedAction = false;
  return (
    /* eslint-disable react/jsx-key */
    <Card>
      <Card.Header>
        <Flex textAlign="right" justify="space-between">
          <Card.Header.Title>{state} Stores</Card.Header.Title>
          <Menu>
            <MenuButton as={Button}>
              <MdMoreVert />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => setResubmitAllAlertDialog(true)}>
                Upload articles for all Stores
              </MenuItem>
              <MenuItem
                isDisabled={disableSelectedAction}
                onClick={resubmitSelectedHandler}
              >
                Upload articles for selected Stores
                {disableSelectedAction && (
                  <span
                    style={{
                      marginLeft: '5px',
                      marginBottom: '5px',
                    }}
                  >
                    <Tooltip
                      zIndex={2}
                      aria-label="Warning"
                      label="Please try resubmitting individual messages after few seconds"
                      placement="right"
                    >
                      <Icon size="5" color="yellow.600" name="warning" />
                    </Tooltip>
                  </span>
                )}
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Card.Header>
      <Card.Body>
        <Table {...getTableProps()}>
          <Table.THead>
            {headerGroups.map(headerGroup => (
              <Table.THead.TR {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <Table.THead.TH {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </Table.THead.TH>
                ))}
              </Table.THead.TR>
            ))}
          </Table.THead>
          <Table.TBody {...getTableBodyProps()}>
            {isFetching ? (
              <TableDataLoadingSpinner columnsCount={columns.length + 1} />
            ) : (
              rows.map(row => {
                prepareRow(row);
                return (
                  <Table.TBody.TR {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      return (
                        <Table.TBody.TD {...cell.getCellProps()}>
                          {cell.render('Cell')}
                        </Table.TBody.TD>
                      );
                    })}
                  </Table.TBody.TR>
                );
              })
            )}
          </Table.TBody>
        </Table>

        <StoreArticlesModal
          openMessageModal={openMessageModal}
          onCloseMessageModal={() => setOpenMessageModal(false)}
          message={
            rowIndex != null
              ? prepareStoreArticles(tableData[rowIndex].storeId)
              : ''
          }
        />
      </Card.Body>
    </Card>
  );
};

export default StoreList;
