import React, { useState } from 'react';
import { ProductsSearch } from '@/products/domain/use-cases/products-search';
import styles from './styles.module.scss';
import { Product } from '@/products/domain/models/product';
import { ProductsList } from '../products-list';
import { SearchForm } from '../search-form';
import classNames from 'classnames';
import { LoadingIndicator } from '@/design-system/components/loading-indicator';
import { NoProductsFoundError } from '@/products/domain/errors/no-products-found';
import { GENERIC_ERROR_MESSAGE } from './constants';

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
  const [errorMessage, setErrorMessage] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  function updateSerchFormData(key: keyof SearchFormData, value: string): void {
    setSearchFormData({
      ...searchFormData,
      [key]: value,
    });
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    try {
      e.preventDefault();
      setErrorMessage('');
      setIsLoading(true);
      setProducts([]);

      const { search, minPrice, maxPrice } = searchFormData;

      const newProducts = await productsSearch.execute({
        search,
        minPrice,
        maxPrice,
      });
      setProducts(newProducts);
    } catch (error) {
      if (error instanceof NoProductsFoundError) {
        setErrorMessage(NoProductsFoundError.message);
      } else {
        setErrorMessage(GENERIC_ERROR_MESSAGE);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const hasProducts = Boolean(products.length);
  const shouldStickSearchToTop = Boolean(
    hasProducts || isLoading || errorMessage
  );

  return (
    <div
      className={classNames(
        styles.container,
        shouldStickSearchToTop && styles.withPadding
      )}
    >
      <SearchForm
        isLoading={isLoading}
        stickToTop={shouldStickSearchToTop}
        handleSubmit={handleSubmit}
        searchFormData={searchFormData}
        updateSerchFormData={updateSerchFormData}
      />

      <div
        className={classNames(
          styles.pageContent,
          hasProducts && styles.pageContentWithProducts
        )}
      >
        {errorMessage && <div>{errorMessage}</div>}
        {isLoading && <LoadingIndicator />}
        {hasProducts && <ProductsList products={products} />}
      </div>
    </div>
  );
}
