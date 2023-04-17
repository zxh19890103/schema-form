import { SchemaField, RuleType } from './interfaces';
import DebugInput from './Debug';
import { RuleObject } from 'antd/es/form';

export const ComponentName2C = {
  Text: DebugInput,
  Number: DebugInput,
  Integer: DebugInput,
  Bool: DebugInput,
  Date: DebugInput,
  DateTime: DebugInput,
  Time: DebugInput,
  Month: DebugInput,
  Array: DebugInput,
  Map: DebugInput,
  Object: DebugInput,
  Debug: DebugInput,
  Select: DebugInput,
};

export const ValidatorName2V: Record<string, RuleObject[]> = {
  required: [{ required: true }],
};

export const FieldType2CName: Record<SchemaField['type'], string> = {
  number: 'Number',
  text: 'Text',
  integer: 'Integer',
  money: 'Debug',
  date: 'Date',
  datetime: 'DateTime',
  time: 'Time',
  bool: 'Bool',
  object: 'Object',
  map: 'Map',
  array: 'Array',
  email: 'Debug',
  url: 'Debug',
  phone: 'Debug',
};

export const FieldType2RuleType: Partial<
  Record<SchemaField['type'], RuleType>
> = {
  number: 'number',
  text: 'string',
  integer: 'integer',
  money: 'number',
  date: 'date',
  datetime: 'date',
  bool: 'boolean',
  email: 'email',
  url: 'url',
  map: 'object',
  array: 'object',
  object: 'object',
};
