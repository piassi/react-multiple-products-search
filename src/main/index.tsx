import React from 'react';
import ReactDOM from 'react-dom';
import '@/design-system/styles/common.scss';
import { makeProductsPage } from './factories/products/presentation/make-products-page';

ReactDOM.render(
  <React.StrictMode>{makeProductsPage()}</React.StrictMode>,
  document.getElementById('root')
);
