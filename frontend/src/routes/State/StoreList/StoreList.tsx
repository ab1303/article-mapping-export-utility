/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  Card,
  Table,
  TableDataLoadingSpinner,
  IndeterminateCheckbox,
  StoreArticlesModal,
} from 'src/components';
import { useStoreListQuery } from './useStoreListQuery';

import {
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
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
import { StoreArticleRecord } from '../Articles/types';
import { useUploadArticlesMutation } from './useUploadArticlesMutation';
import { AxiosError } from 'axios';
import {
  ChannelStoreArticleData,
  StoreArticleStatus,
  StoresByStateUploadRecord,
} from './types';

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
      Cell: ({ row }: CellProps<any>) => {
        // if (row.original.storeId === 1370) return null;
        switch (row.original.status) {
          case StoreArticleStatus.UN_PROCESSED:
            return (
              <>
                {
                  // @ts-ignore
                  <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                }
              </>
            );
          case StoreArticleStatus.IN_PROGRESS:
          case StoreArticleStatus.PROCESSED:
          case StoreArticleStatus.FAILED:
          default:
            return null;
        }
      },
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
  const toast = useToast();
  const { state } = useParams<{ state: string }>();
  const { data, isFetching } = useStoreListQuery(state);

  const [tableData, setTableData] = useState<StoresByStateUploadRecord[]>([]);
  const [rowIndex, setRowIndex] = useState<number | null>(null);
  const [openMessageModal, setOpenMessageModal] = useState<boolean>(false);

  useEffect(() => {
    if (data) setTableData(data.map(d => ({ ...d, status: 'UN_PROCESSED' })));
  }, [data]);

  function prepareStoreArticles(storeId: number): ChannelStoreArticleData[] {
    const storeArticlesPayload = storeArticles.map(sa => {
      return {
        channel: 'UE',
        storeId: storeId,
        articleId: sa.externalId,
      };
    });
    return storeArticlesPayload;
  }

  const exportDataHandler = (
    fileName: string,
    data: ChannelStoreArticleData[],
  ) => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data),
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `Store Articles - ${fileName}.json`;

    link.click();
  };

  const columns = React.useMemo<Column<StoresByStateUploadRecord>[]>(
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
      {
        Header: 'Download',
        Cell: ({ row }: CellProps<any>) => {
          const { original } = row;

          return storeArticles.length ? (
            <Icon
              style={{ cursor: 'hand' }}
              onClick={() => {
                exportDataHandler(
                  original.storeId,
                  prepareStoreArticles(original.storeId),
                );
              }}
              name="attachment"
            />
          ) : null;
        },
      },
      {
        Header: 'Status',
        Cell: ({ row }: CellProps<any>) => {
          const { original } = row;

          switch (original.status) {
            case StoreArticleStatus.IN_PROGRESS:
              return (
                <Spinner
                  thickness="2px"
                  size="sm"
                  color="teal.500"
                  emptyColor="gray.200"
                />
              );
            case StoreArticleStatus.PROCESSED:
              return <Icon name="check" />;
            case StoreArticleStatus.FAILED:
              return <Icon name="repeat" />;
            default:
              return null;
          }
        },
      },
    ],
    [storeArticles],
  );

  const hooks = [useRowSelect, selectionHook];
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    selectedFlatRows,
    prepareRow,
  } = useTable<StoresByStateUploadRecord>(
    {
      columns,
      data: tableData,
    },
    ...hooks,
  );

  const {
    mutateAsync: uploadStoreArticlesMutationAsync,
  } = useUploadArticlesMutation();

  const downloadArticlesJsonHandler = async () => {
    const storeIds = selectedFlatRows.map(sfr => sfr.original.storeId);

    const preparedStoreArticles = storeIds
      .map(storeId => prepareStoreArticles(storeId))
      .reduce((prev, current) => [...prev, ...current]);

    exportDataHandler('selected', preparedStoreArticles);
  };

  const uploadArticlesHandler = async () => {
    const storeIds = selectedFlatRows
      .filter(
        sfr =>
          sfr.original.status === StoreArticleStatus.UN_PROCESSED ||
          sfr.original.status === StoreArticleStatus.FAILED,
      )
      .map(sfr => sfr.original.storeId);

    for (let index = 0; index < storeIds.length; index++) {
      const storeId = storeIds[index];
      const preparedStoreArticles = prepareStoreArticles(storeId);

      setTableData(prevTableData =>
        prevTableData.map(d => {
          if (d.storeId === storeId)
            return { ...d, status: StoreArticleStatus.IN_PROGRESS };
          return d;
        }),
      );

      await uploadStoreArticlesMutationAsync(
        {
          storeId,
          storeArticles: preparedStoreArticles,
        },
        {
          onSuccess: result => {
            console.log('upload articles result', result);
            setTableData(prevTableData =>
              prevTableData.map(d => {
                if (d.storeId === storeId)
                  return { ...d, status: StoreArticleStatus.PROCESSED };
                return d;
              }),
            );

            toast({
              title: 'Channel Store Articles',
              description:
                'Articles for selected stores uploaded successfully!',
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
          },
          onError: (error: AxiosError) => {
            let errorMessage = error.message;
            if (error.response && error.response.data) {
              errorMessage = `${errorMessage}. ${error.response.data.message}`;
            }
            toast({
              title: 'Server Error',
              description: errorMessage || '',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          },
        },
      );
    }
  };

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
              <MenuItem
                isDisabled={disableSelectedAction}
                onClick={uploadArticlesHandler}
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
              <MenuItem
                isDisabled={disableSelectedAction}
                onClick={downloadArticlesJsonHandler}
              >
                Download Json file for selected Stores
                <span
                  style={{
                    marginLeft: '5px',
                    marginBottom: '5px',
                  }}
                >
                  <Icon size="5" name="attachment" />
                </span>
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
              ? JSON.stringify(
                  prepareStoreArticles(tableData[rowIndex].storeId),
                )
              : ''
          }
        />
      </Card.Body>
    </Card>
  );
};

export default StoreList;
