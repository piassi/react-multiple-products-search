import classNames from 'classnames';
import React, { HTMLAttributes } from 'react';
import { Colors } from '../../types/colors';
import styles from './styles.module.scss';

type HeadingCustomProps = {
  variant?: Colors;
};

type Props = HTMLAttributes<HTMLHeadingElement> & HeadingCustomProps;

export function Heading(props: Props): React.ReactElement {
  const { children, variant } = props;
  return (
    <h1
      className={classNames(
        styles.heading,
        variant && styles[`heading-${variant}`]
      )}
      {...props}
    >
      {children}
    </h1>
  );
}
