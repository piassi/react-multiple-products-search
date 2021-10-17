import React from 'react';
import styles from './styles.module.scss';

export function LoadingIndicator(): JSX.Element {
  return (
    <div className={styles.loader} role="progressbar">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
