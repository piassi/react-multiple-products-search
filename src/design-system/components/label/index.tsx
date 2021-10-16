import React, { LabelHTMLAttributes } from 'react';
import styles from './styles.module.scss';

type Props = LabelHTMLAttributes<HTMLLabelElement>;

export function Label(props: Props): React.ReactElement {
  const { children } = props;
  return (
    <label className={styles.label} {...props}>
      {children}
    </label>
  );
}
