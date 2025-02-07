import { Id, QueryState } from '@interfaces';
import { calcPage, calcPagination, mergeIds, removeArrayExcess } from '@utils';

const queryExists = (item: QueryState, queryKey: string) =>
  item.queryKey == queryKey;

export const mergeQueries = (args: {
  queries: QueryState[];
  queryKey: string | undefined;
  ids: Id[];
  pagination?: QueryState['pagination'];
  sizeMultiplier?: number;
  currentPage?: number;
  params?: any;
  invalidatedQuery?: boolean;
}): QueryState[] => {
  const {
    queries,
    queryKey,
    ids,
    pagination,
    sizeMultiplier,
    currentPage,
    params,
    invalidatedQuery,
  } = args;

  if (queryKey === undefined) return queries;

  const calculatedPagination = pagination
    ? calcPagination({ ...pagination, sizeMultiplier })
    : undefined;
  const calculatedCurrentPage =
    currentPage && pagination
      ? calcPage({
          page: currentPage,
          size: pagination.size,
          sizeMultiplier,
        })
      : undefined;

  if (queries.some((item) => queryExists(item, queryKey))) {
    return queries.map((item) => {
      if (queryExists(item, queryKey)) {
        let mergedIds = invalidatedQuery
          ? ids
          : mergeIds(item.ids, ids, calculatedPagination);

        if (pagination?.totalElements !== undefined) {
          mergedIds = removeArrayExcess(mergedIds, pagination.totalElements);
        }

        return {
          ...item,
          ids: mergedIds,
          params,
          ...(pagination
            ? {
                pagination: {
                  ...pagination,
                  page: currentPage ?? pagination?.page,
                },
              }
            : undefined),
          ...(calculatedPagination
            ? {
                calculatedPagination: {
                  ...calculatedPagination,
                  page: calculatedCurrentPage ?? calculatedPagination?.page,
                },
              }
            : undefined),
          currentPage,
          calculatedCurrentPage,
          hasRecords: Boolean(ids.length),
        };
      }
      return item;
    });
  } else {
    return [
      ...queries,
      {
        queryKey,
        ids,
        pagination,
        calculatedPagination,
        currentPage,
        calculatedCurrentPage,
        params,
        loading: false,
        listing: false,
        creating: false,
        updating: false,
        reading: false,
        removing: false,
        hasRecords: Boolean(ids.length),
      },
    ];
  }
};
