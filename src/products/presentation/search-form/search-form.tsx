import React from 'react';
import { Button, Input } from '@/design-system/components';
import classNames from 'classnames';
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
import styles from './styles.module.scss';
import { SearchFormData } from '../products-page/products-page';
import { Colors } from '@/design-system/types/colors';

type Props = {
  stickToTop: boolean;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  searchFormData: SearchFormData;
  updateSerchFormData: (key: keyof SearchFormData, value: string) => void;
};

export function SearchForm(props: Props): JSX.Element {
  const {
    handleSubmit,
    stickToTop,
    isLoading,
    searchFormData,
    updateSerchFormData,
  } = props;

  return (
    <div
      className={classNames(styles.container, stickToTop && styles.stickToTop)}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={classNames(styles.formColumn, styles.searchFormColumn)}>
          <Input
            value={searchFormData.search}
            onChange={(e) => updateSerchFormData('search', e.target.value)}
            id={SEARCH_INPUT_ID}
            label={SEARCH_INPUT_LABEL}
            placeholder={SEARCH_INPUT_PLACEHOLDER}
            required
          />
        </div>

        <div className={styles.formColumn}>
          <Input
            value={searchFormData.minPrice}
            onChange={(e) => updateSerchFormData('minPrice', e.target.value)}
            id={MIN_PRICE_INPUT_ID}
            label={MIN_PRICE_INPUT_LABEL}
            type="number"
          />
        </div>

        <div className={styles.formColumn}>
          <Input
            value={searchFormData.maxPrice}
            onChange={(e) => updateSerchFormData('maxPrice', e.target.value)}
            id={MAX_PRICE_INPUT_ID}
            label={MAX_PRICE_INPUT_LABEL}
            type="number"
          />
        </div>

        <Button disabled={isLoading} variant={Colors.primary}>
          {SEARCH_BUTTON_LABEL}
        </Button>
      </form>
    </div>
  );
}
