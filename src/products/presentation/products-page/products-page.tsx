import React, { useState } from 'react';
import { ProductsSearch } from '@/products/domain/use-cases/products-search';
import styles from './styles.module.scss';
import { Product } from '@/products/domain/models/product';
import { ProductsList } from '../products-list';
import { SearchForm } from '../search-form';
import classNames from 'classnames';
import { LoadingIndicator } from '@/design-system/components/loading-indicator';

type Props = {
  productsSearch: ProductsSearch;
};

export type SearchFormData = {
  search: string;
  minPrice: string;
  maxPrice: string;
};

export function ProductsPage(props: Props): JSX.Element {
  const { productsSearch } = props;
  const [searchFormData, setSearchFormData] = useState<SearchFormData>({
    search: '',
    minPrice: '',
    maxPrice: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  function updateSerchFormData(key: keyof SearchFormData, value: string): void {
    setSearchFormData({
      ...searchFormData,
      [key]: value,
    });
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setIsLoading(true);

    const { search, minPrice, maxPrice } = searchFormData;

    const newProducts = await productsSearch.execute({
      search,
      minPrice,
      maxPrice,
    });
    setProducts(newProducts);
    setIsLoading(false);
  }

  return (
    <div
      className={classNames(
        styles.container,
        (products.length || isLoading) && styles.withPadding
      )}
    >
      <SearchForm
        isLoading={isLoading}
        stickToTop={Boolean(products.length || isLoading)}
        handleSubmit={handleSubmit}
        searchFormData={searchFormData}
        updateSerchFormData={updateSerchFormData}
      />

      {isLoading ? <LoadingIndicator /> : <ProductsList products={products} />}
    </div>
  );
}
