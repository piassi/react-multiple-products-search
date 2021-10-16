import React, { InputHTMLAttributes } from 'react';
import { Label } from '../label';
import styles from './styles.module.scss';

type CustomInputProps = {
  label?: string;
};

type Props = InputHTMLAttributes<HTMLInputElement> & CustomInputProps;

export function Input(props: Props): React.ReactElement {
  const { id, label } = props;

  return (
    <div className={styles.input}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <input id={id} className={styles.inputTag} {...props} />
    </div>
  );
}
