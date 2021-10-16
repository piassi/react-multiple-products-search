import React from 'react';
import ReactDOM from 'react-dom';
import { mock } from 'jest-mock-extended';
import '@/design-system/styles/common.scss';
import { ProductsPage } from '@/products/presentation/products-page/products-page';
import { ProductsSearch } from '@/products/domain/use-cases/products-search';

ReactDOM.render(
  <React.StrictMode>
    <ProductsPage productsSearch={mock<ProductsSearch>()} />
  </React.StrictMode>,
  document.getElementById('root')
);
