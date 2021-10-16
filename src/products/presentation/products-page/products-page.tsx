import React, { useState } from 'react';
// import { Button, Heading, Input } from '@/design-system/components';
import { Colors } from '@/design-system/types/colors';
import { ProductsSearch } from '@/products/domain/use-cases/products-search';
import styles from './styles.module.scss';
import {
  SEARCH_BUTTON_LABEL,
  SEARCH_INPUT_ID,
  SEARCH_INPUT_LABEL,
} from './constants';
import { Heading } from '@/design-system/components/heading';
import { Button } from '@/design-system/components/button';
import { Input } from '@/design-system/components/input';

type Props = {
  productsSearch: ProductsSearch;
};

export function ProductsPage(props: Props): JSX.Element {
  const { productsSearch } = props;
  const [search, setSearch] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    productsSearch.execute(search);
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
            placeholder="Search for anything"
          />
        </div>
        <Button variant={Colors.primary}>{SEARCH_BUTTON_LABEL}</Button>
      </form>
    </div>
  );
}
