import { Card } from '@/design-system/components/card';
import { Product } from '@/products/domain/models/product';
import React from 'react';
import styles from './styles.module.scss';

type Props = {
  products: Product[];
};

export function ProductsList(props: Props): JSX.Element {
  const { products } = props;

  return (
    <div className={styles.container}>
      {products.map((product) => (
        <div key={product.id} className={styles.productCard}>
          <Card title={product.name} imageURL={product.imageURL}>
            <div className={styles.price}>{product.price}</div>
          </Card>
        </div>
      ))}
    </div>
  );
}
