import React from 'react';
import { Input, InputProps } from 'antd';
import { AntdFormControlPropsBase } from '../core/interfaces';

interface Props
  extends Omit<InputProps, 'value' | 'onChange'>,
    AntdFormControlPropsBase<string> {}

export default (props: Props) => {
  return (
    <Input
      {...props}
      onChange={(event) => {
        props.onChange(event.target.value.trim());
      }}
    />
  );
};
