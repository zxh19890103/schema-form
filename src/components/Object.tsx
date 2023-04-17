import React from 'react';
import { AntdFormControlPropsBase } from '../core/interfaces';
import Match from '../core/Match';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { SchemaForm } from '../core';

interface Props extends AntdFormControlPropsBase<object> {}

/**
 * Not support yet.
 * @deprecated
 */
export default (props: Props) => {
  const { $def } = props;

  const form = SchemaForm.useFormInstance();

  const wprops = { parent: $def.name };

  return (
    <div className="imhs-sfc-object">
      {$def.struct?.map((field) => {
        return (
          <Match
            form={form}
            key={field.name}
            schema={field}
            wrapper={Item}
            wrapperProps={wprops}
          />
        );
      })}
    </div>
  );
};

interface ItemProps {
  parent: string;
  [k: string]: any;
}

/**
 * @todo
 */
const Item = (props: React.PropsWithChildren<ItemProps>) => {
  const control = props.children as React.ReactElement;
  const form = useFormInstance();

  const rootValue = form.getFieldValue(props.parent);

  const value = rootValue?.[props.name];

  const onChange = (val) => {
    form.setFieldValue(props.parent, { ...rootValue, [props.name]: val });
  };

  return (
    <div className={props.className}>
      <label>{props.label}</label>
      <div>
        <control.type {...control.props} value={value} onChange={onChange} />
      </div>
    </div>
  );
};
