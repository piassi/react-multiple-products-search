import React, { useState } from 'react';
import { Button, Heading, Input } from '@/design-system/components';
import { Colors } from '@/design-system/types/colors';
import { ProductsSearch } from '@/products/domain/use-cases/products-search';
import styles from './styles.module.scss';
import {
  SEARCH_BUTTON_LABEL,
  SEARCH_INPUT_ID,
  SEARCH_INPUT_LABEL,
  SEARCH_INPUT_PLACEHOLDER,
} from './constants';
import { Product } from '@/products/domain/models/product';
import { ProductsList } from '../products-list';

type Props = {
  productsSearch: ProductsSearch;
};

export function ProductsPage(props: Props): JSX.Element {
  const { productsSearch } = props;
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setIsLoading(true);
    const newProducts = await productsSearch.execute(search);
    setProducts(newProducts);
    setIsLoading(false);
  }

  return (
    <div className={styles.container}>
      <Heading variant={Colors.darkGray}>Ebay Search</Heading>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.searchInput}>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id={SEARCH_INPUT_ID}
            label={SEARCH_INPUT_LABEL}
            placeholder={SEARCH_INPUT_PLACEHOLDER}
            required
          />
        </div>

        <Button disabled={isLoading} variant={Colors.primary}>
          {SEARCH_BUTTON_LABEL}
        </Button>
      </form>

      <ProductsList products={products} />
    </div>
  );
}
