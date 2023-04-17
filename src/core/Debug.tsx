import React from 'react';
import { AntdFormControlPropsBase } from './interfaces';

export default (props: AntdFormControlPropsBase) => {
  return <div>[debug] input for {props.value}</div>;
};
