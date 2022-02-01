import React from 'react';
import { useParams, Link } from 'react-router-dom';

import { Card, Table, TableDataLoadingSpinner } from 'src/components';
import { StoresByStateRecord, useStoreListQuery } from './useStoreListQuery';
import { useAppDispatch } from 'src/providers/AppStateProvider';
import { SubscriptionListEvent } from './types';
import { SubscriptionInfo } from '../Home/types';
import { Flex } from '@chakra-ui/core';
import { Column, useRowSelect, useTable } from 'react-table';

const StoreList: React.FC = () => {
  const appDispatch = useAppDispatch();
  const { state } = useParams<{ state: string }>();
  const { data, isFetched, isFetching } = useStoreListQuery(state);

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
    ],
    [],
  );

  const selectSubscriptionHandler = (subscription: SubscriptionInfo) =>
    appDispatch({
      type: SubscriptionListEvent.SUBSCRIPTION_SELECTED,
      payload: subscription,
    });

  const tableData = React.useMemo<StoresByStateRecord[]>(
    () => (data ? data : []),
    [data],
  );

  const hooks = [useRowSelect];
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<StoresByStateRecord>(
    {
      columns,
      data: tableData,
    },
    ...hooks,
  );

  return (
    /* eslint-disable react/jsx-key */
    <Card>
      <Card.Header>
        <Flex textAlign="right" justify="space-between">
          <Card.Header.Title>{state} Stores</Card.Header.Title>
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
      </Card.Body>
    </Card>
  );
};

export default StoreList;
