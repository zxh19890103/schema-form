import React from 'react';
import context, { ContextValue } from './context';
import { ComponentName2C, ValidatorName2V } from './mapping';
import { RuleObject } from 'antd/es/form';

export interface SFProviderProps {
  validators?: Record<string, RuleObject[] | RuleObject>;
  components?: Record<string, React.FC>;
}

const normalizeValidators = (
  validators?: Record<string, RuleObject[] | RuleObject>
) => {
  if (!validators) return null;

  return Object.fromEntries(
    Object.entries(validators).map(([name, item]) => {
      if (item instanceof Array) {
        return [name, item];
      } else {
        return [name, [item]];
      }
    })
  );
};

export const SchemaFormProvider = (
  props: React.PropsWithChildren<SFProviderProps>
) => {
  const [value] = React.useState<ContextValue>(() => {
    const fields = new Map<string, any>();

    return {
      collect: (name: string, field: any) => {
        if (process.env.NODE_ENV === 'development') {
          if (fields.has(name)) {
            throw new Error(
              `[SchemaFormProvider] duplicated field name registered! ${name}`
            );
          }
        }
        fields.set(name, field);
      },
      recycle: (name: string) => {
        fields.delete(name);
      },
      tick: (name: string) => {
        const field = fields.get(name);
        if (field.tick) field.tick();
      },
      getMeta: (name: string) => {
        return fields.get(name);
      },
      validators: {
        ...ValidatorName2V,
        ...normalizeValidators(props.validators),
      },
      components: {
        ...ComponentName2C,
        ...props.components,
      },
    };
  });

  return (
    <context.__ctx__.Provider value={value}>
      {props.children}
    </context.__ctx__.Provider>
  );
};
