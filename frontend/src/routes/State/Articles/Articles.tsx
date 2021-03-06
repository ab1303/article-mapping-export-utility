/* eslint-disable react/display-name */
import React from 'react';
import { Column, useRowSelect, useTable } from 'react-table';

import { Flex } from '@chakra-ui/core';

import { Card, Table, TableDataLoadingSpinner } from 'src/components';
import { StoreArticleRecord } from './types';

type StoreArticlesProps = {
  storeArticles: StoreArticleRecord[];
};

const StoreArticles: React.FC<StoreArticlesProps> = ({
  storeArticles,
}: StoreArticlesProps) => {
  const columns = React.useMemo<Column<StoreArticleRecord>[]>(
    () => [
      {
        Header: 'Menu',
        accessor: 'menu',
      },
      {
        Header: 'Cateogry',
        accessor: 'category',
      },
      {
        Header: 'ExternalId',
        accessor: 'externalId',
      },
      {
        Header: 'External Data',
        accessor: 'externalData',
      },
      {
        Header: 'Title',
        accessor: 'title',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Price',
        accessor: 'price',
      },
      {
        Header: 'VAT',
        accessor: 'vat',
      },
    ],
    [],
  );

  const hooks = [useRowSelect];
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<StoreArticleRecord>(
    {
      columns,
      data: storeArticles,
    },
    ...hooks,
  );
  return (
    /* eslint-disable react/jsx-key */
    <Card>
      <Card.Header>
        <Flex textAlign="right" justify="space-between">
          <Card.Header.Title>
            Store Articles - Total ({storeArticles.length || ''}), Valid (
            {storeArticles.filter(sa => !!sa.externalId).length || ''})
          </Card.Header.Title>
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
            {!storeArticles.length ? (
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

StoreArticles.displayName = 'StoreArticles';
export default StoreArticles;
