import React, { DispatchWithoutAction } from 'react';
import { CoreSchemaForJsonBasedWesForm, SchemaField, SFC } from './interfaces';
import { FormRule } from 'antd';
import {
  ComponentName2C,
  FieldType2CName,
  FieldType2RuleType,
  ValidatorName2V,
} from './mapping';

import Debug from './Debug';
import { RuleObject } from 'antd/es/form';
import { o2options } from './util';

/**
 * @todo
 *
 * according to the `type` of field definition,
 * we can push a rule with ruleType.
 */
const normalizeSchemaField = (def: SchemaField) => {
  let tag =
    typeof def.component === 'string'
      ? def.component
      : def.component?.name ?? FieldType2CName[def.type];

  const ruleType = FieldType2RuleType[def.type];
  const _rules = def.validator?.rules || [];

  if (ruleType && !_rules.find((r) => r.type === def.type)) {
    _rules.unshift({ type: ruleType });
  }

  const isObject =
    def.type === 'array' || def.type === 'object' || def.type === 'map';

  // use Select control only if user not declare which component to render.
  if (def.enum && !def.component) {
    tag = 'Select';
  }

  return {
    /**
     * @readonly
     */
    _def: def,
    name: def.name,
    type: def.type,
    componentTag: tag,
    componentProps: {
      ...def.component?.['props'],
      disabled: def.disabled,
      readOnly: def.readonly,
      ...(isObject ? { $def: def } : null),
      ...(tag === 'Select' ? { options: o2options(def.enum) } : null),
    },
    wrapperProps: {
      colon: def.colon,
      hidden: def.hidden,
      noStyle: def.noStyle,
      labelAlign: def.labelAlign,
      labelCol: def.labelCol,
      name: def.name,
      label: def.label,
      tooltip: def.tooltip,
      required: def.required,
      validateTrigger: 'onChange',
      ...def.wrapperProps,
    },
    rules: _rules,
  };
};

const resolveSFDefault = (schema: CoreSchemaForJsonBasedWesForm) => {
  return Object.fromEntries(
    Object.entries(schema.fields)
      .map(([name, field]) => {
        if (!name || field.default === undefined) return null;
        return [name, field.default];
      })
      .filter(Boolean)
  );
};

const __ctx__ = React.createContext<ContextValue>({
  components: {},
  validators: {},
  collect: null,
  recycle: null,
  tick: null,
  getMeta: null,
});

type FieldDescripitor = ReturnType<typeof normalizeSchemaField>;

/**
 * @todo declare descripitor
 */
export type CollectedField = {
  tick: DispatchWithoutAction;
  descripitor: FieldDescripitor;
  rules: RuleObject[];
  el: HTMLDivElement;
};

export interface ContextValue {
  validators: Record<string, RuleObject[]>;
  components: Record<string, SFC>;
  getMeta: (name: string) => CollectedField;
  collect: (name: string, field: CollectedField) => void;
  recycle: (name: string) => void;
  tick: (name: string) => void;
}

/**
 * register global form validator.
 */
export const registerSFValidator = (name: string, ...rules: RuleObject[]) => {
  if (ValidatorName2V[name] !== undefined) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[SF] validator with name "${name}" will be override`);
    }
  }

  ValidatorName2V[name] = rules;
};
/**
 * register global form control
 */
export const registerSFComponent = <V = any>(name: string, fc: SFC<V>) => {
  if (ComponentName2C[name] !== undefined && ComponentName2C[name] !== Debug) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[SF] form control with name "${name}" will be override`);
    }
  }

  ComponentName2C[name] = fc;
};

export const registerSFComponents = (components: Record<string, SFC>) => {
  for (const name in components) {
    registerSFComponent(name, components[name]);
  }
};

export default {
  __ctx__,
  normalizeSchemaField,
  resolveSFDefault,
};
