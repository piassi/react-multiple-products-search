import React from 'react';
import { ProductsPage } from '@/products/presentation/products-page';
import { makeEbayProductsSearch } from '../data/ebay/make-ebay-products-search';
import { makeLocalProductsSearch } from '../data/local/make-local-products-search';
import { makeLocalSaveSearch } from '../data/local/make-local-save-search';

export function makeProductsPage(): JSX.Element {
  return (
    <ProductsPage
      saveSearch={makeLocalSaveSearch()}
      productsSearch={[makeEbayProductsSearch(), makeLocalProductsSearch()]}
    />
  );
}
