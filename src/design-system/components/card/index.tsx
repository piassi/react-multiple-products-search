import React, { HTMLAttributes } from 'react';
import { Heading } from '..';
import { ShoppingCartIcon } from '@/design-system/icons/shopping-cart';
import styles from './styles.module.scss';

type CardCustomProps = {
  title: string;
  imageURL?: string;
};

type Props = HTMLAttributes<HTMLDivElement> & CardCustomProps;

export function Card(props: Props): JSX.Element {
  const { children, title, imageURL, ...rest } = props;
  return (
    <div className={styles.card} {...rest}>
      <div className={styles.image}>
        {imageURL ? <img src={imageURL} alt={title} /> : <ShoppingCartIcon />}
      </div>

      <Heading tag="h3">{title}</Heading>
      {children}
    </div>
  );
}
