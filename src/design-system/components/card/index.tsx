import React, { HTMLAttributes } from 'react';
import { Heading } from '..';
import styles from './styles.module.scss';

type CardCustomProps = {
  title: string;
};

type Props = HTMLAttributes<HTMLDivElement> & CardCustomProps;

export function Card(props: Props): React.ReactElement {
  const { children, title } = props;
  return (
    <div className={styles.card} {...props}>
      <Heading>{title}</Heading>

      {children}
    </div>
  );
}
