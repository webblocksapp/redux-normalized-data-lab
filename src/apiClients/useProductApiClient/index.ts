import { EntityParams, ListResponse, Pagination, Product } from '@interfaces';
import { axiosLocal } from '@utils';

export const useProductApiClient = () => {
  const list = async (
    params?: EntityParams<Product>
  ): Promise<{
    products: Product[];
    pagination: Pagination;
  }> => {
    const { data } = await axiosLocal.get<ListResponse<Product>>('/products', {
      params: { _size: 10, _page: 0, ...params },
    });
    return {
      products: data.content,
      pagination: {
        totalPages: data.totalPages,
        size: data.pageable.pageSize,
        page: data.pageable.pageNumber,
        totalElements: data.totalElements,
      },
    };
  };

  return { list };
};
