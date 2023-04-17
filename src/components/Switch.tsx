import React from 'react';
import { SwitchProps, Switch } from 'antd';
import { AntdFormControlPropsBase } from '../core/interfaces';

interface Props
  extends Omit<SwitchProps, 'onChange'>,
    AntdFormControlPropsBase<boolean> {}

export default (props: Props) => {
  return <Switch {...props} checked={props.value} />;
};
