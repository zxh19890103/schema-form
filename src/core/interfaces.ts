import React from 'react';
import { FormInstance } from 'antd';
import {
  CoreSchemaForJsonBasedWesForm,
  Field,
  RuleType,
} from '../../schema/schema';
import { CollectedField as CollectedFieldMeta, ContextValue } from './context';

export { type CoreSchemaForJsonBasedWesForm, type RuleType };

export interface SchemaField
  extends Field,
    SchemaFieldEnhancement,
    SchemaFieldRenderred {}

export interface AntdFormControlPropsBase<V = any> {
  value?: V;
  onChange?: (value: V) => void;
  /**
   * 只 type 为 array/map/object 的时候这个属性有值
   */
  $def?: Field;
  [k: string]: any;
}

export type SFC<V = any> = React.FC<AntdFormControlPropsBase<V>>;

export interface GenericFormSchema {
  formProps: Record<string, any>;
  fields: Record<string, any>;
}

interface SchemaFieldEnhancementGetInitialStateReturns {
  hidden?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  value?: any;
}

export interface SchemaFieldEnhancement {
  beforeChange?: (
    value: any,
    schema: SchemaField,
    form: SchemaFormInstance
  ) => Promise<boolean> | boolean;
  afterChanged?: (
    value: any,
    schame: SchemaField,
    form: SchemaFormInstance
  ) => void;
  /**
   * It calls Form.setFieldValue after component mounted.
   *
   * Different from getInitialValue on Form.
   */
  initialState?: (
    schema: SchemaField,
    form: SchemaFormInstance
  ) =>
    | Promise<SchemaFieldEnhancementGetInitialStateReturns>
    | SchemaFieldEnhancementGetInitialStateReturns;
}

export interface SchemaFieldRenderred {}

export interface SchemaFormInstanceAbstract {
  $ctx: ContextValue;
  $schema: CoreSchemaForJsonBasedWesForm;
  $defaultSubmit: VoidFunction;
  $defaultReset: VoidFunction;

  isRequired(name: string): boolean;
  isEnabled(name: string): boolean;
  isDisabled(name: string): boolean;
  isReadonly(name: string): boolean;
  isVisible(name: string): boolean;
  isHidden(name: string): boolean;
  setRequired(name: string, required: boolean): void;
  setTooltip(name: string, tooltip: React.ReactNode): void;
  setLabel(name: string, label: React.ReactNode): void;
  getMeta(name: string): CollectedFieldMeta;
  disable(name: string): void;
  endable(name: string): void;
  setReadOnly(name: string, value: boolean): void;
  setVisible(name: string, visible: boolean): void;
  focus(name: string): void;
  blur(name: string): void;
}

export interface SchemaFormInstance
  extends SchemaFormInstanceAbstract,
    FormInstance {}

export type SchemaFormFieldType = SchemaField['type'];
