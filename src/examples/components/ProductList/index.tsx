import { QueryKey } from '@examples/constants';
import { useProductModel } from '@examples/models';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Paginator, ProductItem } from '@examples/components';

export const ProductList: React.FC = () => {
  const productModel = useProductModel({
    queryKey: QueryKey.ProductList,
  });
  const {
    listQuery: { list, ...queryHandler },
  } = productModel;
  const productQuery = useSelector(queryHandler.selectQuery);

  useEffect(() => {
    list();
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div>
        <div
          style={{
            border: '1px solid black',
            overflow: 'auto',
            width: 300,
            height: 600,
            padding: 10,
          }}
        >
          {productQuery?.ids?.map((id) => (
            <ProductItem key={id} productId={id} />
          ))}
        </div>
        <Paginator
          pagination={productQuery?.queryData?.pagination}
          onClickPage={(index) => list({ _page: index })}
        />
      </div>
      <pre
        style={{
          border: '1px solid black',
          overflow: 'auto',
          width: 500,
          height: 600,
          padding: 10,
          marginLeft: 20,
        }}
      >
        <code>{JSON.stringify(productQuery?.ids, null, 2)}</code>
      </pre>
    </div>
  );
};
