import React from 'react';

import { AntdFormControlPropsBase } from '../core/interfaces';
import { Alert } from 'antd';

interface Props extends AntdFormControlPropsBase<any[]> {}

/**
 * Not support yet.
 * @todo
 */
export default (props: Props) => {
  return <Alert type="warning" message="Not support yet!" />;
};
