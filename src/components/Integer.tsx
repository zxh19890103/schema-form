import React from 'react';
import { InputNumber, InputNumberProps } from 'antd';
import { AntdFormControlPropsBase } from '../core/interfaces';

interface Props
  extends Omit<InputNumberProps, 'value' | 'onChange'>,
    AntdFormControlPropsBase<number> {}

const transform = (val: number) => {
  if (val === null || val === undefined) {
    return val;
  } else {
    return Math.round(val);
  }
};

export default (props: Props) => {
  const displayValue = transform(props.value);

  return (
    <InputNumber
      {...props}
      step={props.step}
      precision={0}
      value={displayValue}
      onChange={(val) => {
        props.onChange(transform(val as number));
      }}
    />
  );
};
