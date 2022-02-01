/* eslint-disable react/display-name */
import React, { useState } from 'react';
import { CellProps, Column, useRowSelect, useTable } from 'react-table';

import { Flex, Icon } from '@chakra-ui/core';

import { Card, Table, TableDataLoadingSpinner } from 'src/components';

type StoreArticleRecord = {
  menu: string;
  category: string;
  externalId: number;
  externalData: number;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  vat: number;
};

type StoreArticlesProps = {
  fileRecords: Array<string[]>;
};

const StoreArticles: React.FC<StoreArticlesProps> = ({
  fileRecords,
}: StoreArticlesProps) => {
  const [modalRowIndex, setModalRowIndex] = useState<number | null>(null);

  const [openMessageModal, setOpenMessageModal] = useState<boolean>(false);
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

  const tableData = React.useMemo<StoreArticleRecord[]>(
    () =>
      fileRecords
        ? fileRecords.slice(1).map(record => ({
            menu: record[0],
            category: record[1],
            externalId: +record[2],
            externalData: +record[3],
            title: record[4],
            description: record[5],
            imageUrl: record[6],
            price: +record[7],
            vat: +record[8],
          }))
        : [],
    [fileRecords],
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
      data: tableData,
    },
    ...hooks,
  );
  return (
    /* eslint-disable react/jsx-key */
    <Card>
      <Card.Header>
        <Flex textAlign="right" justify="space-between">
          <Card.Header.Title>State wide Store Articles</Card.Header.Title>
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
            {!fileRecords.length ? (
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

        {/* <MessageModal
          openMessageModal={openMessageModal}
          onCloseMessageModal={() => setOpenMessageModal(false)}
          message={modalRowIndex != null ? tableData[modalRowIndex] : null}
          displayProps={['messageId', 'content']}
        /> */}
      </Card.Body>
    </Card>
  );
};

StoreArticles.displayName = 'StoreArticles';
export default StoreArticles;
