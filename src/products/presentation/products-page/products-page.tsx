import React, { useState } from 'react';
import { Heading } from '@/design-system/components';
import { Colors } from '@/design-system/types/colors';
import { ProductsSearch } from '@/products/domain/use-cases/products-search';
import styles from './styles.module.scss';
import { Product } from '@/products/domain/models/product';
import { ProductsList } from '../products-list';
import { SearchForm } from '../search-form';

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
    <div className={styles.container}>
      <Heading variant={Colors.darkGray}>Ebay Search</Heading>

      <SearchForm
        isLoading={isLoading}
        hasProducts={Boolean(products.length)}
        handleSubmit={handleSubmit}
        searchFormData={searchFormData}
        updateSerchFormData={updateSerchFormData}
      />

      <ProductsList products={products} />
    </div>
  );
}
