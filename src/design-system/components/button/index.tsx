import React, { ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';
import { Colors } from '../../types/colors';

type ButtonCustomProps = {
  variant?: Colors;
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & ButtonCustomProps;

export function Button(props: Props): React.ReactElement {
  const { children, variant } = props;
  return (
    <button
      className={classNames(
        styles.button,
        variant && styles[`button-${variant}`]
      )}
      {...props}
    >
      {children}
    </button>
  );
}
