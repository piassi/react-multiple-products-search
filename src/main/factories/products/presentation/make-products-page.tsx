import React from 'react';
import { ProductsPage } from '@/products/presentation/products-page';
import { makeEbayProductsSearch } from '../data/make-ebay-products-search';

export function makeProductsPage(): JSX.Element {
  return <ProductsPage productsSearch={makeEbayProductsSearch()} />;
}
