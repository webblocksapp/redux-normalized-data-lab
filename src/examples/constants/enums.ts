export enum EntityName {
  Products = 'products',
  Videos = 'videos',
}

export enum QueryKey {
  ProductList = 'ProductList',
  ProductPaginatedList = 'ProductPaginatedList',
  ProductCrud = 'ProductCrud',
}

export enum ProductActionType {
  LIST = 'PRODUCT:LIST',
  CREATE = 'PRODUCT:CREATE',
  UPDATE = 'PRODUCT:UPDATE',
  REMOVE = 'PRODUCT:REMOVE',
}
