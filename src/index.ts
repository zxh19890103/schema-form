import {
  SchemaForm,
  registerSFComponents,
  registerSFComponent,
  registerSFValidator,
  AntdFormControlPropsBase,
  CoreSchemaForJsonBasedWesForm,
  SchemaFormFieldType,
  GenericFormSchema,
} from './core';

import { InputNumber, Select } from 'antd';
import {
  Text,
  Switch,
  DebugInput,
  Integer,
  DateTimePicker,
  ObjectInput,
} from './components';

import debug_delay from './core/delay';

registerSFComponents({
  Text: Text,
  Number: InputNumber,
  Integer: Integer,
  Bool: Switch,
  Date: DateTimePicker.DatePicker,
  DateTime: DateTimePicker,
  Month: DateTimePicker.MonthPicker,
  Time: DateTimePicker.TimePicker,
  Object: ObjectInput,
  Array: DebugInput,
  Map: ObjectInput,
  Debug: DebugInput,
  Select: Select,
});

export {
  debug_delay,
  SchemaForm,
  registerSFComponents,
  registerSFValidator,
  registerSFComponent,
  type GenericFormSchema,
  type SchemaFormFieldType,
  type CoreSchemaForJsonBasedWesForm,
  type AntdFormControlPropsBase,
};
