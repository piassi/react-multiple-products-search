import React, { useState } from 'react';
import { Button, Heading, Input } from '@/design-system/components';
import { Colors } from '@/design-system/types/colors';
import { ProductsSearch } from '@/products/domain/use-cases/products-search';
import styles from './styles.module.scss';
import {
  MAX_PRICE_INPUT_ID,
  MAX_PRICE_INPUT_LABEL,
  MIN_PRICE_INPUT_ID,
  MIN_PRICE_INPUT_LABEL,
  SEARCH_BUTTON_LABEL,
  SEARCH_INPUT_ID,
  SEARCH_INPUT_LABEL,
  SEARCH_INPUT_PLACEHOLDER,
} from './constants';
import { Product } from '@/products/domain/models/product';
import { ProductsList } from '../products-list';
import classNames from 'classnames';

type Props = {
  productsSearch: ProductsSearch;
};

export function ProductsPage(props: Props): JSX.Element {
  const { productsSearch } = props;
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setIsLoading(true);
    const newProducts = await productsSearch.execute({ search, minPrice });
    setProducts(newProducts);
    setIsLoading(false);
  }

  return (
    <div className={styles.container}>
      <Heading variant={Colors.darkGray}>Ebay Search</Heading>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={classNames(styles.formColumn, styles.searchFormColumn)}>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id={SEARCH_INPUT_ID}
            label={SEARCH_INPUT_LABEL}
            placeholder={SEARCH_INPUT_PLACEHOLDER}
            required
          />
        </div>

        <div className={styles.formColumn}>
          <Input
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            id={MIN_PRICE_INPUT_ID}
            label={MIN_PRICE_INPUT_LABEL}
            type="number"
          />
        </div>

        <div className={styles.formColumn}>
          <Input
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            id={MAX_PRICE_INPUT_ID}
            label={MAX_PRICE_INPUT_LABEL}
            type="number"
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
