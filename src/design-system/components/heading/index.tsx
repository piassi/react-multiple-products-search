import classNames from 'classnames';
import React, { HTMLAttributes } from 'react';
import { Colors } from '../../types/colors';
import styles from './styles.module.scss';

type HeadingCustomProps = {
  variant?: Colors;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
};

type Props = HTMLAttributes<HTMLHeadingElement> & HeadingCustomProps;

export function Heading(props: Props): React.ReactElement {
  const { children, variant, tag = 'h1' } = props;

  const HeadingTag = tag;

  return (
    <HeadingTag
      className={classNames(
        styles.heading,
        variant && styles[`heading-${variant}`]
      )}
      {...props}
    >
      {children}
    </HeadingTag>
  );
}
