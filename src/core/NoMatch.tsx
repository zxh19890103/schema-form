import React from 'react';
import { Alert } from 'antd';
import { SchemaField } from './interfaces';

const NoMatch = (props: { def: SchemaField }) => {
  return (
    <Alert
      type="error"
      description={
        <span>miss match for component with name `{props.def.name}`</span>
      }
    />
  );
};

export default NoMatch;
