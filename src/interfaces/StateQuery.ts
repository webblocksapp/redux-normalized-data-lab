export type StateQuery<TQueryData = any> = {
  ids: Array<string>;
  queryKey: string;
  queryData?: TQueryData;
};
